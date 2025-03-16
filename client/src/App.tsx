import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")

  return (
    <div>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <button>Generate Certificate</button>
    </div>
  )
}

export default App
