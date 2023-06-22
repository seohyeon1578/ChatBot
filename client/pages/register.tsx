import { fetchRegister } from "@/api/fetchRegister"
import { useState } from "react"
import * as styles from "@/styles/app.css";
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

  const router = useRouter();

  const onSubmitHandle = async(e: any) => {
      e.preventDefault();
      await fetchRegister(email, name, pass)
        .then(() => {
          router.push('/login')
        })
        .catch((err) => {
          console.log('Register Error: ', err)
        })
  }

  return (
    <div className={styles.themeClass}>
      <div className={styles.root}>
        <form onSubmit={onSubmitHandle} className={styles.form}>
          <h2 className={styles.h2}>회원가입</h2>
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
            <label htmlFor="name" className={styles.label}>
              <Image
                src="/Vector.png"
                width={16}
                height={16}
                alt="이름"
              />
            </label>
            <input
              id="name" 
              name="name" 
              type="text" 
              placeholder="이름"
              value={name} 
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
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
          <button type="submit" className={styles.button}>회원가입</button>
        </form>
      </div>
    </div>
  )
}