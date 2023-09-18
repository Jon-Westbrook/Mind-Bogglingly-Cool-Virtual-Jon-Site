import { useState } from 'react'
import './styles/App.scss';

function App() {
  const [count, setCount] = useState(0)
  console.log("I rendered")

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>       
    </>
  )
}

export default App
