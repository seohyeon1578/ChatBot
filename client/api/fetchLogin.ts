import { LoginData } from "@/types/ILoginData";
import appServerAxios from "./appServerAxios";

export const fetchLogin = async({ email, password} : LoginData) => {
  try {
    const body = {
      email,
      password
    }
    const { data } = await appServerAxios.post("/auth/login", body);
    
    return {
      access_token: data['access_token'],
      refresh_token: data['refresh_token'],
    }
  } catch (error: unknown) {
    if(error instanceof Error){
      throw new Error(`Error: ${error.message}`)
    } else {
      throw new Error('Error: Unknown error')
    }
  }
}