//初期呼び出し時に実行される処理
window.onload = function(){
    const Height = 6; //高さ
    const Width = 6;  //横幅

    //ゲームのマスを表示
    makePlayground(Height,Width);

    //マスの縦横の数を入力するセレクトボックスを作成
    selectNum();

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

function selectNum(){
    //初期設定
    let box = "";

    //データを4から2飛びで20まで要素を作成
    for(i = 4; i < 20; i += 2){
        box += "<option value='" + i +"'>" + i + "</option>";
    }
    //セレクトボックス追加処理
    $("#selectNum").append(box);
    $("#selectNum2").append(box);
}