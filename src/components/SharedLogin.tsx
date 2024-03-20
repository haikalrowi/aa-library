"use client";

import React from "react";
import { useFormStatus } from "react-dom";

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

export default function SharedLogin({
  form,
}: {
  form: React.JSX.IntrinsicElements["form"];
}) {
  return (
    <Card>
      <CardBody>
        <form action={form.action}>
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
