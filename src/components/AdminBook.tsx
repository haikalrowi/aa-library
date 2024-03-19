import { useEffect, useMemo } from "react";

import useCustomReducer from "@/hooks/useCustomReducer";
import {
  adminCreateBook,
  adminDeleteBook,
  adminUpdateBook,
} from "@/lib/action";
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
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

export type AdminBookProps = {
  books: Prisma.BookGetPayload<{}>[];
};

function FormCreate({ hook }: Hook) {
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
          <FormControl isRequired>
            <FormLabel>ISBN</FormLabel>
            <Input type="number" name="isbn" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Author</FormLabel>
            <Input name="author" />
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

function Create({ hook }: Hook) {
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
      {state.creating && <FormCreate hook={hook} />}
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

function FormUpdate({ hook }: Hook) {
  const { state, dispatch } = hook;

  return (
    <CardBody>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set", payload: { updateFormLoading: true } });
          await adminUpdateBook(new FormData(e.currentTarget));
          dispatch({ type: "reset", payload: {} });
        }}
      >
        <VisuallyHiddenInput
          value={state.updateCurrentBook?.id}
          readOnly
          name="id"
        />
        <Stack>
          <FormControl isRequired>
            <FormLabel>ISBN</FormLabel>
            <Input
              type="number"
              defaultValue={state.updateCurrentBook?.isbn.toString()}
              name="isbn"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input defaultValue={state.updateCurrentBook?.title} name="title" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Author</FormLabel>
            <Input
              defaultValue={state.updateCurrentBook?.author}
              name="author"
            />
          </FormControl>
          <Button
            type="submit"
            isLoading={state.updateFormLoading}
            isDisabled={state.deleting}
          >
            Update
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              dispatch({ type: "set", payload: { updating: false } });
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"ghost"}
            colorScheme="red"
            isLoading={state.deleting}
            isDisabled={state.updateFormLoading}
            onClick={async (e) => {
              dispatch({ type: "set", payload: { deleting: true } });
              const form = e.currentTarget.form;
              if (!form) {
                return;
              }
              await adminDeleteBook(new FormData(form));
              dispatch({ type: "reset", payload: {} });
            }}
          >
            Delete
          </Button>
        </Stack>
      </form>
    </CardBody>
  );
}

function Books({ books, hook }: Partial<AdminBookProps> & Hook) {
  const { state, dispatch } = hook;

  return books?.map((book) => (
    <Card key={book.id}>
      <CardBody>
        <Heading size={"md"}>{book.title}</Heading>
        <Badge>{book.isbn.toString()}</Badge>
        <Text>{book.author}</Text>
      </CardBody>
      <CardBody>
        <Button
          onClick={() => {
            dispatch({
              type: "set",
              payload: { updating: true, updateCurrentBook: book },
            });
          }}
        >
          Update
        </Button>
      </CardBody>
      {state.updating && state.updateCurrentBook?.id === book.id && (
        <FormUpdate hook={hook} />
      )}
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
        <Books
          books={state.searching ? state.searchResult : books}
          hook={hook}
        />
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
    searchResult: typeof books;
    updating: boolean;
    updateCurrentBook: (typeof books)[number];
    updateFormLoading: boolean;
    deleting: boolean;
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
