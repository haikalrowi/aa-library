import { useEffect, useMemo } from "react";

import useCustomReducer from "@/hooks/useCustomReducer";
import { adminCreateBook } from "@/lib/action";
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

export type AdminBookProps = {
  books: Prisma.BookGetPayload<{}>[];
};

function Form({ hook }: Hook) {
  const { state, dispatch } = hook;

  return (
    <CardBody>
      <form
        action={adminCreateBook}
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set", payload: { createFormLoading: true } });
          await adminCreateBook(new FormData(e.currentTarget));
          dispatch({ type: "reset", payload: {} });
        }}
      >
        <Stack>
          <FormControl>
            <FormLabel>ISBN</FormLabel>
            <Input type="number" required name="isbn" />
          </FormControl>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input required name="title" />
          </FormControl>
          <FormControl>
            <FormLabel>Author</FormLabel>
            <Input required name="author" />
          </FormControl>
          <Button type="submit" isLoading={state.createFormLoading}>
            Create
          </Button>
          <Button
            variant={"ghost"}
            onClick={() =>
              dispatch({ type: "set", payload: { creating: false } })
            }
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </CardBody>
  );
}

function Create({ hook }: Hook) {
  const { state, dispatch } = hook;

  return (
    <Card>
      <CardBody>
        <Button
          onClick={() => dispatch({ type: "set", payload: { creating: true } })}
        >
          Create
        </Button>
      </CardBody>
      {state.creating && <Form hook={hook} />}
    </Card>
  );
}

function Search({ hook }: Hook) {
  const { dispatch } = hook;

  return (
    <Card>
      <CardBody>
        <Input
          placeholder="Search by tile, author, ISBN"
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

function Books({ books }: Partial<AdminBookProps>) {
  return books?.map((book) => (
    <Card key={book.id}>
      <CardBody>
        <Heading size={"md"}>{book.title}</Heading>
        <Badge>{book.isbn.toString()}</Badge>
        <Text>{book.author}</Text>
      </CardBody>
      <CardBody>
        <Button>Update</Button>
      </CardBody>
    </Card>
  ));
}

export function AdminBook({ books }: AdminBookProps) {
  const hook = useAdminBookState({ books });
  const { state } = hook;

  return (
    <TabPanel>
      <Stack>
        <Create hook={hook} />
        <Search hook={hook} />
        <Books books={state.searching ? state.searchResult : books} />
      </Stack>
    </TabPanel>
  );
}

type Hook = {
  hook: ReturnType<typeof useAdminBookState>;
};

function useAdminBookState({ books }: AdminBookProps) {
  type State = Partial<{
    creating: boolean;
    createFormLoading: boolean;
    searching: boolean;
    searchTerm: string;
    searchResult: Prisma.BookGetPayload<{}>[];
  }>;

  const { state, dispatch } = useCustomReducer<State>({});
  const searchBooks = useMemo(() => {
    const searchTerm = state.searchTerm;
    if (searchTerm) {
      return books.filter((book) =>
        [book.title, book.author, book.isbn.toString()]
          .map((term) => term.toLowerCase())
          .some((term) => term.includes(searchTerm.toLowerCase())),
      );
    }
    return books;
  }, [books, state.searchTerm]);

  useEffect(() => {
    dispatch({ type: "set", payload: { searchResult: searchBooks } });
  }, [searchBooks, dispatch]);

  return { state, dispatch };
}
