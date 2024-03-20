import Link from "next/link";

import { Card, CardBody, Heading, Stack } from "@chakra-ui/react";

export default function App() {
  return (
    <Stack direction={"row"} className="h-screen items-center justify-center">
      <Card className="relative">
        <CardBody>
          <Heading>Admin</Heading>
          <Link href="/admin" className="absolute inset-0" />
        </CardBody>
      </Card>
      <Card className="relative">
        <CardBody>
          <Heading>Student</Heading>
          <Link href="/admin" className="absolute inset-0" />
        </CardBody>
      </Card>
    </Stack>
  );
}
