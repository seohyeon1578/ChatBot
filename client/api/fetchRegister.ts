import appServerAxios from "./appServerAxios";

export const fetchRegister = async(
  email: string,
  username: string, 
  password: string
  ) => {
  try {
    const body = {
      email,
      username,
      password
    }
    const { data } = await appServerAxios.post("/auth/register", body);
    return data;
  } catch (error: unknown) {
    if(error instanceof Error){
      throw new Error(`Error: ${error.message}`)
    } else {
      throw new Error('Error: Unknown error')
    }
  }
}