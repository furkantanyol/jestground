export default function isTextNode(node) {
  return (
    typeof node === 'string' ||
    typeof node === 'boolean' ||
    typeof node === 'number'
  )
}
