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
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
}
