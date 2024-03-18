import Link from "next/link";

import { Stack } from "@chakra-ui/react";

export default function App() {
  return (
    <Stack>
      <Link href="/admin">Admin</Link>
      <Link href="/user">Student</Link>
    </Stack>
  );
}
