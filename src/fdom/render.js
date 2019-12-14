export default function render(vdom) {
  const { nodeName, attributes = {}, children = [] } = vdom
  let node
  if (typeof vdom === 'string') {
    node = document.createTextNode(vdom)
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

  return node
}
