const keys = {
  left: 'ArrowLeft',
  up: 'ArrowUp',
  right: 'ArrowRight',
  down: 'ArrowDown',
}

function translate(x, y) {
  return `translate(${x}px,${y}px)`
}

const onKeydown = e => {
  const mySquare = document.getElementById('my-square')
  const otherSquare = document.getElementById('other-square')

  const { translateX, translateY } = mySquare
  let newTranslateX
  let newTranslateY
  switch (e.key) {
    case keys.left:
      newTranslateX = translateX - 10
      mySquare.translateX = newTranslateX
      mySquare.style.transform = translate(newTranslateX, translateY)
      break

    case keys.right:
      newTranslateX = translateX + 10
      mySquare.translateX = newTranslateX
      mySquare.style.transform = translate(newTranslateX, translateY)
      break

    case keys.up:
      newTranslateY = translateY - 10
      mySquare.translateY = newTranslateY
      mySquare.style.transform = translate(translateX, newTranslateY)
      break

    case keys.down:
      newTranslateY = translateY + 10
      mySquare.translateY = newTranslateY
      mySquare.style.transform = translate(translateX, newTranslateY)
      break

    default:
      break
  }

  detectCollision(mySquare, otherSquare)
}

const throttle = (func, limit) => {
  let inThrottle
  // eslint-disable-next-line func-names
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

const throttledMouseMove = throttle(e => onMousemove(e), 100)

// eslint-disable-next-line no-unused-vars
const onMousedown = e => {
  document.addEventListener('mousemove', throttledMouseMove)
}

function detectCollision(collider, victim) {
  const colliderRect = collider.getBoundingClientRect()
  const victimRect = victim.getBoundingClientRect()
  const {
    width: colliderRectWidth,
    height: colliderRectHeight,
    left: colliderRectLeft,
    right: colliderRectRight,
    top: colliderRectTop,
    bottom: colliderRectBottom,
  } = colliderRect

  const {
    left: victimRectLeft,
    right: victimRectRight,
    top: victimRectTop,
    bottom: victimRectBottom,
  } = victimRect

  const collisionLeft = colliderRectLeft + colliderRectWidth > victimRectLeft
  const collisionRight = colliderRectRight - colliderRectWidth < victimRectRight
  const collisionTop = colliderRectTop + colliderRectHeight > victimRectTop
  const collisionBottom =
    colliderRectBottom - colliderRectHeight < victimRectBottom

  if (collisionLeft && collisionRight && collisionTop && collisionBottom) {
    // eslint-disable-next-line no-param-reassign
    victim.style.opacity = 0
  }
}

const onMousemove = e => {
  const mySquare = document.getElementById('my-square')
  const otherSquare = document.getElementById('other-square')

  mySquare.removeEventListener('mousedown', onMousedown)

  const { x, y } = e

  // TODO: find out how to get these constants in a better way
  const deltaX = x - 517
  const deltaY = y - 391

  mySquare.translateX = deltaX
  mySquare.translateY = deltaY
  mySquare.style.transform = translate(mySquare.translateX, mySquare.translateY)

  detectCollision(mySquare, otherSquare)
}

// eslint-disable-next-line no-unused-vars
const onMouseup = e => {
  const mySquare = document.getElementById('my-square')

  document.removeEventListener('mousemove', throttledMouseMove)
  mySquare.addEventListener('mousedown', onMousedown)
}

const app = document.getElementById('app')
const mySquare = document.createElement('div')
const otherSquare = document.createElement('div')

mySquare.translateX = 0
mySquare.translateY = 0
mySquare.moving = false
mySquare.setAttribute('id', 'my-square')
mySquare.setAttribute(
  'style',
  `width: 20px; height: 20px; background-color: red; position: absolute; left: 50%; top:50%; transition: transform 0.095s ease-in-out; transform: ${translate(
    mySquare.translateX,
    mySquare.translateY,
  )};`,
)

otherSquare.setAttribute('id', 'other-square')
otherSquare.setAttribute(
  'style',
  'width: 50px; height: 50px; background-color: blue; position: absolute; left: 25%; top: 25%; transition: opacity 1s ease-in-out;',
)

document.addEventListener('keydown', onKeydown)
mySquare.addEventListener('mousedown', onMousedown)
document.addEventListener('mouseup', onMouseup)

app.appendChild(otherSquare)
app.appendChild(mySquare)
