window.onload = function(){
    const Height = 8;
    const Width = 6;
    //let img = document.getElementById("pic");
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
    let mapData = "";
    mapData += "<table id='mainTable'>";
    for(let i = 0;i < Width;i++){
        mapData += "<tr>"; 
        for(let j = 0;j < Height;j++){
            //脳筋計算で初期配置を決定
            if(j == (Height / 2) && i == (Width / 2) || j == (Height / 2) -1 && i == (Width / 2) - 1){
                mapData += "<td><img id='pic' src='../img/white.jpg'></td>";
            }else if(j == (Height / 2) && i == (Width / 2) - 1 || j == (Height / 2) - 1 && i == (Width / 2)){
                mapData += "<td><img id='pic' src='../img/black.jpg'></td>";
            }else{
                mapData += "<td><img id='pic_" + i + "_" + j + "' src='../img/none.jpg'></td>";
            }
        }
        mapData += "</tr>"; 
    }
    mapData += "</table>";
    map.innerHTML = mapData;
}