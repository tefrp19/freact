import FReact from "freactjs";
import List from "./List/List";
import './App.css'
// const App = <div id={'test'} className={'test'}>
//     <p id={'p1'}>2</p>
//     <p>2</p>
//     <p>3</p>
// </div>


function Counter() {
    const [state, setState] = FReact.useState(1);
    return (
        <h1 onClick={() => setState(c => c + 1)}>
            Count: {state}
        </h1>
    );
}

const App = <List/>


export default App
