import { adminLogout } from "@/lib/action";
import { Card, CardBody, TabPanel } from "@chakra-ui/react";

import { Submit } from "./AdminDashboard";

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
