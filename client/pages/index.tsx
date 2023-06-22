import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchMessage } from "@/api/fetchMessate";
import * as styles from "@/styles/app.css";
import Image from 'next/image';

export default function Home() {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const { data, status } = useQuery(["fetchMessage", !listening],
    () => fetchMessage(transcript), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => console.log(data)
  })

  const startListening = () => SpeechRecognition.startListening({ language: 'ko-KR' })
  const stopListening = () => SpeechRecognition.stopListening();

  useEffect(() => {
    if(!browserSupportsSpeechRecognition) {
      console.log("This Browser doesn't support speech recognition.");
      return;
    }
  }, [browserSupportsSpeechRecognition])

  return (
    <div className={styles.themeClass}>
      <div className={styles.root}>
          <div className={styles.robot}>
            <Image
              src="/robot.png" 
              width={486}
              height={514}
              alt="robot"
            />
            {data &&
              <div className={styles.answer}>
                <span className={styles.answerText}>{data[0]?.text}</span>
              </div>
            }
          </div>
          <div className={styles.footer}>
          {
            listening
            ?
            <div className={styles.responseContainer}>
              <span className={styles.text}>{transcript}</span>
              <div className={styles.circleContainer}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
              </div>
            </div>
            :
            <button
              className={styles.mickButton}
              onClick={startListening}
            >
              <Image
                src="/mike.png"
                width={36}
                height={48}
                alt="mick"
              />
            </button>
          } 
          </div>
      </div>
    </div>
  );
}