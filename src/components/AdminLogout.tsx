import { useFormStatus } from "react-dom";

import { adminLogout } from "@/lib/action";
import { Button, Card, CardBody, TabPanel } from "@chakra-ui/react";

function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      Logout
    </Button>
  );
}

export function AdminLogout() {
  return (
    <TabPanel>
      <Card>
        <CardBody>
          <form action={adminLogout}>
            <Submit />
          </form>
        </CardBody>
      </Card>
    </TabPanel>
  );
}
