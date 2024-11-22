const API_KEY = 'AIzaSyDltb5FbPvL9bLgj_GK4_DEDaPK0A7oM_g'; // Google Sheets API Key
const SHEET_ID = '16XhSuD_8tEJ0wK_6H5f7csqIfsF6pFneNSphVb_6wsk'; // Google Sheet ID
const RANGE = 'Sayfa1'; // Sheet adı (genelde "Sheet1")

// Google Drive dosyasının tam URL'sini ID'ye çeviren fonksiyon
function getDriveThumbnailUrl(fileUrl) {
    // URL'den dosya ID'sini ayırma
    const fileId = fileUrl.split('/d/')[1].split('/')[0];
    return `https://drive.google.com/thumbnail?id=${fileId}`;
}

async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
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
                const thumbnailUrl = getDriveThumbnailUrl(cell); // Google Drive URL'sini thumbnail formatına çevir
                img.src = thumbnailUrl;
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
