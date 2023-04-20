import 'regenerator-runtime/runtime';
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps } : AppProps ) {
  return (
    <RecoilRoot>
      <Component {...pageProps}></Component>
    </RecoilRoot>
  )
}