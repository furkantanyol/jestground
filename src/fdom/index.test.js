import f from './f'
import render from './render'
import mount from './mount'
import diff from './diff'

describe('f (create element) function tests', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })
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
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })
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

describe('mount', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })
  it('should mount', () => {
    const app = document.createElement('div')
    app.setAttribute('id', 'app')
    document.body.appendChild(app)

    const vNode = {
      nodeName: 'ul',
      attributes: { id: 'list' },
      children: [
        { nodeName: 'li', attributes: null, children: ['item 1'] },
        { nodeName: 'li', attributes: null, children: ['item 2'] },
      ],
    }

    const renderedNode = render(vNode)

    mount(renderedNode, app)

    expect(document.getElementById('app')).toBe(null)
    expect(document.getElementById('list')).toBeDefined()
    expect(!!document.getElementById('list')).toBe(true)
  })
})

describe('diff', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })
  it('old node doesnt exist', () => {
    const app = document.createElement('div')
    app.setAttribute('id', 'app')
    document.body.appendChild(app)

    const newTree = f('div', null, 'hello')
    expect(document.getElementById('app').childNodes.length).toBe(0)

    diff(null, newTree, app)
    expect(document.getElementById('app').childNodes[0]).toBeDefined()
    expect(document.getElementById('app').childNodes.length).toBe(1)
    expect(document.getElementById('app').childNodes[0].textContent).toBe(
      'hello',
    )
  })

  it('new node doesnt exist', () => {
    const app = document.createElement('div')
    app.setAttribute('id', 'app')
    document.body.appendChild(app)

    const divContent = document.createElement('div')
    const textNode = document.createTextNode('hello')

    divContent.appendChild(textNode)
    app.appendChild(divContent)

    expect(document.getElementById('app').childNodes.length).toBe(1)
    diff(divContent, null, app)
    expect(document.getElementById('app').childNodes.length).toBe(0)
  })

  it('ultimate diffs', () => {
    const app = document.createElement('div')
    app.setAttribute('id', 'app')
    document.body.appendChild(app)

    const a = (
      <ul>
        <li>item 1</li>
        <li>item 2</li>
      </ul>
    )

    const b = (
      <ul>
        <li>item 1</li>
        <li>hello!</li>
      </ul>
    )

    expect(document.getElementById('app').childNodes.length).toBe(0)
    diff(null, a, app)
    expect(document.getElementById('app').childNodes[0]).toBeDefined()
    expect(document.getElementById('app').childNodes.length).toBe(1)
    expect(
      document.getElementById('app').childNodes[0].childNodes[1].textContent,
    ).toBe('item 2')

    diff(a, b, app)

    expect(
      document.getElementById('app').childNodes[0].childNodes[1].textContent,
    ).toBe('hello!')
  })
})
