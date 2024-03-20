import React from "react";
import { useFormStatus } from "react-dom";

import { Button, Card, CardBody, TabPanel } from "@chakra-ui/react";

function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      Logout
    </Button>
  );
}

export default function SharedLogout({
  form,
}: {
  form: React.JSX.IntrinsicElements["form"];
}) {
  return (
    <TabPanel>
      <Card>
        <CardBody>
          <form action={form.action}>
            <Submit />
          </form>
        </CardBody>
      </Card>
    </TabPanel>
  );
}
