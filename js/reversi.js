////////////////////////////////////////////////////
// 合わせこみ
const shrinkLimit1 = 609;
const shrinkLimit2 = 467;
const bottomA = 4/(shrinkLimit2 - shrinkLimit1);
const bottomB = shrinkLimit1 * bottomA * -1;
const widthA = 1.35/(shrinkLimit2 - shrinkLimit1);
const widthB = shrinkLimit1 * widthA * -1;
const frameW = 53.5;
const bottomValue = 528;
const discOffset = 100;
const blank = 0;
const black = 1;
const white = -1;
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

        var img = document.createElement('img');
        img.src = './image/blank.png';
        img.setAttribute('width',  '82.0%');
        img.setAttribute('height',  'auto');
        img.setAttribute('class',  'disc');
        img.setAttribute('id',  8*i + j + discOffset);
        boardCell.appendChild(img);
    }
}

let board = [];
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        board.push(blank);
    }
}

setDisc(white, 3, 3);
setDisc(black, 4, 3);
setDisc(black, 3, 4);
setDisc(white, 4, 4);


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
    let x = idx % 8;
    let y = Math.floor(idx / 8);

    switch (board[idx]) {
        case blank:
            setDisc(black, x, y);
            break
        case black:
            setDisc(white, x, y);
            break
        case white:
            setDisc(blank, x, y);
            break
        default:
            break;
    }

    /*alert(idx)*/
    /*alert(document.body.clientWidth)*/
}

// 石を置く
function setDisc(disc, x, y) {
    let index = x + y*8;
    board[index] = disc;
    switch(disc) {
        case blank:
            document.getElementById(discOffset+index).src = './image/blank.png';
            break;
        case black:
            document.getElementById(discOffset+index).src = './image/black.png';
            break;
        case white:
            document.getElementById(discOffset+index).src = './image/white.png';
            break;
        default:
            break;
    }
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
