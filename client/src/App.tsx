import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")

  const submitCertificateReq = async () => {
    try {
      const res = await redisClient.set(`email:${email}`, "true")
      console.log(res)
    }
    catch(error){
      console.error(error)
    }
  }

  return (
    <div>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={submitCertificateReq}>Generate Certificate</button>
    </div>
  )
}

export default App
