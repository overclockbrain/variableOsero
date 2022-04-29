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
     * コマを裏返す処理
     * @param {Number} stateY 置いたコマのX座標
     * @param {Number} stateX 置いたコマのY座標
     * @param {Number} stateColor 置いたコマの色
     * @param {Number} YY 縦方向に探索する値
     * @param {Number} XX 横方向に探索する値
     * @returns 裏返した数
     */
    reverseKoma(stateY, stateX, stateColor, YY, XX) {
        /**
         * reverseArray の flag 対応表
         * 0 : 裏返し終了
         * 1 : 裏返すコマ
         * -1 : 枠またはコマが置かれていないところ
         */ 
        let reverseArray = new Array();
        let reverseCount = 0;
        let reverseColor = stateColor % 2 + 1;

        let y = stateY;
        let x = stateX;

        // 裏返すコマを探す処理
        while (true) {
            y += YY;
            x += XX;
            if (y == -1 || y == this.height || x == -1 || x == this.width) {    // 枠にあたったら
                reverseArray.push({flag: -1});
                break;
            }

            let state = this.state[y][x]['state'];
            if (state == reverseColor) {        // 裏返すことができるコマが置かれていたら
                reverseArray.push({flag: 1, y: y, x: x});
            } else if (state == stateColor) {   // 置いたコマと同じ色のコマが見つかったら
                reverseArray.push({flag: 0});
                break;
            } else {                            // まだ何も置かれていないなら
                reverseArray.push({flag: -1});
                break;
            }
        }
        // コマを裏返す処理
        if (reverseArray[reverseArray.length - 1]['flag'] == 0) {
            for (let i = 0 ; i < reverseArray.length - 1; i ++) {
                let y = reverseArray[i]['y'];
                let x = reverseArray[i]['x'];
                this.state[y][x].flip();
                reverseCount ++;
            }
        }

        return reverseCount;
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
