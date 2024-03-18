import { Stack } from "@chakra-ui/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Stack className="h-screen justify-center">{children}</Stack>;
}
