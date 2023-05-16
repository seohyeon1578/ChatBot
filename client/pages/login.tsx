import { useEffect, useState } from "react"
import { useUserLogin } from "@/hooks/useUserLogin";
import { setCookie } from "cookies-next";

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  
  const { data, isLoading, mutate: login, isSuccess, isError } = useUserLogin();

  useEffect(() => {
    if(isSuccess) {
      localStorage.setItem('access-token', data.access_token);
      const currentDate = new Date()
      const date = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      setCookie('refresh-token', 
        data.refresh_token, 
        { 
          httpOnly: true, 
          expires: date
        });
    }
  }, [isSuccess])

  const onSubmitHandle = async(e:any) => {
    e.preventDefault()
    login({ email, password:pass })
  }
  return (
    <form onSubmit={onSubmitHandle}>
      <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input name="password" value={pass} onChange={(e) => setPass(e.target.value)}/>
      <button type="submit">로그인</button>
    </form>
  )
}