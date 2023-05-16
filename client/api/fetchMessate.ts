import chatbotAxios from "./chatbotAxios";

export const fetchMessage = async(transcript: string) => {
  if (transcript === "") return;
  try {
    const { data } = await chatbotAxios.post("/webhooks/myio/webhook", {
      message: transcript
    });
    return data;
  } catch (error: unknown) {
    if(error instanceof Error){
      throw new Error(`Error: ${error.message}`)
    } else {
      throw new Error('Error: Unknown error')
    }
  }
}