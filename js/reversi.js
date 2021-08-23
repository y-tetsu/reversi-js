const boardTable = document.createElement('table');
document.getElementById('board').appendChild(boardTable);
for (let i = 0; i < 8; i++) {
    const boardCol = document.createElement('tr');
    boardTable.appendChild(boardCol);
    for (let j = 0; j < 8; j++) {
        const boardCell = document.createElement('td');
        boardCol.appendChild(boardCell);
        boardCell.addEventListener('click', onClick);
        boardCell.setAttribute('id', 8* i + j);
    }
}

function onClick() {
    const idx = Number(this.getAttribute('id'));
    alert(idx)
}

