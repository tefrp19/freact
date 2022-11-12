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

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
    }
}

let nextUnitOfWork = null

function workLoop(deadline) {
    let shouldYield = false // 是否让步
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1 // timeRemaining()返回一个浮点数，表示当前闲置周期的预估剩余毫秒数，重复的访问这个属性用来判断当前线程的闲置时间是否可以在结束前执行更多的任务。
    }
    requestIdleCallback(workLoop)
}


requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
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
        nextFiber = nextFiber.parent
    }
}

const FReact = {
    createElement,
    render,
}
export default FReact