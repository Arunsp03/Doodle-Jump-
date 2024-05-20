//Declaring the constants

let board=document.getElementById("board");
let ctx=board.getContext("2d")
let boardheight=576;
let boardwidth=360;
let  velocity=7;
let gravity=0.5;
let friction=0.9;
let isgameover=false
let score=0

//doodler

let doodlerwidth=46;
let doodlerheight=46;
let doodlerx=boardwidth/2-doodlerwidth/2
let doodlery=boardheight-doodlerheight
let doodlerrightimg;
let doodlerleftimg;

let doodler={
    img:null,
    x:50,
    y:boardheight-30-doodlerheight,
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
    window.addEventListener("keyup",function({key}){
        let keypressed=key.toLowerCase();
        switch (keypressed){
            case 'w':
                doodler.dy-=velocity
                //Restart in case game is over
                if(isgameover){
                    isgameover=false
                    platformarray=[]
                    doodler={
                        img:doodlerimg,
                        x:50,
                        y:boardheight-30-doodlerheight,
                        width:doodlerwidth,
                        height:doodlerheight,
                        dx:0,
                        dy:0
                    
                    }
                    placeplatform();
                    update()
                }
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
        placeplatform()
      requestAnimationFrame(update)
})

function update()
{
    if(doodler.y>=525)
        {
            isgameover=true;
            ctx.fillStyle="black"   
            ctx.font="45px sans-serif"
            ctx.fillText("Game Over",20,60)
            ctx.fillStyle='black'
            ctx.font="40px sans-serif"
            ctx.fillText("Final Score "+score,20,100)
            return
        }

    
    
    ctx.clearRect(0,0,board.width,board.height)
    
    ctx.fillStyle='black'
    ctx.font="20px sans-serif"
    ctx.fillText("Score "+score,10,20)
    requestAnimationFrame(update)

    
    if(doodler.y+doodler.dy+doodler.height>board.height)
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
            
            //Keep doodler static and move the platforms
            if(doodler.dy<0 && doodler.y<board.height*(2/4))
            {
                platform.y+=10;
                
              
            }
            
            ctx.drawImage(platform.img,platform.x,platform.y,platform.width,platform.height)
       
            if (collision(doodler, platform)) {
                
               
                if (doodler.dy > 0 && doodler.y + doodler.height - doodler.dy <= platform.y) {
                    doodler.dy = 0; // Stop downward movement
                
                    doodler.y = platform.y - doodler.height; // Position doodler on top of the platform
                
                    if(!platform.passed )
                        {
                            score+=1;
                            platform.passed=true
                        }
                }

                
            }
         
          
            if (platform.y > board.height) {
                platformarray.splice(i, 1);
                i--;
            }
        }
        
        if (platformarray.length < 6) {
            newPlatform();
        }     
}
function placeplatform(){
let platform={
    height:platformheight,
    width:platformwidth,
    x:50,
    y:boardheight-30,
    img:platformimg,
}
platformarray.push(platform);

for (let i = 0; i < 6; i++) {
    let randomX = Math.floor(Math.random() * boardwidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformimg,
        x : randomX,
        y : boardheight - 75*i - 150,
        width : platformwidth,
        height : platformheight,
        passed:false
    }
    platformarray.push(platform);
}
}

function newPlatform()
{
    let randomX = Math.floor(Math.random() * boardwidth*3/4); //(0-1) * boardWidth*3/4
    let platform={
        height:platformheight,
        width:platformwidth,
        x : randomX,
        y:-10,
        img:platformimg,
        passed:false
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