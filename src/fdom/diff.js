import render from './render'
import isTextNode from './isTextNode'

function changed(oldNode, newNode) {
  return (
    (isTextNode(oldNode) && oldNode !== newNode) ||
    oldNode.nodeName !== newNode.nodeName ||
    typeof oldNode !== typeof newNode
  )
}

export default function diff(oldNode, newNode, parent, index = 0) {
  if (!oldNode) {
    parent.appendChild(render(newNode))
  } else if (!newNode) {
    parent.removeChild(parent.childNodes[index])
  } else if (changed(oldNode, newNode)) {
    parent.replaceChild(render(newNode), parent.childNodes[index])
  } else if (newNode.nodeName) {
    const newLength = newNode.children.length
    const oldLength = oldNode.children.length

    for (let i = 0; i < newLength || i < oldLength; i++) {
      diff(
        oldNode.children[i],
        newNode.children[i],
        parent.childNodes[index],
        i,
      )
    }
  }
}
