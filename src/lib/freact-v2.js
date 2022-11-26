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

function createDom(fiber) {
    // 创建元素或文本节点
    const dom = fiber.type === 'TEXT_ELEMENT' ?
        document.createTextNode(fiber.props.nodeValue)
        : document.createElement(fiber.type)

    // 添加属性
    for (const propKey in fiber.props) {
        if (propKey === 'children') break // children不添加到属性上
        dom[propKey] = fiber.props[propKey]
    }

    return dom
}

function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
    }
    nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null // fiber树根节点

function workLoop(deadline) {
    let shouldYield = false // 是否让步
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1 // timeRemaining()返回一个浮点数，表示当前闲置周期的预估剩余毫秒数，重复的访问这个属性用来判断当前线程的闲置时间是否可以在结束前执行更多的任务。
    }
    if (!nextUnitOfWork && wipRoot) { // 创建完了dom节点一次性递归添加到父节点
        commitRoot()
    }
    requestIdleCallback(workLoop)
}


requestIdleCallback(workLoop)

// fiber结构
// const fiber = {
//     type,dom类型（div、文本等）
//     props,
//     parent,
//     sibling,
//     child,第一个子节点
//     dom: null,dom元素
// }
// fiber和work一一对应
function performUnitOfWork(fiber) {
    // debugger
    if (!fiber.dom) {
        // debugger
        fiber.dom = createDom(fiber)
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[index]

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }

    // return next unit of work
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        // debugger
        nextFiber = nextFiber.parent
    }
}

const FReact = {
    createElement,
    render,
}
export default FReact