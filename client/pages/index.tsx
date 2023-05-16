import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchMessage } from "@/api/fetchMessate";

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
    <>
      <button onClick={listening ? stopListening : startListening}>클릭</button>
      {transcript}
      <div>
        chatbot: {data && data[0]?.text}
      </div>
    </>
  );
}