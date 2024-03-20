import { useContext, useId } from "react";

import { AdminCopyStateContext, AdminDataContext } from "@/context/Admin";
import { useAdminCopyState } from "@/hooks/Admin";
import {
  adminCreateCopy,
  adminDeleteCopy,
  adminUpdateCopy,
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
  const { books } = useContext(AdminDataContext);
  const { state, dispatch } = useContext(AdminCopyStateContext)!;

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
              {books?.map((book) => (
                <option key={book.id} value={book.id}>
                  {[book.isbn.toString(), book.title, book.author].join("; ")}
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

function Create() {
  const { state, dispatch } = useContext(AdminCopyStateContext)!;

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
  const { dispatch } = useContext(AdminCopyStateContext)!;

  return (
    <Card>
      <CardBody>
        <Input
          placeholder="Search by serial, book title"
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
  const { state, dispatch } = useContext(AdminCopyStateContext)!;

  return (
    <CardBody>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set", payload: { updateFormLoading: true } });
          await adminUpdateCopy(new FormData(e.currentTarget));
          dispatch({ type: "reset", payload: {} });
        }}
      >
        <VisuallyHiddenInput
          value={state.updateCurrentCopy?.id}
          readOnly
          name="id"
        />
        <Stack>
          <FormControl isRequired>
            <FormLabel>Serial</FormLabel>
            <Input
              defaultValue={state.updateCurrentCopy?.serial}
              name="serial"
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
              e.preventDefault();
              dispatch({ type: "set", payload: { deleting: true } });
              const form = e.currentTarget.form;
              if (!form) {
                return;
              }
              await adminDeleteCopy(new FormData(form));
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

function Copy() {
  const { copies } = useContext(AdminDataContext);
  const { state, dispatch } = useContext(AdminCopyStateContext)!;

  return (state.searching ? state.searchResult : copies)?.map((copy) => (
    <Card key={copy.id}>
      <CardBody>
        <Heading size={"md"}>{copy.Book.title}</Heading>
        <Badge>{copy.serial}</Badge>
        <Text>{copy.available ? "Available" : "Unavailable"}</Text>
      </CardBody>
      <CardBody>
        <Button
          onClick={() => {
            dispatch({
              type: "set",
              payload: { updating: true, updateCurrentCopy: copy },
            });
          }}
        >
          Update
        </Button>
      </CardBody>
      {state.updating && state.updateCurrentCopy?.id === copy.id && (
        <FormUpdate />
      )}
    </Card>
  ));
}

export default function AdminCopy() {
  const state = useAdminCopyState();

  return (
    <AdminCopyStateContext.Provider value={state}>
      <TabPanel>
        <Stack>
          <Create />
          <Search />
          <Copy />
        </Stack>
      </TabPanel>
    </AdminCopyStateContext.Provider>
  );
}
