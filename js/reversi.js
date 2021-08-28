////////////////////////////////////////////////////
// 合わせこみ
/*const shrinkLimit1 = 609;*/
const shrinkLimit1 = 829;
/*const shrinkLimit2 = 467;*/
const shrinkLimit2 = 467;
/*const bottomA = 4/(shrinkLimit2 - shrinkLimit1);*/
const bottomA = 8/(shrinkLimit2 - shrinkLimit1);
const bottomB = shrinkLimit1 * bottomA * -1;
const widthA = 1.35/(shrinkLimit2 - shrinkLimit1);
const widthB = shrinkLimit1 * widthA * -1;
//const frameW = 53.5;
const frameW = 73.5;
/*const bottomValue = 528;*/
const bottomValue = 710;
const discOffset = 100;
const blank = 0;
const black = 1;
const white = -1;
const boardSize = 8;
let scoreB = 2;
let scoreW = 2;
let turn = black;
////////////////////////////////////////////////////


const boardTable = document.createElement('table');

document.getElementById('board').appendChild(boardTable);
for (let i = 0; i < boardSize; i++) {
    const boardCol = document.createElement('tr');
    boardTable.appendChild(boardCol);
    for (let j = 0; j < boardSize; j++) {
        const boardCell = document.createElement('td');
        boardCol.appendChild(boardCell);
        boardCell.addEventListener('click', onClick);
        boardCell.setAttribute('id', boardSize*i + j);

        var img = document.createElement('img');
        img.src = './image/blank.png';
        img.setAttribute('width',  '82.0%');
        img.setAttribute('height',  'auto');
        img.setAttribute('class',  'disc');
        img.setAttribute('id',  boardSize*i + j + discOffset);
        boardCell.appendChild(img);
    }
}

let board = [];
for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
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


// 手番の変更
function changeTurn(turn) {
    let next_turn = blank;
    switch (turn) {
        case black:
            next_turn = white;
            break;
        case white:
            next_turn = black;
            break;
        default:
            break;
    }
    return next_turn;
}

// パスかどうか
function isPass(color) {
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            let index = x + y*boardSize;
            if (board[index] == blank) {
                for (const d of directions) {
                    let next_x = x;
                    let next_y = y;
                    dx = d[0];
                    dy = d[1];
                    let opponent = [];
                    while(1) {
                        next_x += dx;
                        next_y += dy;
                        const next_index = next_x + next_y*boardSize;
                        if (is_inside(next_x, next_y) && board[next_index] == getOpponent(color)) {
                            opponent.push(next_index);
                        }
                        else {
                            break;
                        }
                    }
                    const next_index = next_x + next_y*boardSize;
                    if (is_inside(next_x, next_y) && board[next_index] == color) {
                        if (opponent.length > 0) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

// マス目クリック時
function onClick() {
    const idx = Number(this.getAttribute('id'));
    const x = idx % boardSize;
    const y = Math.floor(idx / boardSize);
    const flipped = putDisc(turn, x, y);
    if (flipped) {
        updateScore(turn, flipped);
        turn = changeTurn(turn);
        if (isPass(turn)) {
            turn = changeTurn(turn);
            if (isPass(turn)) {
                sleep(0.1, function () {
                    alert('Game End');
                });
            }
            else {
                sleep(0.1, function () {
                    if (turn == black) {
                        alert('White Pass');
                    }
                    else {
                        alert('Black Pass');
                    }
                });
            }
        }
        if (turn == black) {
            document.getElementById('turn').textContent = 'black';
        }
        else {
            document.getElementById('turn').textContent = 'white';
        }
    }
    /*alert(idx)*/
    /*alert(document.body.clientWidth)*/
}

function updateScore(turn, flipped) {
    if (turn == black) {
        scoreB += flipped + 1;
        scoreW -= flipped;
    }
    else {
        scoreW += flipped + 1;
        scoreB -= flipped;
    }
    document.getElementById('scoreB').textContent = scoreB;
    document.getElementById('scoreW').textContent = scoreW;
}

function sleep(waitSec, callbackFunc) {
    // 経過時間（秒）
    var spanedSec = 0;
    // 1秒間隔で無名関数を実行
    var id = setInterval(function () {
        spanedSec++;
        // 経過時間 >= 待機時間の場合、待機終了。
        if (spanedSec >= waitSec) {

            // タイマー停止
            clearInterval(id);

            // 完了時、コールバック関数を実行
            if (callbackFunc) callbackFunc();
        }
    }, 1000);
}

// 石が置ける場合は置いて相手の石をひっくり返す
const directions = [
    [-1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1],
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
    [-1, -1]
]

function putDisc(color, x, y) {
    let index = x + y*boardSize;
    let flippable = [];
    if (board[index] == blank) {
        for (const d of directions) {
            let next_x = x;
            let next_y = y;
            dx = d[0];
            dy = d[1];
            let opponent = [];
            while(1) {
                next_x += dx;
                next_y += dy;
                const next_index = next_x + next_y*boardSize;
                if (is_inside(next_x, next_y) && board[next_index] == getOpponent(color)) {
                    opponent.push(next_index);
                }
                else {
                    break;
                }
            }

            const next_index = next_x + next_y*boardSize;
            if (is_inside(next_x, next_y) && board[next_index] == color) {
                if (opponent.length > 0) {
                    for (const o of opponent) {
                        flippable.push(o);
                    }
                }
            }
        }

        if (flippable.length > 0) {
            setDisc(color, x, y);
            for (const f of flippable) {
                let flippable_x = f % boardSize;
                let flippable_y = Math.floor(f / boardSize);
                setDisc(color, flippable_x, flippable_y);
            }
        }
    }

    return flippable.length;
}

function is_inside(x, y) {
    if (x >= 0 && x < boardSize) {
        if (y >= 0 && y < boardSize) {
            return true;
        }
    }
    return false;
}

function getOpponent(color) {
    if (color == black) {
        return white;
    }
    return black;
}

// 石を強制的に置く
function setDisc(color, x, y) {
    let index = x + y*boardSize;
    board[index] = color;
    switch(color) {
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
