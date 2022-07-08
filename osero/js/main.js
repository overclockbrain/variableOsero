//  
//  main.js
//  
//  # 画面遷移
//  
//  1. 初期画面 => section class'Preparation'
//  2. ゲーム画面 => section class'game_start'
//  3. ゲーム終了 => section class'game_end'
//  4. 初期画面に戻る
//  

window.onload = () => {

    let height = 6;     // boardの横のマス数
    let width = 6;      // boardの縦のマス数
    const playground = document.getElementById('playground');
    const board = new Board(height, width);
    playground.appendChild(board.boardElement);
    playground.appendChild(board.messageElement);


    let prepElem = document.getElementById('preparation-section');
    let startElem = document.getElementById('game_start-section');
    let endElem = document.getElementById('game_end-section');

    // #画面遷移 => 1
    startElem.style.display = 'none';
    endElem.style.display = 'none';


    let selecty = document.getElementById('selecty');
    let viewy = document.getElementById('viewy');
    let selectx = document.getElementById('selectx');
    let viewx = document.getElementById('viewx');
    let selectBtn = document.getElementById('selectBtn');
    let toStartBtn = document.getElementById('toStart');


    // 盤面幅変更時
    selectx.addEventListener('input', (e) => {
        width = e.target.value;
        viewx.value = width;
    });
    selecty.addEventListener('input', (e) => {
        height = e.target.value;
        viewy.value = height;
    });

    // #画面遷移 => 2
    selectBtn.addEventListener('click', () => {
        board.setStateAndElement(width, height);
        prepElem.style.display = 'none';
        startElem.style.display = "block";
    });
    // #画面遷移 => 3
    document.querySelector('body').addEventListener('click', () => {
        if (board.winner != '') {
            document.getElementById('winner').innerHTML = 'Winner: ' + board.winner;
            startElem.style.display = 'none';
            endElem.style.display = 'block';
        }
    });
    // #画面遷移 => 4
    toStartBtn.addEventListener('click', () => {
        location.reload();
    });
    



    // ターンを交代させる
    document.getElementById('pass').addEventListener('click', () => {
        board.pass();
    });
    document.getElementById('hint').addEventListener('click', () => {
        board.search();
        console.log(board.history);
    });
}

function hint() {
    document.getElementById('hint').style.display = "inline";
}
function admin() {
    document.getElementById('hint').style.display = "inline";
    document.getElementById('admin').style.display = "inline";
}