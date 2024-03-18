import { adminLogout } from "@/lib/action";
import { Button, Card, CardBody } from "@chakra-ui/react";

export default function AdminDashboard() {
  return (
    <Card>
      <CardBody>
        <form action={adminLogout}>
          <Button type="submit">Logout</Button>
        </form>
      </CardBody>
    </Card>
  );
}
