class Board {
    constructor(width, height) {
        this.board = new Array(height);
        for (let y = 0; y < height; y++) {
            this.board[y] = new Array(width).fill(new Koma(0));
        }
    }
}

//
// コマの色対応表
// 0 : 無し
// 1 : 黒
// 2 : 白
// 

let KOMAIMG = {
    0: 'none.jpg',
    1: 'black.jpg',
    2: 'white.jpg'
}

class Koma {
    constructor(color) {
        this.color = color;

        this.img = document.createElement('img');
        this.img.src = KOMAIMG[color];
        this.domElement = document.createElement('td');
    }

    flip() {
        this.color = this.color % 2 + 1;
        this.img.src = KOMAIMG[this.color];
    }
}

window.onload = () => {
    let board = new Board(10, 10);
    console.log(board);
}