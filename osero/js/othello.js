class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;


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
                        koma.put(1);
                    } else {
                        koma.flip();
                    }
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
        /* anime({
            targets: this.imgElement,
            rotateY: [180, -180],
            easing: 'easeInOutQuad',
            duration: 500,
        });
        setTimeout(() => {
            this.imgElement.src = KOMAIMG[this.state];
        }, 250); */
        this.imgElement.src = KOMAIMG[this.state];
    }

    put(state) {
        this.state = state;
        this.imgElement.src = KOMAIMG[this.state];
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
