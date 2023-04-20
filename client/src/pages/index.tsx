import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React, { useEffect } from "react";

export default function Home() {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => SpeechRecognition.startListening({ language: 'ko-KR' })
  const stopListening = () => SpeechRecognition.stopListening();

  useEffect(() => {
    if(!browserSupportsSpeechRecognition) {
      console.log("This Browser doesn't support speech recognition.");
      return;
    }
  }, [browserSupportsSpeechRecognition])

  return (
    <>
      <button onClick={listening ? stopListening : startListening}>클릭</button>
      {transcript}
    </>
  );
}