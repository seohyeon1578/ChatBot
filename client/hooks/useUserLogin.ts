import { fetchLogin } from "@/api/fetchLogin";
import { LoginData } from "@/types/ILoginData";
import { useMutation } from "react-query";

export const useUserLogin = () => {
  return useMutation((data: LoginData) => fetchLogin(data), {})
}