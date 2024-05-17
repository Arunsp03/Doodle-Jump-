//Declaring the constants

let board=document.getElementById("board");
let ctx=board.getContext("2d")
let boardheight=576;
let boardwidth=360;
let  velocity=10
let gravity=0.5;
let friction=0.9;

//doodler

let doodlerwidth=46;
let doodlerheight=46;
let doodlerx=boardwidth/2-doodlerwidth/2
let doodlery=boardheight-doodlerheight
let doodlerrightimg;
let doodlerleftimg;

let doodler={
    img:null,
    x:doodlerx,
    y:doodlery,
    width:doodlerwidth,
    height:doodlerheight,
    dx:0,
    dy:0

}

//Event listener for loading

window.addEventListener("load",function(){
    
    //Add event listener for key press
    window.addEventListener("keypress",function({key}){
        let keypressed=key.toLowerCase();
        switch (keypressed){
            case 'w':
                doodler.dy-=velocity
                break;
            case 'a':
                doodler.dx-=velocity
                break;
            case 'd':
                doodler.dx+=velocity
                break;
        }

    })

        board.height=boardheight
        board.width=boardwidth
        //loading the images
        let doodlerimg=new Image()
        doodlerimg.src='./doodler-left.png'
        doodler.img=doodlerimg
        console.log(doodler);
        doodler.img.onload=()=>{
            ctx.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height)
        }
      requestAnimationFrame(update)
})

function update()
{
    requestAnimationFrame(update)
    ctx.clearRect(0,0,board.width,board.height)
    if(doodler.y+doodler.dy+doodler.height>board.height || doodler.y+doodler.height+doodler.dy<0)
        {
            doodler.dy=-doodler.dy*friction
        }
        else {
            doodler.dy += gravity; // Apply graviy
        }
        if (doodler.x + doodler.dx  > board.width ) {
            doodler.x=0
            
        } 
        else if(doodler.x + doodler.dx<0)
            {
            doodler.x=board.width
           
            }
        else {
            doodler.dx *= friction; // Apply horizontal friction
        }

    doodler.y+=doodler.dy
    doodler.x += doodler.dx;
    ctx.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height)

    
}