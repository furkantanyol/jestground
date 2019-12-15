import isTextNode from './isTextNode'

export default function render(vnode) {
  const { nodeName, attributes = {}, children = [] } = vnode
  let node
  if (isTextNode(vnode)) {
    node = document.createTextNode(vnode)
  } else {
    node = document.createElement(nodeName)

    if (attributes) {
      Object.keys(attributes).forEach(key => {
        node.setAttributeNS(null, key, attributes[key])
      })
    }

    children.forEach(child => {
      node.appendChild(render(child))
    })
  }

  // container.appendChild(node)

  return node
}
