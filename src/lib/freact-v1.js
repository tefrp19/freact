// 第1版递归创建dom元素，会导致渲染阻塞，所以引入concurrent mode和fiber
function createElement(type, props, ...children) {
    function createTextElement(text) {
        return {
            type: 'TEXT_ELEMENT',
            props: {
                nodeValue: text,
                children: [],
            },
        }
    }

    return {
        type,
        props: {
            ...props,
            // children解构为数组
            children: children.map(child =>
                typeof child === 'object' ? child
                    : createTextElement(child)
            )
        },
    }
}

function render(element, container) {
    // 创建元素或文本节点
    const dom = element.type === 'TEXT_ELEMENT' ?
        document.createTextNode(element.props.nodeValue)
        : document.createElement(element.type)

    // 添加属性
    for (const propKey in element.props) {
        if (propKey === 'children') break // children不添加到属性上
        dom[propKey] = element.props[propKey]
    }

    // dfs递归渲染element树
    element.props.children.forEach(child =>
        render(child, dom)
    )

    container.appendChild(dom)

}

const FReact = {
    createElement,
    render,
}
export default FReact