import { Card, CardBody, Code, Heading, Text } from "@chakra-ui/react";

export function DemoBanner() {
  return (
    <Card size={"sm"} className="!fixed -top-2 right-4">
      <CardBody>
        <Heading size="sm">Demo</Heading>
      </CardBody>
    </Card>
  );
}

export function DemoAdminLogin() {
  return (
    <Card>
      <CardBody>
        <Heading size="md">Demo</Heading>
        <Text>
          This is a demo of the admin dashboard. You can log in as an admin to
          see the dashboard.
        </Text>
        <Text>
          Username: <Code>admin</Code>
        </Text>
        <Text>
          Password: <Code>admin</Code>
        </Text>
      </CardBody>
    </Card>
  );
}

export function DemoStudentLogin() {
  return (
    <Card>
      <CardBody>
        <Heading size="md">Demo</Heading>
        <Text>
          This is a demo of the student dashboard. You can log in as a student
          to see the dashboard.
        </Text>
        <Text>
          Username: <Code>student</Code>
        </Text>
        <Text>
          Password: <Code>student</Code>
        </Text>
      </CardBody>
    </Card>
  );
}
