// #################### SETUP SECTION #################################################
// Tam del canvas
let size = [0, 0]
// Setup inicial

let timer = ''
let speed = 500
let x = 0
let y = 0
const blockSize = 40
document.getElementsByTagName('body')[0].style.fontSize = blockSize / 2 + 'px'

let move = {
  direction: 'left',
  lock: false
}

let pause = true
let started = false
let snakeArray = [[x, y, move.direction]]
let snakeSize = 2
let puntos = 0
let ended = false

// Posicion de la comida x, y y estado comido o no
let foodPos = [[0, 0, true], [0, 0, true]]

// Sonidos
const audioEat = new Audio('sounds/eat.wav')
const audioEnd = new Audio('sounds/end.ogg')

const canvas = document.getElementById('myCanvas')

// #################### DOM LOADED SECTION ################################################
document.addEventListener('DOMContentLoaded', function (event) {
  // Setup dimensions (calculo automatico de las dimensiones)
  size = getDimensions()
  setCenter()
  document.getElementsByClassName('canvas-container')[0].style.width = size[0] + 'px'
  document.getElementsByClassName('canvas-container')[0].style.height = size[1] + 'px'
  document.getElementsByClassName('canvas-container')[0].style.display = 'block'
  canvas.width = size[0]
  canvas.height = size[1]
})

// #################### FUNCTIONS SECTION #################################################

// Retorna las dimensiones del tablero en base al width del viewport
function getDimensions () {
  return [Math.floor((window.innerWidth / blockSize) - 1) * blockSize,
    Math.floor((window.innerHeight / blockSize) * 0.9 - 1) * blockSize]
}

// retorna el centro
function setCenter () {
  x = Math.floor((size[0] / blockSize) / 2) * blockSize
  y = Math.floor((size[1] / blockSize) / 2) * blockSize
  snakeArray = [[x, y, move.direction]]
}

function drawRotate (ctx, image, xpos, ypos, degrees) {
  ctx.save()
  ctx.translate(xpos + (blockSize / 2), ypos + (blockSize / 2))
  ctx.rotate(degrees * Math.PI / 180)
  ctx.drawImage(image, 0 - (blockSize / 2), 0 - (blockSize / 2), blockSize, blockSize)
  ctx.restore()
}

function getDegDirection (direction, type = 'head') {
  switch (direction) {
    case 'left':
      return (type === 'tail') ? 0 : 180
    case 'right':
      return (type === 'tail') ? 180 : 0
    case 'up':
      return (type === 'tail') ? 90 : 270
    case 'down':
      return (type === 'tail') ? 270 : 90
  }
}

function drawSnake (x, y) {
  const snake = canvas.getContext('2d')

  // Clear snake
  for (const block of snakeArray) {
    snake.clearRect(block[0], block[1], blockSize, blockSize)
  }

  snake.fillStyle = '#33cc33'

  // Nueva posicion a la pila
  snakeArray.unshift([x, y, move.direction])
  if (snakeArray.length > snakeSize) {
    snakeArray.pop()
  }

  for (let i = 0; i < snakeArray.length; i++) {
    // Cabeza
    if (i === 0) {
      const head = document.getElementById('snake-head')
      drawRotate(snake, head, snakeArray[i][0], snakeArray[i][1], getDegDirection(snakeArray[i][2]))
      // Cola
    } else if (i === snakeArray.length - 1) {
      const tail = document.getElementById('snake-tail')
      drawRotate(snake, tail, snakeArray[i][0], snakeArray[i][1], getDegDirection(snakeArray[i - 1][2], 'tail'))

      // Cuerpo
    } else {
      const turn = document.getElementById('snake-turn')

      if (snakeArray[i - 1][0] === snakeArray[i + 1][0] || snakeArray[i - 1][1] === snakeArray[i + 1][1]) {
        const body = document.getElementById('snake-body')
        snake.drawImage(body, snakeArray[i][0], snakeArray[i][1], blockSize, blockSize)

        // Bloque de giro de vertical a horizontal
      } else if (snakeArray[i - 1][0] !== snakeArray[i][0]) {
        if (snakeArray[i - 1][2] === 'left') {
          if (snakeArray[i][2] === 'up') {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 270)
          } else {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 0)
          }
        } else {
          if (snakeArray[i][2] === 'up') {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 180)
          } else {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 90)
          }
        }

        // Bloque de giro de horizontal a vertical
      } else if (snakeArray[i - 1][1] !== snakeArray[i][1]) {
        if (snakeArray[i - 1][2] === 'up') {
          if (snakeArray[i][2] === 'left') {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 90)
          } else {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 0)
          }
        } else {
          if (snakeArray[i][2] === 'right') {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 270)
          } else {
            drawRotate(snake, turn, snakeArray[i][0], snakeArray[i][1], 180)
          }
        }
      }
    }
  }
}

document.addEventListener('keydown', function (event) {
  // Bloqueo de movimiento hasta siguiente step
  if (!move.lock) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        if (move.direction !== 'down') { move.direction = 'up' }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (move.direction !== 'up') { move.direction = 'down' }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (move.direction !== 'right') { move.direction = 'left' }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (move.direction !== 'left') { move.direction = 'right' }
        break
    }
    move.lock = true
  }
})

function moveSnake () {
  switch (move.direction) {
    case 'left':
      x = x - blockSize
      break
    case 'right':
      x = x + blockSize
      break
    case 'up':
      y = y - blockSize
      break
    case 'down':
      y = y + blockSize
      break
  }
  move.lock = false
  drawSnake(x, y)
}

function stopGame () {
  if (pause) {
    document.getElementById('pause-btn').innerHTML = 'Pausa'
    pause = false
  } else {
    document.getElementById('pause-btn').innerHTML = 'Continuar'
    pause = true
  }
}

function foodGenerator () {
  for (let i = 0; i < foodPos.length; i++) {
    if (foodPos[i][2]) {
      const x = Math.floor(Math.random() * (size[0] / blockSize)) * blockSize
      const y = Math.floor(Math.random() * (size[1] / blockSize)) * blockSize

      const food = canvas.getContext('2d')
      const apple = document.getElementById('asset-apple')
      food.drawImage(apple, x, y, blockSize, blockSize)

      foodPos[i][0] = x
      foodPos[i][1] = y
      foodPos[i][2] = false

      // Filtro para evitar que la comida se posicione encima del snake
      for (const index of snakeArray) {
        if (index[0] === x && index[1] === y) {
          foodPos[i][2] = true
          foodGenerator()
        }
      }

      // Filtro para evitar que las comidas se sobrepongan a si mismas
      for (let fo = 0; fo < foodPos.length; fo++) {
        if (fo !== i && foodPos[fo][0] === foodPos[i][0] && foodPos[fo][1] === foodPos[i][1]) {
          foodPos[i][2] = true
          foodGenerator()
        }
      }
    }
  }
}

function addPuntos () {
  puntos += (1000 - speed) / 100
  document.getElementById('puntos').innerHTML = puntos
}

function eatFood () {
  // Si la cabeza se come la comida
  for (let i = 0; i < foodPos.length; i++) {
    if (foodPos[i][0] === snakeArray[0][0] && foodPos[i][1] === snakeArray[0][1]) {
      snakeSize++
      const promise = new Promise((resolve) => {
        addPuntos()
        resolve(foodPos[i][2] = true)
        audioEat.play()
      }).then(() => {
        foodGenerator()
      })
    }
  }
}

// Alerta de fin del juego
function endPopup () {
  audioEnd.play()
  document.getElementsByClassName('end-popup')[0].style.display = 'block'
  document.getElementById('final-points').innerHTML = puntos
}

// Detector de colisiones
function isCollision () {
  // Colision con los bordes
  if (x < 0 || y < 0 || x >= size[0] || y >= size[1]) {
    ended = true
    endPopup()
  } else {
    // Colision con sigo mismo
    for (let i = 2; i < snakeArray.length; i++) {
      if (snakeArray[i][0] === x && snakeArray[i][1] === y) {
        ended = true
        endPopup()
      }
    }
  }
}

// Resetar el juego
function resetGame () {
  setCenter()
  puntos = 0
  document.getElementById('start-btn').innerHTML = 'Jugar'
  started = false
  clearInterval(timer)
  foodPos = [[0, 0, true], [0, 0, true]]
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  document.getElementsByClassName('end-popup')[0].style.display = 'none'
  ended = false
  move = { direction: 'left', lock: false }
  snakeArray = [[x, y, move.direction]]
  snakeSize = 2
}

function startGame () {
  // Reset Game
  if (started) {
    resetGame()
    // Iniciar Juego
  } else {
    document.getElementById('start-btn').innerHTML = 'Reiniciar'
    foodGenerator()

    started = true
    pause = false

    // Movimiento
    timer = setInterval(function () {
      if (!pause && !ended) {
        const promise = new Promise(function (resolve) {
          resolve(eatFood())
        }).then(() => {
          moveSnake()
        }).then(() => {
          isCollision()
        })
      }

      // Fin del juego
      if (ended) {
        clearInterval(timer)
      }
    }, speed)
  }
}

// Funciones de input
function changeSpeed (vel) {
  // Reset speed
  if (parseInt(vel) < 1) {
    vel = 1
    document.getElementById('speed-input').value = vel
  } else if (parseInt(vel) > 9) {
    vel = 9
    document.getElementById('speed-input').value = vel
  }
  speed = (10 - parseInt(vel)) * 100
}

// ############  CONTROL TOUCH #################################################

document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)

let xDown = null
let yDown = null

function handleTouchStart (evt) {
  xDown = evt.touches[0].clientX
  yDown = evt.touches[0].clientY
}

function handleTouchMove (evt) {
  if (!xDown || !yDown) {
    return
  }
  // Lock de movimiento
  if (!move.lock) {
    const xUp = evt.touches[0].clientX
    const yUp = evt.touches[0].clientY

    const xDiff = xDown - xUp
    const yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
      if (xDiff > 0) {
        if (move.direction !== 'right') { move.direction = 'left' }
      } else {
        if (move.direction !== 'left') { move.direction = 'right' }
      }
    } else {
      if (yDiff > 0) {
        if (move.direction !== 'down') { move.direction = 'up' }
      } else {
        if (move.direction !== 'up') { move.direction = 'down' }
      }
    }
    /* reset values */
    xDown = null
    yDown = null
    move.lock = true
  }
}
