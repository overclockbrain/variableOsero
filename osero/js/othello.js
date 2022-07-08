//  
//  othello.js
//  

class Board {
    constructor(width, height, color = 1) {
        this.width = width;
        this.height = height;
        this.toggleTurn = color;
        this.history = new Array();
        this.winner = '';

        this.boardElement = document.createElement('table');
        this.boardElement.id = 'mainTable';

        this.messageElement = document.createElement('div');
        this.messageElement.id = 'message';

        this.setStateAndElement(width, height);
        this.viewMessage('ゲームスタート!');
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
                    if (koma.state == 0) {
                        let array = this.searchKoma(y, x, this.toggleTurn);
                        let reFlag = array["count"];
                        
                        if (reFlag) {           // 裏返すコマの数が1以上なら
                            koma.put(this.toggleTurn);
                            this.reverseKoma(array["place"]);
                            this.history.push({color: this.toggleTurn, flag: 'put', put: [y, x], state: this.state});
                            this.countKoma();
                            this.turnEnd();
                        } else {
                            this.viewMessage('そこには置けません!!');
                        }
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

    viewMessage(message = '') {
        if (message != '') {
            let parentElement = document.createElement('h3');
            parentElement.innerHTML = message;
            this.messageElement.appendChild(parentElement);
        }
        setTimeout(() => {
            this.messageElement.innerHTML = '';
        }, 2000);
    }

    #putCenterKoma() {
        const basisX = this.width / 2 - 1;
        const basisY = this.height / 2 - 1;

        this.state[basisY][basisX].put(1);
        this.state[basisY][basisX + 1].put(2);
        this.state[basisY + 1][basisX].put(2);
        this.state[basisY + 1][basisX + 1].put(1);
    }

    /**
     * 裏返すコマを探す処理
     * @param {Number} stateY 置いたコマのX座標
     * @param {Number} stateX 置いたコマのY座標
     * @param {Number} stateColor 置いたコマの色
     * @returns 裏返すコマの座標と裏返すコマの数
     */
    searchKoma(stateY, stateX, stateColor) {
        const SEARCH_ARGS = [
            [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]
        ];
        let reverseColor = stateColor % 2 + 1;

        let reverseArray = new Array();
        let reverseCount = 0;

        for (let i in SEARCH_ARGS) {
            /**
             * searchArray の flag 対応表
             * 0 : 裏返し終了
             * 1 : 裏返すコマ
             * -1 : 枠またはコマが置かれていないところ
             */ 
            let searchArray = new Array();
            let y = stateY;
            let x = stateX;

            let YY = SEARCH_ARGS[i][0];
            let XX = SEARCH_ARGS[i][1];
            // 裏返すコマを探す処理
            while (true) {
                y += YY;
                x += XX;
                if (y == -1 || y == this.height || x == -1 || x == this.width) {    // 枠にあたったら
                    searchArray.push({flag: -1});
                    break;
                }

                let state = this.state[y][x]['state'];
                if (state == reverseColor) {        // 裏返すことができるコマが置かれていたら
                    searchArray.push({flag: 1, y: y, x: x});
                } else if (state == stateColor) {   // 置いたコマと同じ色のコマが見つかったら
                    searchArray.push({flag: 0});
                    break;
                } else {                            // まだ何も置かれていないなら
                    searchArray.push({flag: -1});
                    break;
                }
            }
            if (searchArray[searchArray.length - 1]['flag'] == 0) {
                for (let i = 0 ; i < searchArray.length - 1; i ++) {
                    let y = searchArray[i]['y'];
                    let x = searchArray[i]['x'];
                    reverseArray.push([y, x]);
                    reverseCount ++;
                }
            }
        }

        return {count: reverseCount, place: reverseArray};
    }
    
    reverseKoma(reverseArray) {
        for (let i in reverseArray) {
            let y = reverseArray[i][0];
            let x = reverseArray[i][1];
            this.state[y][x].flip();
        }
    }

    countKoma() {
        let putWhite = document.getElementsByClassName('putWhite'),
            putBlack = document.getElementsByClassName('putBlack');

        let black = 0;
        let white = 0;
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                if (this.state[y][x]['state'] == 1) {
                    black ++;
                } else if (this.state[y][x]['state'] == 2) {
                    white ++;
                }
            }
        }
        for (let i = 0; i < putWhite.length; i ++) {
            putWhite[i].innerHTML = white;
        }
        for (let i = 0; i < putBlack.length; i ++) {
            putBlack[i].innerHTML = black;
        }
        let winFlag = black - white;
        if (winFlag > 0) {
            return 'black';
        } else if (winFlag < 0) {
            return 'white';
        } else {
            return 'draw';
        }
        
    }

    turnEnd() {
        let turnElement = document.getElementById('turn');
        this.toggleTurn = this.toggleTurn % 2 + 1;
        turnElement.innerHTML = KOMACOLOR[this.toggleTurn];
        console.log(this.history);

        // game終了条件
        //  # 盤面上全てにコマがおかれている
        //  # pass が二回連続
        let count = this.width * this.height - 4;
        for (let i in this.history) {
            if (this.history[i].flag == 'put') {
                count --;
            }
        }
        let passIndex = Object.keys(this.history).length - 1;
        if (this.history[passIndex].flag == 'pass') {
            passIndex --;
            if (this.history[passIndex].flag == 'pass') {
                count = 0;
            }
        }
        if (!(count)) {
            this.viewMessage('ゲーム終了!!<br>結果発表!');
            setTimeout(() => {
                this.winner = this.countKoma();
            }, 500);
        } else {
            if (this.toggleTurn == 2) {
                setTimeout(() => {
                    this.bestHand();
                }, 500);
            }
        }
    }

    search(view = true) {
        let reverseArray = new Array();
        let reFlag;

        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                if (this.state[y][x]["state"] == 0) {
                    let array = this.searchKoma(y, x, this.toggleTurn);
                    reFlag = array["count"];
                    if (reFlag) {
                        reverseArray.push({num: reFlag, y: y, x: x});
                        if (view) {
                            this.state[y][x].hint();
                        }
                    }
                }
            }
        }

        return Object.keys(reverseArray).length;
    }
    corner(y, x) {
        if ((y == 0 && x == 0) || (y == 0 && x == this.width - 1) || 
            (y == this.height - 1 && x == 0) || (y == this.height - 1 && x == this.width - 1)) {
            
            return true;
        } else {
            return false;
        }
    }
    pass() {
        let passFlag = this.search(false);
        let message;
        if (passFlag) {
            message = '置ける場所があるので<br>パスできません!!';
        } else {
            message = this.toggleTurn == 1 ? '黒 がパスしました!' : '白 がパスしました!';
            this.history.push({color: this.toggleTurn, flag: 'pass', put: [], state: this.state});
            this.turnEnd();
        }
        this.viewMessage(message);
    }

    bestHand() {
        let aheadColor = this.toggleTurn;
        let aheadReverse = new Array();

        let allAhead = new Array();
        allAhead.push({count: 0});

        let nowBoard = new Array();
        for (let i in this.state) {
            nowBoard[i] = new Array();
            for (let j in this.state[i]) {
                nowBoard[i][j] = this.state[i][j]["state"];
            }
        }
        
        aheadReverse = putSearch(aheadColor, nowBoard);
        aheadColor = aheadColor % 2 + 1;

        for (let i in aheadReverse) {
            let copyBoard = new Array();
            for (let a in nowBoard) {
                copyBoard.push(nowBoard[a].concat());
            }

            let y = aheadReverse[i][aheadReverse[i].length - 1][0];
            let x = aheadReverse[i][aheadReverse[i].length - 1][1];
            copyBoard[y][x] = aheadColor;

            if (this.corner(y, x)) {
                allAhead = new Array();
                allAhead.push({
                    count: 999,
                    my1: aheadReverse[i], 
                    your1: "", 
                    my2: "",
                    your2: "",
                    my3: ""
                });
            }

            let aheadBoard2 = reKoma(aheadReverse[i], copyBoard);
            let aheadReverse2 = putSearch(aheadColor, aheadBoard2);
            aheadColor = aheadColor % 2 + 1;

            allAhead = compare(allAhead, aheadBoard2, this.toggleTurn, aheadReverse[i]);

            for (let j in aheadReverse2) {
                let copyBoard = new Array();
                for (let a in aheadBoard2) {
                    copyBoard.push(aheadBoard2[a].concat());
                }
                let y = aheadReverse2[j][aheadReverse2[j].length - 1][0];
                let x = aheadReverse2[j][aheadReverse2[j].length - 1][1];
                copyBoard[y][x] = aheadColor;

                let aheadBoard3 = reKoma(aheadReverse2[j], copyBoard);
                let aheadReverse3 = putSearch(aheadColor, aheadBoard3);
                aheadColor = aheadColor % 2 + 1;

                for (let k in aheadReverse3) {
                    let copyBoard = new Array();
                    for (let a in aheadBoard3) {
                        copyBoard.push(aheadBoard3[a].concat());
                    }
                    let y = aheadReverse3[k][aheadReverse3[k].length - 1][0];
                    let x = aheadReverse3[k][aheadReverse3[k].length - 1][1];
                    copyBoard[y][x] = aheadColor;

                    let aheadBoard4 = reKoma(aheadReverse3[k], copyBoard);
                    let aheadReverse4 = putSearch(aheadColor, aheadBoard3);
                    aheadColor = aheadColor % 2 + 1;

                    allAhead = compare(allAhead, aheadBoard4, this.toggleTurn,
                        aheadReverse[i], aheadReverse2[j], aheadReverse3[k]);

                    for (let l in aheadReverse4) {
                        let copyBoard = new Array();
                        for (let a in aheadBoard4) {
                            copyBoard.push(aheadBoard4[a].concat());
                        }
                        let y = aheadReverse4[l][aheadReverse4[l].length - 1][0];
                        let x = aheadReverse4[l][aheadReverse4[l].length - 1][1];
                        copyBoard[y][x] = aheadColor;
    
                        let aheadBoard5 = reKoma(aheadReverse4[l], copyBoard);
                        let aheadReverse5 = putSearch(aheadColor, aheadBoard4);
                        aheadColor = aheadColor % 2 + 1;

                        for (let m in aheadReverse5) {
                            let copyBoard = new Array();
                            for (let a in aheadBoard5) {
                                copyBoard.push(aheadBoard5[a].concat());
                            }
                            let y = aheadReverse5[m][aheadReverse5[m].length - 1][0];
                            let x = aheadReverse5[m][aheadReverse5[m].length - 1][1];
                            copyBoard[y][x] = aheadColor;
        
                            let aheadBoard6 = reKoma(aheadReverse5[m], copyBoard);
                            if (m == aheadReverse5.length - 1) {
                                aheadColor = aheadColor % 2 + 1;
                            }
                            
                            allAhead = compare(allAhead, aheadBoard6, this.toggleTurn, aheadReverse[i], 
                                aheadReverse2[j], aheadReverse3[k], aheadReverse4[l], aheadReverse5[m]);
                        }
                    }
                }
            }
        }

        // 2手先の最善手を読む場合
        // 1手目（自分）が打てる全ての手を列挙
        // 1手目（自分）を反映した盤面における相手の手を全て列挙
        // 2手目（自分）が打てる全ての手を列挙
        
        if (allAhead[0]["count"]) {
            console.log(allAhead);
            let randomNum = Math.floor(Math.random() * allAhead.length);
            let answer = allAhead[randomNum]["my1"][allAhead[randomNum]["my1"].length - 1];
            let array = this.searchKoma(answer[0], answer[1], this.toggleTurn);
            this.state[answer[0]][answer[1]].put(this.toggleTurn);
            this.reverseKoma(array["place"]);
            this.history.push({color: this.toggleTurn, flag: 'put', put: [answer[0], answer[1]], state: this.state});
            this.countKoma();
            this.turnEnd();
        } else {
            console.log("Can't put it anywhere.");
            this.pass();
        }
    }
}


//
// コマの色対応表
// 0 : 無し
// 1 : 黒
// 2 : 白
// 
const KOMACOLOR = {
    0: 'no', 1: '黒', 2: '白'
}
const KOMAIMG = {
    0: './img/none_1.png',
    1: './img/black.jpg',
    2: './img/white.jpg'
}

class Koma {
    constructor() {
        this.state = 0;

        this.imgElement = document.createElement('img');
        this.imgElement.src = KOMAIMG[this.state];
    }

    flip() {
        this.state = this.state % 2 + 1;
        anime({     // 入れ替え時に画像を回転させる
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

    hint() {
        this.imgElement.style.backgroundColor = "orangered";
        setTimeout(() => {
            this.imgElement.style.backgroundColor = "lime";
        }, 2000);
    }
}



function putSearch(color, board) {
    let putArray = new Array();
    for (let y = 0; y < board.length; y ++) {
        for (let x = 0; x < board[y].length; x ++) {
            if (board[y][x] == 0) {
                let array = reSearch(y, x, color, board);
                let reFlag = array["count"];

                if (reFlag) {
                    array["count"] ++;
                    array["place"].push([y, x]);
                    putArray.push(array["place"]);
                }
            }
        }
    }
    return putArray;
}

function reSearch(stateY, stateX, stateColor, board) {
    const SEARCH_ARGS = [
        [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]
    ];
    let reverseColor = stateColor % 2 + 1;

    let reverseArray = new Array();
    let reverseCount = 0;

    for (let i in SEARCH_ARGS) {
        //
        // searchArray の flag 対応表
        // 0 : 裏返し終了
        // 1 : 裏返すコマ
        // -1 : 枠またはコマが置かれていないところ
        // 
        let searchArray = new Array();
        let y = stateY;
        let x = stateX;

        let YY = SEARCH_ARGS[i][0];
        let XX = SEARCH_ARGS[i][1];
        // 裏返すコマを探す処理
        while (true) {
            y += YY;
            x += XX;
            if (y == -1 || y == board.length || x == -1 || x == board[y].length) {    // 枠にあたったら
                searchArray.push({flag: -1});
                break;
            }

            let state = board[y][x];
            if (state == reverseColor) {        // 裏返すことができるコマが置かれていたら
                searchArray.push({flag: 1, y: y, x: x});
            } else if (state == stateColor) {   // 置いたコマと同じ色のコマが見つかったら
                searchArray.push({flag: 0});
                break;
            } else {                            // まだ何も置かれていないなら
                searchArray.push({flag: -1});
                break;
            }
        }
        if (searchArray[searchArray.length - 1]['flag'] == 0) {
            for (let i = 0 ; i < searchArray.length - 1; i ++) {
                let y = searchArray[i]['y'];
                let x = searchArray[i]['x'];
                reverseArray.push([y, x]);
                reverseCount ++;
            }
        }
    }

    return {count: reverseCount, place: reverseArray};
}

function reKoma(reverse, board) {
    for (let i = 0; i < reverse.length; i ++) {
        let y = reverse[i][0];
        let x = reverse[i][1];
        board[y][x] = board[y][x] % 2 + 1;
    }

    return board;
}

function countColor(array, color) {
    let count = 0;
    for (let y in array) {
        for (let x in array[y]) {
            if (array[y][x] == color) {
                count ++;
            }
        }
    }
    return count;
}
/* function view(array) {
    for (let y in array) {
        console.log(array[y]);
    }
} */
function compare(allAhead, aheadBoard, color, 
    ahReberse = "", ahReberse2 = "", ahReberse3 = "", ahReberse4 = "", ahReberse5 = "") {
    let count = countColor(aheadBoard, color);
    let maxCount = allAhead[0]["count"];
    if (count > maxCount) {
        allAhead = new Array();
        allAhead.push({
            count: count,
            my1: ahReberse, 
            your1: ahReberse2, 
            my2: ahReberse3,
            your2: ahReberse4,
            my3: ahReberse5
        });
    } else if (count == maxCount) {
        allAhead.push({
            count: count,
            my1: ahReberse, 
            your1: ahReberse2, 
            my2: ahReberse3,
            your2: ahReberse4,
            my3: ahReberse5
        });
    }
    return allAhead;
}
