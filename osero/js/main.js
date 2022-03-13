function viewImg(){
    let img = document.getElementById("pic");
    img.src = "../img/white.jpg";
    setInterval(function(){
        img.src = "../img/black.jpg";
    },1000);
}