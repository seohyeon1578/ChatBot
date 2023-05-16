import 'regenerator-runtime/runtime';
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from "recoil";
import React from "react";

export default function App({ Component, pageProps } : AppProps ) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <RecoilRoot>  
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps}></Component>
      </QueryClientProvider>
    </RecoilRoot>
  )
}