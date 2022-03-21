import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { createContext, MutableRefObject, useRef } from "react";

// TODO
// 1. Fix Invert Tree wrong inversion
// 2. Fix invert tree break on max speed
export const BoxesRefContext = createContext([] as unknown as MutableRefObject<HTMLDivElement[]>);
function MyApp({ Component, pageProps }: AppProps) {
  const nodeBoxesRef = useRef(new Array<HTMLDivElement>());
  return (
    <ChakraProvider>
      <Provider store={store}>
        <BoxesRefContext.Provider value={nodeBoxesRef}>
          <Component {...pageProps} />
        </BoxesRefContext.Provider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
