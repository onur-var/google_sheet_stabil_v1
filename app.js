const API_KEY = 'AIzaSyDltb5FbPvL9bLgj_GK4_DEDaPK0A7oM_g'; // Google Sheets API Key
const SHEET_ID = '16XhSuD_8tEJ0wK_6H5f7csqIfsF6pFneNSphVb_6wsk';     // Google Sheet ID
const RANGE = 'Sayfa1';                      // Sheet adı (genelde "Sheet1")

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

function formatDriveLink(link) {
    // Google Drive bağlantısını kontrol et ve dönüştür
    if (link.includes("drive.google.com")) {
        const fileId = link.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
    }
    return link; // Eğer Drive bağlantısı değilse, olduğu gibi döndür
}

function fetchImages() {
    fetch("GOOGLE_SHEET_URL")
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
                const formattedLink = formatDriveLink(row.imageUrl); // Sütun adını kontrol edin
                console.log("Formatted Link:", formattedLink);

                // DOM'da resmi göstermek için:
                const img = document.createElement("img");
                img.src = formattedLink;
                img.alt = "Image";
                document.body.appendChild(img);
            });
        })
        .catch(error => console.error("Hata:", error));
}
fetchImages();


function populateTable(data) {
    const tbody = document.querySelector("#catalog-table tbody");
    tbody.innerHTML = ''; // Mevcut içeriği temizle
    data.slice(1).forEach(row => { // İlk satır başlıklarıdır
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            if (index === 3) { // Image column
                const img = document.createElement('img');
                img.src = cell;
                console.log(cell);
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
