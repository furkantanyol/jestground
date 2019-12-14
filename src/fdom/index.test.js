import f from './f'
import render from './render'

describe('f (create element) function tests', () => {
  it('should return a dom element object', () => {
    const element = f('div', {
      style: 'width: 20px; height: 20px; background-color: red;',
    })
    expect(element.nodeName).toBe('div')
    expect(element.attributes.style).toBe(
      'width: 20px; height: 20px; background-color: red;',
    )
    expect(element.children.length).toBe(0)
  })

  it('should return nested dom element object', () => {
    const spanEl = f('span', {
      style: 'width: 5px; height: 5px; background-color: blue;',
    })
    const container = f(
      'div',
      { style: 'width: 20px; height: 20px; background-color: red;' },
      spanEl,
    )

    expect(container.children.length).toBe(1)
    expect(container.children[0].nodeName).toBe('span')
  })

  it('convert jsx to vnode object with f function', () => {
    /** @jsx f */
    const node = (
      <ul className="list">
        <li>item 1</li>
        <li>item 2</li>
      </ul>
    )

    const vNode = {
      nodeName: 'ul',
      attributes: { className: 'list' },
      children: [
        { nodeName: 'li', attributes: null, children: ['item 1'] },
        { nodeName: 'li', attributes: null, children: ['item 2'] },
      ],
    }

    expect(node).toMatchObject(vNode)
  })
})

describe('render vdom to dom', () => {
  /** @jest-environment jsdom */
  it('should render the vdom element', () => {
    /** @jsx f */
    const nodeString = '<ul className="list"></ul>'

    const vNode = {
      nodeName: 'ul',
      attributes: { className: 'list' },
    }

    const renderedNode = render(vNode)
    expect(renderedNode.outerHTML).toBe(nodeString)
  })
  it('should render the vdom element with children', () => {
    /** @jsx f */
    const nodeString =
      '<ul className="list"><li className="list-element"></li></ul>'

    const vNode = {
      nodeName: 'ul',
      attributes: { className: 'list' },
      children: [{ nodeName: 'li', attributes: { className: 'list-element' } }],
    }

    const renderedNode = render(vNode)
    expect(renderedNode.outerHTML).toBe(nodeString)
  })
  it('should render the vdom element with text children', () => {
    /** @jsx f */
    const nodeString =
      '<ul className="list"><li>item 1</li><li>item 2</li></ul>'

    const vNode = {
      nodeName: 'ul',
      attributes: { className: 'list' },
      children: [
        { nodeName: 'li', attributes: null, children: ['item 1'] },
        { nodeName: 'li', attributes: null, children: ['item 2'] },
      ],
    }

    const renderedNode = render(vNode)
    expect(renderedNode.outerHTML).toBe(nodeString)
  })
})
