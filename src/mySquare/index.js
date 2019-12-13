const app = document.getElementById('app');
const mySquare = document.createElement('div');

const keys = {
  left: 'ArrowLeft',
  up: 'ArrowUp',
  right: 'ArrowRight',
  down: 'ArrowDown'
};

function translate(x, y) {
  return `translate(${x}px,${y}px)`;
}

const onKeydown = e => {
  const mySquare = document.getElementById('my-square');
  const { translateX, translateY } = mySquare;
  let newTranslateX, newTranslateY;
  switch (e.key) {
    case keys.left:
      newTranslateX = translateX - 10;
      mySquare.translateX = newTranslateX;
      mySquare.style.transform = translate(newTranslateX, translateY);
      break;

    case keys.right:
      newTranslateX = translateX + 10;
      mySquare.translateX = newTranslateX;
      mySquare.style.transform = translate(newTranslateX, translateY);
      break;

    case keys.up:
      newTranslateY = translateY - 10;
      mySquare.translateY = newTranslateY;
      mySquare.style.transform = translate(translateX, newTranslateY);
      break;

    case keys.down:
      newTranslateY = translateY + 10;
      mySquare.translateY = newTranslateY;
      mySquare.style.transform = translate(translateX, newTranslateY);
      break;

    default:
      break;
  }
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const throttledMouseMove = throttle(e => onMousemove(e), 100);

const onMousedown = e => {
  const mySquare = document.getElementById('my-square');
  console.log('onMousedown', mySquare.translateX, mySquare.translateY);
  mySquare.x = e.clientX - 1;
  mySquare.y = e.clientY - 1;

  document.addEventListener('mousemove', throttledMouseMove);
};

const onMousemove = e => {
  const mySquare = document.getElementById('my-square');

  mySquare.removeEventListener('mousedown', onMousedown);

  const { x, y } = e;

  const deltaX = x - 517;
  const deltaY = y - 391;

  mySquare.translateX = deltaX;
  mySquare.translateY = deltaY;
  mySquare.style.transform = translate(
    mySquare.translateX,
    mySquare.translateY
  );
};

const onMouseup = e => {
  const mySquare = document.getElementById('my-square');

  document.removeEventListener('mousemove', throttledMouseMove);
  mySquare.addEventListener('mousedown', onMousedown);
};

mySquare.translateX = 0;
mySquare.translateY = 0;
mySquare.moving = false;
mySquare.setAttribute('id', 'my-square');
mySquare.setAttribute(
  'style',
  `width: 20px; height: 20px; background-color: red; position: absolute; left: 50%; top:50%; transition: transform 0.095s ease-in-out; transform: ${translate(
    mySquare.translateX,
    mySquare.translateY
  )};`
);

document.addEventListener('keydown', onKeydown);
mySquare.addEventListener('mousedown', onMousedown);
document.addEventListener('mouseup', onMouseup);

app.appendChild(mySquare);
