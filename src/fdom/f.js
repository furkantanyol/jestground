export default function f(nodeName, attributes, ...children) {
  return {
    nodeName,
    attributes,
    children,
  }
}
