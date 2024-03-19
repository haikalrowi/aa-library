import { useId } from "react";

import useCustomReducer from "@/hooks/useCustomReducer";
import { adminCreateCopy } from "@/lib/action";
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
import { Prisma } from "@prisma/client";

import { AdminBookProps } from "./AdminBook";

export type AdminCopyProps = {
  copies: Prisma.CopyGetPayload<{ include: { Book: true } }>[];
};

function FormCreate({ hook, books }: HookProps & AdminBookProps) {
  const { state, dispatch } = hook;

  const bookIdDatalist = useId();

  return (
    <CardBody>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set", payload: { createFormLoading: true } });
          await adminCreateCopy(new FormData(e.currentTarget));
          dispatch({ type: "reset", payload: {} });
        }}
      >
        <Stack>
          <FormControl isRequired>
            <FormLabel>Book ID</FormLabel>
            <Input name="bookId" list={bookIdDatalist} />
            <datalist id={bookIdDatalist}>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.isbn.toString()} ({book.title}) ({book.author})
                </option>
              ))}
            </datalist>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Serial</FormLabel>
            <Input name="serial" />
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

function Create({ hook, books }: HookProps & AdminBookProps) {
  const { state, dispatch } = hook;

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
      {state.creating && <FormCreate hook={hook} books={books} />}
    </Card>
  );
}

function Search() {
  return (
    <Card>
      <CardBody>
        <Input placeholder="Search by serial, book title" />
      </CardBody>
    </Card>
  );
}

function Copy({ copies }: AdminCopyProps) {
  return copies.map((copy) => (
    <Card key={copy.id}>
      <CardBody>
        <Heading size={"md"}>{copy.Book.title}</Heading>
        <Badge>{copy.serial}</Badge>
        <Text>{copy.available ? "Available" : "Unavailable"}</Text>
      </CardBody>
      <CardBody>
        <Button>Update</Button>
      </CardBody>
    </Card>
  ));
}

export function AdminCopy({ copies, books }: AdminCopyProps & AdminBookProps) {
  const hook = useAdminCopyState();

  return (
    <TabPanel>
      <Stack>
        <Create hook={hook} books={books} />
        <Search />
        <Copy copies={copies} />
      </Stack>
    </TabPanel>
  );
}

type HookProps = {
  hook: ReturnType<typeof useAdminCopyState>;
};

function useAdminCopyState() {
  type State = Partial<{
    creating: boolean;
    createFormLoading: boolean;
  }>;

  const { state, dispatch } = useCustomReducer<State>({});

  return { state, dispatch };
}
