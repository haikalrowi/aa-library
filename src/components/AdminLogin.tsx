"use client";

import { useFormStatus } from "react-dom";

import { adminLogin } from "@/lib/action";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      Login
    </Button>
  );
}

export default function AdminLogin() {
  return (
    <Card>
      <CardBody>
        <form action={adminLogin}>
          <Stack>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input name="username" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
            <Submit />
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
}
