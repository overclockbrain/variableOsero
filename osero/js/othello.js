class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.state = new Array(height);
        for (let y = 0; y < height; y++) {
            this.state[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this.state[y][x] = new Koma();
            }
        }
    }

    /** 盤面のhtml要素を作成する。
     * Return : HTMLTableElement
     */
    createBoardElement() {
        const table = document.createElement('table');
        table.id = 'mainTable';

        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.appendChild(this.state[y][x].imgElement);

                row.appendChild(cell);
            }

            table.appendChild(row);
        }
        return table;
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

        this.imgElement.addEventListener('click', () => {
            // 暫定処理
            if (this.state == 0) {
                this.put(1);
            } else {
                this.flip();
            }
        });

    }

    flip() {
        this.state = this.state % 2 + 1;
        this.imgElement.src = KOMAIMG[this.state];
    }

    put(state) {
        this.state = state;
        this.imgElement.src = KOMAIMG[this.state];
    }
}

window.onload = () => {
    const playground = document.getElementById("playground");

    const board = new Board(8, 8);
    playground.appendChild(board.createBoardElement());
}