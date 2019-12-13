import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;

let document;

describe.only('mysquare should move with the keyboard arrows', () => {
  it('should be rendered in the dom correctly', () => {
    const options = {
      resources: 'usable',
      runScripts: 'dangerously'
    };
    return JSDOM.fromFile('src/mySquare/index.html', options)
      .then(dom => {
        document = dom.window.document;
      })
      .then(() => {
        const square = document.getElementById('my-square');
        console.log('asdfasdfadfasdf', square);
      });
  });
});
