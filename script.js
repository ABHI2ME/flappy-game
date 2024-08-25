const container = document.querySelector('.container') ;
const startSound = document.querySelector('.start-sound') ;
const overSound = document.querySelector('.over-sound') ;
let gameBoard ;
let context ;
let boardWidth = 324 ;
let boardHeight = 576 ;

// bird
let bird ;
let birdImg ;
let birdX = boardWidth/8 ;
let birdY = boardHeight/2 ;
let birdWidth = 35 ;
let birdHeight = 25 ;

bird = {
    x : birdX ,
    y : birdY , 
    width : birdWidth ,
    height : birdHeight
}

//movements 
let velocityX = -2 ;
let velocityY = 0 ;
let gravity = 0.18 ;


//pipe
let pipesArray = [];
let pipeWidth = 57 ;
let pipeHeight = 463 ;
let pipex = boardWidth ;
let pipey = 0 ;
let topPipeImg ;
let bottomPipeImg ;

let gameOver = false ;
let score = 0 ;



window.onload = function(){
    gameBoard = document.getElementById("game-box") ;
    gameBoard.width = boardWidth ;
    gameBoard.height = boardHeight ;
    

    context = gameBoard.getContext("2d") ;

    const startbtn = document.createElement('button') ;
    startbtn.setAttribute('class' , 'start-btn') ;
    startbtn.innerHTML = "Start" ;
    const instructions = document.createElement('div') ; 
    instructions.setAttribute('class' , 'instructions') ;
    instructions.innerHTML = " press space-bar or upper key &#8593 to jump" ; 
    container.appendChild(startbtn) ;
    container.appendChild(instructions) ;
    startbtn.addEventListener('click' , ()=>{
        gameStarted() ;                      
    }) ;
    

    function gameStarted(){
        container.removeChild(startbtn) ;
        container.removeChild(instructions) ;
        birdImg = new Image() ;
            birdImg.src = "images/flappybird.png" ;
            birdImg.onload = function(){
            birdImg.width = bird.width ;
            birdImg.height = bird.height ;
            startSound.play() ;
            context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height) ;
            }
        // user will press key start moving bird at start of game
        document.onkeydown = function(){
      
        topPipeImg = new Image() ;
        topPipeImg.src = "images/toppipe.png" ;
        bottomPipeImg = new Image() ;
        bottomPipeImg.src = "images/bottompipe.png" ;
     
        
        requestAnimationFrame(update) ;
        setInterval(placePipes , 1500) ;
        document.addEventListener("keydown" , moveBird) ;
        document.addEventListener("click" , moveBird) ;
        document.addEventListener("touchstart" , moveBird) ;
        document.onkeydown = moveBird;
        
        }
        
        

    }

    
}

function Retry(){
    const divEl = document.createElement('div') ;
    divEl.setAttribute('class' , 'div-created') ;
    divEl.innerHTML = "Game Over" ;
    const btn = document.createElement('button') ;
    btn.setAttribute('class' , 'btn-created') ;
    btn.innerHTML = "Retry" ;
    setTimeout(()=>{
        overSound.play() ;
        container.appendChild(divEl) ;
    } , 1000) ;
    setTimeout(()=>{
        container.removeChild(divEl) ;
        container.appendChild(btn) ;
        btn.addEventListener('click'  , ()=>{
            location.reload(); 
        })
    } , 1600) ;

}

function update(){
    if(gameOver){
        Retry() ;
        return ;
    }
    requestAnimationFrame(update) ;
    context.clearRect(0 , 0 , boardWidth , boardHeight) ;
    velocityY += gravity ;
    bird.y += velocityY ;
    bird.y = Math.max(bird.y+velocityY , 0) ;
    context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height) ;
   
    for(let i = 0 ; i < pipesArray.length ; i++){
        
        let myPipe = pipesArray[i] ;
        console.log(myPipe.x , "pehle") ;
        myPipe.x += velocityX ;
        console.log(myPipe.x) ;
        context.drawImage(myPipe.img , myPipe.x , myPipe.y , myPipe.width , myPipe.height ) ;
        
        if(collision(bird , myPipe)){
            gameOver = true ;
        }

        if(bird.y > gameBoard.height){
            gameOver = true ;
            overSound.play() ;
        }

        if(!myPipe.passed && bird.x > myPipe.x+myPipe.width){
            myPipe.passed  = true ;
            score += 0.5 ;
        }
    }
    pipesArray = pipesArray.filter(pipe => pipe.x + pipe.width > 0);
    

    context.font = "25px Arial" ; 
    context.fillStyle = "White" ;
    context.fillText(score , 6 , 22 ) ;



}

function placePipes(){
    if(gameOver){
        return ;
    }
    let randomPipeY =  pipey - pipeHeight/4 - Math.random()*(pipeHeight/2)+10 ;
    let opening =(pipeHeight/4)+15;
    let topPipes ={
        img : topPipeImg  , 
        width : pipeWidth ,
        height : pipeHeight , 
        x : pipex , 
        y : randomPipeY , 
        passed : false 
    }
    pipesArray.push(topPipes) ;

    let bottomPipes = {
        img : bottomPipeImg , 
        width : pipeWidth , 
        height : pipeHeight, 
        x : pipex , 
        y :  randomPipeY + pipeHeight + opening , 
        passed: false 
    }

   
    pipesArray.push(bottomPipes) ;
}

function moveBird(e){
    if(e.type === "keydown"){
        if(e.code === "Space" || e.code === "ArrowUp" || e.code === "keyX"){
            velocityY = -2.8 ; 
         }
    }
    else if(e.code === "click" || e.start === "touchstart"){
            velocityY = -2.8 ; 
    }
     
      
}

function collision(bird , pipe){
    return ( bird.x < pipe.x+pipe.width && 
           bird.x+ birdWidth > pipe.x  &&
           bird.y < pipe.y+pipeHeight  &&
           bird.y + birdHeight > pipe.y )
}