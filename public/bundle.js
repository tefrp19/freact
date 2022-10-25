
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function createElement(type, props, ...children) {
  function createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
  return {
    type,
    props: {
      ...props,
      // children解构为数组
      children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
    }
  };
}
function render(element, container) {
  // 创建元素或文本节点
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode(element.props.nodeValue) : document.createElement(element.type);

  // 添加属性
  for (const propKey in element.props) {
    if (propKey === 'children') break; // children不添加到属性上
    dom[propKey] = element.props[propKey];
  }

  // dfs递归渲染element树
  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
}
const FReact = {
  createElement,
  render
};

const App = FReact.createElement("div", {
  id: 'test',
  className: 'test'
}, FReact.createElement("p", {
  id: 'p1'
}, "1"), FReact.createElement("p", null, "2"), FReact.createElement("p", null, "3"));

console.log(App);
const container = document.getElementById("root");
FReact.render(App, container);
