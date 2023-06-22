import { useEffect, useState } from "react"
import { useUserLogin } from "@/hooks/useUserLogin";
import { setCookie } from "cookies-next";
import * as styles from "@/styles/app.css";
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const router = useRouter()

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
      router.push('/')
    }
  }, [isSuccess])

  const onSubmitHandle = async(e:any) => {
    e.preventDefault()
    login({ email, password:pass })
  }
  
  return (
    <div className={styles.themeClass}>
      <div className={styles.root}>
        <form onSubmit={onSubmitHandle} className={styles.form}>
          <h2 className={styles.h2}>로그인</h2>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>
              <Image
                src="/Vector.png"
                width={16}
                height={16}
                alt="이메일"
              />
            </label>
            <input
              id="email" 
              name="email" 
              type="text" 
              placeholder="이메일"
              value={email}
              className={styles.input} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>
              <Image
                src="/Padlock Outline.png"
                width={16}
                height={16}
                alt="비밀번호"
              />
            </label>
            <input
              id="password" 
              name="password" 
              type="password" 
              placeholder="비밀번호"
              value={pass} 
              className={styles.input}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>로그인</button>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <Link className={styles.link} href="/">비밀번호 찾기</Link>
            </li>
            <li className={styles.li}>
              <Link className={styles.link} href="/">아이디 찾기</Link>
            </li>
            <li className={styles.li}>
              <Link className={styles.link} href="/register">회원가입</Link>
            </li>
          </ul>
        </form>
      </div>
    </div>
  )
}