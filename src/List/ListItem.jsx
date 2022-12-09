import FReact from 'freactjs';

export default function ListItem({item, setData}) {
    const {id, num} = item
    return <div>
        num:{num}
        <button onClick={() => {
            setData(data => {
                const index = data.findIndex(item => item.id === id)
                data.splice(index, 1)
                return [...data]
            })
        }}>删除
        </button>
    </div>
}
