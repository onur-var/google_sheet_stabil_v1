const API_KEY = 'AIzaSyDltb5FbPvL9bLgj_GK4_DEDaPK0A7oM_g'; // Google Sheets API Key
const SHEET_ID = '16XhSuD_8tEJ0wK_6H5f7csqIfsF6pFneNSphVb_6wsk'; // Google Sheet ID
const RANGE = 'Sayfa1'; // Sheet adı (genelde "Sheet1")

async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Error fetching data:", response.status, response.statusText);
        return [];
    }
    const data = await response.json();
    return data.values;
}

function convertDriveLinkToThumbnail(link) {
    // uc?export=view&id= formatındaki linki dönüştür
    const ucRegex = /https:\/\/drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/;
    const ucMatch = link.match(ucRegex);
    
    if (ucMatch && ucMatch[1]) {
        // Doğrudan thumbnail URL'si
        return `https://drive.google.com/thumbnail?id=${ucMatch[1]}`;
    }

    // file/d/{id} formatındaki linki dönüştür
    const fileRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const fileMatch = link.match(fileRegex);

    if (fileMatch && fileMatch[1]) {
        // file/d/{id} formatını uc?export=view&id= formatına çevir
        return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }

    // view?usp=sharing formatındaki linki dönüştür
    const viewRegex = /https:\/\/drive\.google\.com\/.*\/d\/([a-zA-Z0-9_-]+)/;
    const viewMatch = link.match(viewRegex);

    if (viewMatch && viewMatch[1]) {
        // view?usp=sharing formatını uc?export=view&id= formatına çevir
        return `https://drive.google.com/uc?export=view&id=${viewMatch[1]}`;
    }

    // Geçersiz format
    return 'Geçersiz Google Drive linki';
}



function populateTable(data) {
    const tbody = document.querySelector("#catalog-table tbody");
    tbody.innerHTML = ''; // Mevcut içeriği temizle
    data.slice(1).forEach(row => { // İlk satır başlıklarıdır
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            if (index === 3) { // Image column
                const img = document.createElement('img');
                const thumbnailUrl = convertDriveLinkToThumbnail(cell);  // Linki dönüştür
                img.src = thumbnailUrl;
                console.log(thumbnailUrl); // Linki kontrol etmek için
                img.alt = 'Catalog Image';
                img.style.width = '100px';
                td.appendChild(img);
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

(async function init() {
    const data = await fetchSheetData();
    populateTable(data);
})();
