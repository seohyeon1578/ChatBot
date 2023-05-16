import { fetchRegister } from "@/api/fetchRegister"
import { useState } from "react"

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

  const onSubmitHandle = async(e: any) => {
      e.preventDefault();
      const data = await fetchRegister(email, name, pass)
      console.log(data)
  }

  return (
    <form onSubmit={onSubmitHandle}>
      <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input name="username" value={name} onChange={(e) => setName(e.target.value)}/>
      <input name="password" value={pass} onChange={(e) => setPass(e.target.value)}/>
      <button type="submit">회원가입</button>
    </form>
  )
}