class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.board = new Array(height);
        for (let y = 0; y < height; y++) {
            this.board[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this.board[y][x] = new Koma();
            }
        }
    }

    createBoardElement() {
        let div = document.createElement('div');
        div.id = 'mainTable';

        for (let y = 0; y < this.height; y++) {
            let row = document.createElement('tr');
            for (let x = 0; x < this.width; x++) {
                let cell = document.createElement('td');
                cell.appendChild(this.board[y][x].imgElement);

                row.appendChild(cell);
            }

            div.appendChild(row);
        }
        return div;
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
            this.put(1);
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
    let playground = document.getElementById("playground");

    let board = new Board(8, 8);
    playground.appendChild(board.createBoardElement());
}