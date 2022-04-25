//初期呼び出し時に実行される処理
window.onload = function(){
    const Height = 6; //高さ
    const Width = 6;  //横幅

    //ゲームのマスを表示
    makePlayground(Height,Width);

    // imgの上にマウスカーソルがのると
    $("img").on({
        "mouseover": function() {
            this.src = "../img/black.jpg";
            console.log(this.id);       // imgのidを表示
        },
        "mouseout": function() {
            this.src = "../img/none.jpg";
        },
    });
}

//表を作る関数
function makePlayground(Height,Width){
    let map = document.getElementById("playground");
    let mapData = "<table id='mainTable'>";
    for(let i = 0;i < Height;i++){
        mapData += "<tr>"; 
        for(let j = 0;j < Width;j++){
            //脳筋計算で初期配置を決定
            if(i == (Height / 2) && j == (Width / 2) || i == (Height / 2) -1 && j == (Width / 2) - 1){
                mapData += "<td><img id='pic' src='../img/white.jpg'></td>";
            }else if(i == (Height / 2) && j == (Width / 2) - 1 || i == (Height / 2) - 1 && j == (Width / 2)){
                mapData += "<td><img id='pic' src='../img/black.jpg'></td>";
            }else{
                mapData += "<td><img id='pic_" + i + "_" + j + "' src='../img/none.jpg'></td>";
            }
        }
        mapData += "</tr>"; 
    }
    mapData += "</table>";

    //ゲームのマスを表示
    map.innerHTML = mapData;
}
function getXYcoord(){
    $("td").on({
        "click":function(){
            //縦
            var row = $(this).closest('tr').index();
            //横
            var col = this.cellIndex;
            console.log('Row: ' + row + ', Column: ' + col);
        }
    })
}
//ひっくり返す処理のテスト
function returnKoma(){
    //端っこにあるのかを判定
    if(x == 0 || y == 0 || x + 1 == width || y + 1 == height){
        //角にあるのかを判定
        //左上、右下、左下、右上
        if(x == 0 && y == 0){
            //どの座標へ移動してみるのかと、コマの状態を比較する
            for(i = x; i < width;i++){
                if()
            }
        }else if(x + 1 == width && y + 1 == height){

        }else if (x == 0 && y + 1 == height){

        }else if(x + 1 == width && y == 0){

        }
    //それ以外の場所の処理
    }else{
        
    }
}
/*
メモ：二次元配列
空白：-1
黒：1
白：0
置く前に確認ウィンドウを表示する
結果判定がない。
両方おけなくなったとき
順番を管理
*/ 