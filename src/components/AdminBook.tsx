import { useContext } from "react";

import { AdminBookStateContext, AdminDataContext } from "@/context/Admin";
import { useAdminBookState } from "@/hooks/Admin";
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

function FormCreate() {
  const { state, dispatch } = useContext(AdminBookStateContext)!;

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

function Create() {
  const { state, dispatch } = useContext(AdminBookStateContext)!;

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
  const { dispatch } = useContext(AdminBookStateContext)!;

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

function FormUpdate() {
  const { state, dispatch } = useContext(AdminBookStateContext)!;

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

function Books() {
  const { books } = useContext(AdminDataContext);
  const { state, dispatch } = useContext(AdminBookStateContext)!;

  return (state.searching ? state.searchResult : books)?.map((book) => (
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
        <FormUpdate />
      )}
    </Card>
  ));
}

export function AdminBook() {
  const state = useAdminBookState();

  return (
    <AdminBookStateContext.Provider value={state}>
      <TabPanel>
        <Stack>
          <Create />
          <Search />
          <Books />
        </Stack>
      </TabPanel>
    </AdminBookStateContext.Provider>
  );
}
