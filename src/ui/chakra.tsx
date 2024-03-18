"use client";

import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";

import { config } from "./chakra-config";

export function Provider({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({ config });

  return (
    <ChakraProvider theme={theme}>
      <Container>{children}</Container>
    </ChakraProvider>
  );
}

export { ColorModeScript } from "@chakra-ui/react";
