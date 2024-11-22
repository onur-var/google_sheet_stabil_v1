function populateTable(data) {
  const tbody = document.querySelector("#catalog-table tbody");
  tbody.innerHTML = ''; // Clear existing content

  data.slice(1).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((cell, index) => {
      const td = document.createElement('td');
      if (index === 3) { // Image column (assuming image URL is in column 3)
        const fileId = cell.split('/')[4]; // Extract file ID from the URL
        const img = document.createElement('img');
        img.src = `https://drive.google.com/thumbnail?id=${fileId}`;
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
