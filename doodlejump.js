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

//Platform

let platformarray=[]
let platformheight=18;
let platformwidth=60;
let platformimg;

//Event listener for loading

window.addEventListener("load",function(){
    let doodlerimg;
    //Add event listener for key press
    window.addEventListener("keypress",function({key}){
        let keypressed=key.toLowerCase();
        switch (keypressed){
            case 'w':
                doodler.dy-=velocity
                break;
            case 'a':
                doodler.dx-=velocity
                doodlerimg.src='./doodler-left.png'
        doodler.img=doodlerimg
                break;
            case 'd':
                doodler.dx+=velocity
                doodlerimg.src='./doodler-right.png'
        doodler.img=doodlerimg
                break;
        }

    })

        board.height=boardheight
        board.width=boardwidth
        //loading the images
        doodlerimg=new Image()
        doodlerimg.src='./doodler-left.png'
        doodler.img=doodlerimg
        // console.log(doodler);
        doodler.img.onload=()=>{
            ctx.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height)
        }
        platformimg=new Image()
        platformimg.src="./platform.png"
        placeplatform();
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
    //Redraw doodler after the positions have been updated
    ctx.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height)
    for(let i=0;i<platformarray.length;i++)
        {
            let platform=platformarray[i];
            ctx.drawImage(platform.img,platform.x,platform.y,platform.width,platform.height)
            if (collision(doodler, platform)) {
                if (doodler.dy > 0 && doodler.y + doodler.height - doodler.dy <= platform.y) {
                    doodler.dy = 0; // Stop downward movement
                    doodler.y = platform.y - doodler.height; // Position doodler on top of the platform
                }
            }
        
        }
   
}
function placeplatform(){
let platform={
    height:platformheight,
    width:platformwidth,
    x:boardwidth/2,
    y:boardheight/2,
    img:platformimg,
}
platformarray.push(platform);
}

function collision(doodler, platform) {
    // Check for horizontal collision
    if (doodler.x < platform.x + platform.width && doodler.x + doodler.width > platform.x) {
        // Check for vertical collision
        if (doodler.y < platform.y + platform.height && doodler.y + doodler.height > platform.y) {
            // Ensure collision only when falling down on the platform
            return doodler.y + doodler.height <= platform.y + doodler.dy;
        }
    }
    return false;
}