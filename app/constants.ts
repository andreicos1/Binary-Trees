import { ToastPositionWithLogical } from "@chakra-ui/react";

export const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
export const highlightParentColor = "burlywood";
export const highlightChildren = "#99C2C2";

export const TOAST_ERROR = {
  position: "top" as ToastPositionWithLogical | undefined,
  isClosable: true,
  status: "error" as "error" | "info" | "warning" | "success" | undefined,
  duration: 4000,
  containerStyle: {
    fontSize: 16,
  },
};
