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
let gravity = 0.2 ;


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
    

    // context.fillStyle = "green" ;
    // context.fillRect(bird.x , bird.y , bird.width , bird.height) ;

    birdImg = new Image() ;
    birdImg.src = "images/flappybird.png" ;
    birdImg.onload = function(){
        birdImg.width = bird.width ;
        birdImg.height = bird.height ;
        startSound.play() ;
        context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height) ;
    }

    topPipeImg = new Image() ;
    topPipeImg.src = "images/toppipe.png" ;
    bottomPipeImg = new Image() ;
    bottomPipeImg.src = "images/bottompipe.png" ;
 
    
    requestAnimationFrame(update) ;
    setInterval(placePipes , 1500) ;
    document.addEventListener("keydown" , moveBird) ;
    
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
    } , 3500) ;

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
        }

        if(!myPipe.passed && bird.x > myPipe.x+myPipe.width){
            myPipe.passed  = true ;
            score += 0.5 ;
        }
    }
    // if(pipesArray.length > 2){
    //     pipesArray.pop ;
    // }
    

    context.font = "25px Arial" ; 
    context.fillStyle = "White" ;
    context.fillText(score , 6 , 22 ) ;



}

function placePipes(){
    if(gameOver){
        return ;
    }
    let randomPipeY =  pipey - pipeHeight/4 - Math.random()*(pipeHeight/2) ;
    let opening = pipeHeight/4 ;
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
     if(e.code == "Space" || e.code == "ArrowUp"){
        velocityY = -3 ; 
     }
      
}

function collision(bird , pipe){
    return ( bird.x < pipe.x+pipe.width && 
           bird.x+ birdWidth > pipe.x  &&
           bird.y < pipe.y+pipeHeight  &&
           bird.y + birdHeight > pipe.y )
}