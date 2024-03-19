import { useContext, useId } from "react";

import { AdminCheckouteStateContext, AdminDataContext } from "@/context/Admin";
import { useAdminCheckoutState } from "@/hooks/Admin";
import { adminCreateCheckout, adminReturnCheckout } from "@/lib/action";
import {
  Badge,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  TabPanel,
  Text,
} from "@chakra-ui/react";

function FormCreate() {
  const { students, copiesAvailable } = useContext(AdminDataContext);
  const { state, dispatch } = useContext(AdminCheckouteStateContext)!;

  const studentIdDatalist = useId();
  const copyIdDatalist = useId();

  return (
    <CardBody>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set", payload: { createFormLoading: true } });
          await adminCreateCheckout(new FormData(e.currentTarget));
          dispatch({ type: "reset", payload: {} });
        }}
      >
        <Stack>
          <FormControl isRequired>
            <FormLabel>Student ID</FormLabel>
            <Input list={studentIdDatalist} name="studentId" />
            <datalist id={studentIdDatalist}>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {[student.name, student.email].join("; ")}
                </option>
              ))}
            </datalist>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Copy ID</FormLabel>
            <Input list={copyIdDatalist} name="copyId" />
            <datalist id={copyIdDatalist}>
              {copiesAvailable?.map((copy) => (
                <option key={copy.id} value={copy.id}>
                  {[
                    copy.Book.title,
                    copy.Book.author,
                    copy.Book.isbn,
                    copy.serial,
                  ].join("; ")}
                </option>
              ))}
            </datalist>
          </FormControl>
          <Button type="submit" isLoading={state.createFormLoading}>
            Create
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              dispatch({ type: "set", payload: { creating: false } });
            }}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </CardBody>
  );
}

function Create() {
  const { state, dispatch } = useContext(AdminCheckouteStateContext)!;

  return (
    <Card>
      <CardBody>
        <Button
          onClick={() => {
            dispatch({ type: "set", payload: { creating: true } });
          }}
        >
          Create
        </Button>
      </CardBody>
      {state.creating && <FormCreate />}
    </Card>
  );
}

function Search() {
  const { dispatch } = useContext(AdminCheckouteStateContext)!;

  return (
    <Card>
      <CardBody>
        <Input
          placeholder="Search by student (email, name), book (title, author, isbn), copy (serial)"
          onInput={(e) => {
            const term = e.currentTarget.value;
            if (term) {
              dispatch({
                type: "set",
                payload: { searching: true, searchTerm: term },
              });
            } else {
              dispatch({ type: "set", payload: { searching: false } });
            }
          }}
        />
      </CardBody>
    </Card>
  );
}

function Checkout() {
  const { checkouts } = useContext(AdminDataContext);
  const { state, dispatch } = useContext(AdminCheckouteStateContext)!;

  return (state.searching ? state.searchResult : checkouts)?.map((checkout) => (
    <Card key={checkout.id}>
      <CardBody>
        <Heading size={"md"}>{checkout.Student.name}</Heading>
        <Text>{checkout.Student.email}</Text>
      </CardBody>
      <CardBody>
        <Heading size={"md"}>{checkout.Copy.Book.title}</Heading>
        <Badge>{checkout.Copy.Book.isbn.toString()}</Badge>
        <Text>{checkout.Copy.Book.author}</Text>
      </CardBody>
      <CardBody>
        <Badge>{checkout.Copy.serial}</Badge>
      </CardBody>
      <CardBody>
        <Button
          onClick={async (e) => {
            const formData = new FormData();
            formData.append("id", checkout.id);
            e.currentTarget.disabled = true;
            await adminReturnCheckout(formData);
            dispatch({ type: "reset", payload: {} });
          }}
        >
          Mark as returned
        </Button>
      </CardBody>
    </Card>
  ));
}

export function AdminCheckout() {
  const state = useAdminCheckoutState();

  return (
    <AdminCheckouteStateContext.Provider value={state}>
      <TabPanel>
        <Stack>
          <Create />
          <Search />
          <Checkout />
        </Stack>
      </TabPanel>
    </AdminCheckouteStateContext.Provider>
  );
}
