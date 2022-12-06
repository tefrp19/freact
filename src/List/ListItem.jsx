import FReact from "../lib/freact";

export default function ListItem({item, setData}) {
    const {id, num} = item
    return <div>
        num:{num}
        <button onClick={() => {
            setData(data => {
                const index=data.findIndex(item => item.id === id)
                console.log(index)
                data.splice(index, 1)
                console.log(data);
                return [...data]
            })
        }}>删除
        </button>
    </div>
}
