
// #################### SETUP SECTION #################################################
// Tam del canvas
var size = [0,0]
// Setup inicial


var speed = 500
var x = 300
var y = 250
var blockSize = 25


var move = {
   direction: 'left',
   lock: false
}

var pause = true
var started = false
var snakeArray = [[x,y,move.direction]]
var snakeSize = 2
var puntos = 0
var ended = false

// Posicion de la comida x, y y estado comido o no
var foodPos = [[0,0,true],[0,0,true]]




var canvas = document.getElementById('myCanvas')


// #################### DOM LOADED SECTION ################################################
document.addEventListener("DOMContentLoaded", function(event) {
   //Setup dimensions (calculo automatico de las dimensiones) 
   size = getDimensions()
   document.getElementsByClassName('canvas-container')[0].style.width = size[0]+'px'
   document.getElementsByClassName('canvas-container')[0].style.height = size[1]+'px'
   document.getElementsByClassName('canvas-container')[0].style.display = 'block'
   document.getElementById('myCanvas').width = size[0]
   document.getElementById('myCanvas').height = size[1] 
})

// #################### FUNCTIONS SECTION #################################################

// Retorna las dimensiones del tablero en base al width del viewport
function getDimensions(){
   return [Math.floor((window.innerWidth/blockSize)-1)*blockSize,
           Math.floor((window.innerHeight/blockSize)*0.9-1)*blockSize]
}

function drawRotate(ctx,image,xpos,ypos,degrees){
      ctx.save()
      ctx.translate(xpos+(blockSize/2),ypos+(blockSize/2))
      ctx.rotate(degrees * Math.PI / 180)
         ctx.drawImage(image,0-(blockSize/2), 0-(blockSize/2), blockSize, blockSize)
      ctx.restore()
}

function getDegDirection(direction,type = 'head'){
   switch (direction){
      case 'left':
         return (type == 'tail')? 0 : 180
      break;
      case 'right':
         return (type == 'tail')? 180 : 0
      break;
      case 'up':
         return (type == 'tail')? 90 : 270
      case 'down':
         return (type == 'tail')? 270 : 90
   }
}

function drawSnake(x,y){
   var snake = canvas.getContext('2d')
   
   // Clear snake
   for(block of snakeArray){
      snake.clearRect(block[0], block[1], blockSize, blockSize)
   }  

   snake.fillStyle = "#33cc33";
   
   //Nueva posicion a la pila
   snakeArray.unshift([x,y,move.direction])
   if(snakeArray.length > snakeSize){
      snakeArray.pop()
   }

   for(let i=0; i < snakeArray.length; i++){
      
      // Cabeza
      if(i == 0){
         let head = document.getElementById('snake-head')
         drawRotate(snake,head,snakeArray[i][0],snakeArray[i][1],getDegDirection(snakeArray[i][2]))
      //Cola
      }else if(i == snakeArray.length-1){
         let tail = document.getElementById('snake-tail')
       
         drawRotate(snake,tail,snakeArray[i][0],snakeArray[i][1],getDegDirection(snakeArray[i-1][2],'tail'))
      
      // Cuerpo   
      }else{
         let turn = document.getElementById('snake-turn')
        
         if(snakeArray[i-1][0] == snakeArray[i+1][0] || snakeArray[i-1][1] == snakeArray[i+1][1]){
            let body = document.getElementById('snake-body')
            snake.drawImage(body,snakeArray[i][0], snakeArray[i][1], blockSize, blockSize)   

         // Bloque de giro de vertical a horizontal
         }else if(snakeArray[i-1][0] != snakeArray[i][0]){
            if(snakeArray[i-1][2] == 'left'){
               if(snakeArray[i][2] == 'up'){ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],270) }
               else{ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],0) }
            }else{
               if(snakeArray[i][2] == 'up'){ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],180) } 
               else{ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],90) } 
            }
         
         // Bloque de giro de horizontal a vertical
         }else if(snakeArray[i-1][1] != snakeArray[i][1]){
            if(snakeArray[i-1][2] == 'up'){
               if(snakeArray[i][2] == 'left'){ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],90) }
               else{ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],0) }
            }else{
               if(snakeArray[i][2] == 'right'){ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],270) } 
               else{ drawRotate(snake,turn,snakeArray[i][0],snakeArray[i][1],180) } 
            }
         
         }
      }
   }
}


document.addEventListener('keydown', function (event) {
   
   //Bloqueo de movimiento hasta siguiente step
   if(!move.lock){
      switch(event.key){
         case 'ArrowUp':
            if(move.direction != 'down'){ move.direction = 'up' }
         break;
         case 'ArrowDown':
            if(move.direction != 'up'){ move.direction = 'down' }
         break;
         case 'ArrowLeft':
            if(move.direction != 'right'){ move.direction = 'left' }
         break;
         case 'ArrowRight':
            if(move.direction != 'left'){ move.direction = 'right' }
         break;
      }
      move.lock = true
   }
})


function moveSnake(){
   switch(move.direction){
      case 'left':
         x = x-blockSize
      break;
      case 'right':
         x = x+blockSize
      break;
      case 'up':
         y = y-blockSize
      break;
      case 'down':
         y = y+blockSize
      break;
   }
   move.lock = false
   drawSnake(x,y)
}

function stopGame(){
   if(pause){
      document.getElementById('pause-btn').innerHTML = 'Pause'
      pause = false
   }else{
      document.getElementById('pause-btn').innerHTML = 'Continue'
      pause = true
   }
}


function foodGenerator(){
   
   for(let i = 0; i < foodPos.length; i++){
      if(foodPos[i][2]){
         let x = Math.floor(Math.random() * (size[0] / blockSize)) * blockSize
         let y = Math.floor(Math.random() * (size[1] / blockSize)) * blockSize
         
         var food = canvas.getContext('2d')
         var apple = document.getElementById('asset-apple')
            food.drawImage(apple,x, y, blockSize, blockSize)
        
          
         foodPos[i][0] = x
         foodPos[i][1] = y
         foodPos[i][2] = false
         
         
         // Filtro para evitar que la comida se posicione encima del snake
         for(index of snakeArray){
            if(index[0] == x && index[1] == y){
               foodPos[i][2] = true
               foodGenerator()
            }
         }
         
         // Filtro para evitar que las comidas se sobrepongan a si mismas
         for(let fo = 0; fo < foodPos.length; fo++){
            if(fo != i && foodPos[fo][0] == foodPos[i][0] && foodPos[fo][1] == foodPos[i][1]){
               foodPos[i][2] = true
               foodGenerator() 
            }
         }        

      }
   }
}

function addPuntos(){
   puntos += (1000-speed)/100
   document.getElementById('puntos').innerHTML = puntos
}

function eatFood(){
   // Si la cabeza se come la comida   
   for(let i = 0; i < foodPos.length; i++){
      if(foodPos[i][0] == snakeArray[0][0] && foodPos[i][1] == snakeArray[0][1]){
         snakeSize++
         let promise = new Promise( (resolve) =>{
            addPuntos()
            resolve(foodPos[i][2] = true)
         }).then( () => {
            foodGenerator()
         })
      }
   }
}


// Detector de colisiones
function isCollision(){
   // Colision con los bordes
   if(x < 0 || y < 0 || x >= size[0] || y >= size[1]){
      ended = true
      alert('Fin de juego! '+puntos+' Puntos')
   
   }else{
      // Colision con sigo mismo
      for(let i = 2; i < snakeArray.length; i++){
         if(snakeArray[i][0] == x && snakeArray[i][1] == y){
            ended = true
            alert('Fin de juego! '+puntos+' Puntos')
         }
      }
   }
   
}

function startGame(){
   
   // Reset Game
   if(started){
      location.reload()
      
   // Iniciar Juego
   }else{
      document.getElementById('start-btn').innerHTML = 'Reset'
      foodGenerator()
         
      started = true
      pause = false  

      // Movimiento
      let timer = setInterval(function(){
            
         if(!pause && !ended){
            let promise = new Promise( function(resolve){
               resolve(eatFood())
            }).then(() => {
               moveSnake()
            }).then(() => {
               isCollision()
            })
         }
         
         // Fin del juego
         if(ended){
            clearInterval(timer);
         }
      
      }, speed);
   }

}


// Funciones de input
function changeSpeed(vel){
   
   // Reset speed
   if(parseInt(vel) < 1){
      vel = 1
      document.getElementById('speed-input').value = vel
   }else if(parseInt(vel) > 9){
      vel = 9
      document.getElementById('speed-input').value = vel
   }
   
   speed = (10-parseInt(vel))*100
   
}



// ############  CONTROL TOUCH #################################################

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if( xDiff > 0 ) {
      if(move.direction != 'right'){ move.direction = 'left' }
        }else{
      if(move.direction != 'left'){ move.direction = 'right' }
        }                   
    }else{
        if( yDiff > 0 ){
      if(move.direction != 'down'){ move.direction = 'up' }
        }else{
      if(move.direction != 'up'){ move.direction = 'down' }
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
}
