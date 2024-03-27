"use client";

import {
  ChakraProvider,
  Container,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";

type ProviderProps = {
  children: React.ReactNode;
  config: ThemeConfig;
};

export function Provider({ children, config }: ProviderProps) {
  const theme = extendTheme({ config });

  return (
    <ChakraProvider theme={theme}>
      <Container>{children}</Container>
    </ChakraProvider>
  );
}
