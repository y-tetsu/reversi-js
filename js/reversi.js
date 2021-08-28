////////////////////////////////////////////////////
// 合わせこみ
const shrinkLimit1 = 609
const shrinkLimit2 = 467
const bottomA = 4/(shrinkLimit2 - shrinkLimit1)
const bottomB = shrinkLimit1 * bottomA * -1
const widthA = 1.35/(shrinkLimit2 - shrinkLimit1)
const widthB = shrinkLimit1 * widthA * -1
const frameW = 53.5
const bottomValue = 528
////////////////////////////////////////////////////


const boardTable = document.createElement('table');

document.getElementById('board').appendChild(boardTable);
for (let i = 0; i < 8; i++) {
    const boardCol = document.createElement('tr');
    boardTable.appendChild(boardCol);
    for (let j = 0; j < 8; j++) {
        const boardCell = document.createElement('td');
        boardCol.appendChild(boardCell);
        boardCell.addEventListener('click', onClick);
        boardCell.setAttribute('id', 8*i + j);
        boardCell.setAttribute('class', 'disc');

        var img = document.createElement('img');
        img.src = './image/black.png';
        img.setAttribute('width',  '82.0%');
        img.setAttribute('height',  'auto');
        img.setAttribute('class',  'disc');
        boardCell.appendChild(img);
    }
}


//サイズ調整
resizeWindow();  // ダミーでコール(後で見直し)
let clientWidth = document.body.clientWidth
let adjust1 = 1;
let adjust2 = 0;
let adjust3 = 0;
if (clientWidth <= shrinkLimit1) {
    adjust1 = shrinkLimit1 / clientWidth;
    adjust2 = bottomA * clientWidth + bottomB
    adjust3 = widthA * clientWidth + widthB
}

boardTable.style.bottom = bottomValue/adjust1 + adjust2 + 'px';

for (let i = 0; i < 64; i++) {
    document.getElementById(i).setAttribute('width', frameW/adjust1 - adjust3);
    document.getElementById(i).setAttribute('height', frameW/adjust1 - adjust3);
}


// マス目クリック時
function onClick() {
    const idx = Number(this.getAttribute('id'));
    alert(idx)
    alert(document.body.clientWidth)
}


// ブラウザリサイズ時
function resizeWindow(){
    let clientWidth = document.body.clientWidth
    let adjust1 = 1;
    let adjust2 = 0;
    let adjust3 = 0;
    if (clientWidth <= shrinkLimit1) {
        adjust1 = shrinkLimit1 / clientWidth;
        adjust2 = bottomA * clientWidth + bottomB
        adjust3 = widthA * clientWidth + widthB
    }

    boardTable.style.bottom = bottomValue/adjust1 + adjust2 + 'px';

    for (let i = 0; i < 64; i++) {
        document.getElementById(i).setAttribute('width', frameW/adjust1 - adjust3);
        document.getElementById(i).setAttribute('height', frameW/adjust1 - adjust3);
    }
}

window.onresize = resizeWindow;
