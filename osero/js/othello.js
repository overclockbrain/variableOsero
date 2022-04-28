/*
*メモ
*・確定が押されるたびに白黒の数をリセットしたい。
*・ひっくり返す処理は角の分を少しずつ作っている。
*・ひっくり返った時に数が変わるようにしたい。
*・もう少しスマートに記述したい。
*
*はん
*******************************************************/

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.putKoma = 4;
        this.putBl = 2;
        this.putWh = 2;
        this.boardElement = document.createElement('table');
        this.boardElement.id = 'mainTable';

        this.setStateAndElement(width, height);
    }

    setStateAndElement(width, height) {
        this.width = width;
        this.height = height;

        this.boardElement.innerHTML = '';
        this.state = null;

        this.state = new Array(height);
        for (let y = 0; y < height; y++) {
            const row = document.createElement('tr');
            this.state[y] = new Array(width);
            

            for (let x = 0; x < width; x++) {
                const cell = document.createElement('td');
                const koma = new Koma();
                koma.imgElement.addEventListener('click', () => {
                    // 暫定処理
                    if (koma.state == 0) {
                        //白と黒を交互に置くプログラム
                        if(this.putKoma % 2 == 0){
                            koma.put(1);
                            this.reverseKoma(y, x, 1);
                        }else{
                            koma.put(2);
                            this.reverseKoma(y, x, 2);
                        }
                        this.putKoma++;
                    } else {
                        koma.flip();
                    }
                    this.countKoma();
                });

                this.state[y][x] = koma;

                cell.appendChild(koma.imgElement);
                row.appendChild(cell);
            }
            this.boardElement.appendChild(row);
        }

        this.#putCenterKoma();
    }
    #putCenterKoma() {
        const basisX = this.width / 2 - 1;
        const basisY = this.height / 2 - 1;

        this.state[basisY][basisX].put(1);
        this.state[basisY][basisX + 1].put(2);
        this.state[basisY + 1][basisX].put(2);
        this.state[basisY + 1][basisX + 1].put(1);
    }
    countKoma() {
        let putWhite = document.getElementById("putWhite"),
            putBlack = document.getElementById("putBlack");

        let black = 0;
        let white = 0;
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                if (this.state[y][x]["state"] == 1) {
                    black ++;
                } else if (this.state[y][x]["state"] == 2) {
                    white ++;
                }
            }
        }
        putWhite.innerHTML = white;
        putBlack.innerHTML = black;
        console.log("black : " + black, "white : " + white);
    }
    /**
     * コマを裏返す処理　改良前提
     * @param {Number} stateY 置いたコマのX座標
     * @param {Number} stateX 置いたコマのY座標
     * @param {Number} stateColor 置いたコマの色
     */
    reverseKoma(stateY, stateX, stateColor) {
        let reverseColor = stateColor % 2 + 1;  // 裏返すコマの色
        let reverseState = new Array();

        // 縦方向(上)の探索
        let vertical_up = new Array();
        for (let y = stateY - 1; y >= 0; y --) {
            console.log("y:" + y, "x:" + stateX);
            if (this.state[y][stateX]["state"] == reverseColor) {       // 裏返すことができるコマが置かれていたら
                vertical_up.push({flag: "reverse", y: y, x: stateX});
            } else if (this.state[y][stateX]["state"] == stateColor) {  // 置いたコマと同じ色のコマが見つかったら
                vertical_up.push({flag: "end"});
                reverseState.push(vertical_up);
                break;
            } else if (this.state[y][stateX]["state"] == 0) {           // まだ何も置かれていないなら
                vertical_up.push({flag: "break"})
                reverseState.push(vertical_up);
                break;
            }
        }
        // 縦方向(下)の探索
        let vertical_down = new Array();
        for (let y = stateY + 1; y < this.height; y ++) {
            if (this.state[y][stateX]["state"] == reverseColor) {
                vertical_down.push({flag: "reverse", y: y, x: stateX});
            } else if (this.state[y][stateX]["state"] == stateColor) {
                vertical_down.push({flag: "end"});
                reverseState.push(vertical_down);
                break;
            } else if (this.state[y][stateX]["state"] == 0) {
                vertical_down.push({flag: "break"})
                reverseState.push(vertical_down);
                break;
            }
        }
        // 横方向(左)の探索
        let horizontal_left = new Array();
        for (let x = stateX - 1; x >= 0; x --) {
            console.log("y:" + stateY, "x:" + x);
            if (this.state[stateY][x]["state"] == reverseColor) {
                horizontal_left.push({flag: "reverse", stateY: stateY, x: x});
            } else if (this.state[stateY][x]["state"] == stateColor) {
                horizontal_left.push({flag: "end"});
                reverseState.push(horizontal_left);
                break;
            } else if (this.state[stateY][x]["state"] == 0) {
                horizontal_left.push({flag: "break"})
                reverseState.push(horizontal_left);
                break;
            }
        }
        // 横方向(右)の探索
        let horizontal_right = new Array();
        for (let x = stateX + 1; x < this.width; x ++) {
            console.log("y:" + stateY, "x:" + x);
            if (this.state[stateY][x]["state"] == reverseColor) {
                horizontal_right.push({flag: "reverse", stateY: stateY, x: x});
            } else if (this.state[stateY][x]["state"] == stateColor) {
                horizontal_right.push({flag: "end"});
                reverseState.push(horizontal_right);
                break;
            } else if (this.state[stateY][x]["state"] == 0) {
                horizontal_right.push({flag: "break"})
                reverseState.push(horizontal_right);
                break;
            }
        }
        console.log(reverseState);
    }
}

//
// コマの色対応表
// 0 : 無し
// 1 : 黒
// 2 : 白
// 

let KOMAIMG = {
    0: '../img/none.jpg',
    1: '../img/black.jpg',
    2: '../img/white.jpg'
}

class Koma {
    constructor() {
        this.state = 0;
        this.canPut = false;

        this.imgElement = document.createElement('img');
        this.imgElement.src = KOMAIMG[this.state];
    }

    flip() {
        this.state = this.state % 2 + 1;
        // 入れ替え時に画像を回転させる
        anime({
            targets: this.imgElement,
            rotateY: [180, -180],
            easing: 'easeInOutQuad',
            duration: 500,
        });
        setTimeout(() => {
            this.imgElement.src = KOMAIMG[this.state];
        }, 250);
    }

    put(state) {
        this.state = state;
        this.imgElement.src = KOMAIMG[this.state];
    }
}
//ひっくり返す処理のテスト
function returnKoma(){
    //現在置かれたコマの色が必要->putKomaの数を割って偶数なら黒、奇数なら白とする。
    //端っこにあるのかを判定
    if(x == 0 || y == 0 || x + 1 == this.width || y + 1 == this.height){
        //角にあるのかを判定
        //左上、右下、左下、右上
        if(x == 0 && y == 0){
            //どの座標へ移動してみるのかと、コマの状態を比較する
            for(i = x; i < this.width;i++){
                nextKoma = this.board.state[x + 1][y]["state"];
                if(nextKoma == "持ち駒ではないやつ"){
                    
                }else if(nextKoma == 0){

                }
            }
        }else if(x + 1 == this.width && y + 1 == this.height){

        }else if (x == 0 && y + 1 == this.height){

        }else if(x + 1 == this.width && y == 0){

        }
    //それ以外の場所の処理
    }else{
        
    }
}


window.onload = () => {
    let height = 4;  // boardの横のマス数
    let width = 4;  // boardの縦のマス数

    const playground = document.getElementById("playground");
    const board = new Board(height, width);
    playground.appendChild(board.boardElement);

    // rangeでマス数を設定
    let selecty = document.getElementById("selecty"),
        viewy = document.getElementById("viewy"),
        selectx = document.getElementById("selectx"),
        viewx = document.getElementById("viewx"),
        selectBtn = document.getElementById("selectBtn");

    // range「y」の値が変更されたら
    selecty.addEventListener("input", (e) => {
        viewy.value = e.target.value;
        height = e.target.value;
    });
    // range「x」の値が変更されたら
    selectx.addEventListener("input", (e) => {
        viewx.value = e.target.value;
        width = e.target.value;
    });
    // board を作成する
    selectBtn.addEventListener("click", () => {
        board.setStateAndElement(width, height);
        console.log(board.state);
    });
}
