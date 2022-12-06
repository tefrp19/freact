import FReact from "../lib/freact";
import ListItem from "./ListItem.jsx"

export default function List() {
    const [data, setData] = FReact.useState([])

    return <div>
        <button onClick={() => {
            setData(data => {
                console.log('执行hook')
                // debugger
                const item = {
                    id: Date.now(),
                    num: Math.floor(Math.random() * 10),
                }
                data.push(item)
                return [...data]
            })
        }}>
            添加一条随机数据
        </button>
        {
            data.map(item => <ListItem item={item} setData={setData}/>)
        }
    </div>
}