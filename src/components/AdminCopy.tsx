import { useEffect, useId, useMemo } from "react";

import useCustomReducer from "@/hooks/useCustomReducer";
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

function Search({ hook }: HookProps) {
  const { dispatch } = hook;

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

function FormUpdate({ hook }: HookProps) {
  const { state, dispatch } = hook;

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

function Copy({ copies, hook }: Partial<AdminCopyProps> & HookProps) {
  const { state, dispatch } = hook;

  return copies?.map((copy) => (
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
        <FormUpdate hook={hook} />
      )}
    </Card>
  ));
}

export function AdminCopy({ copies, books }: AdminCopyProps & AdminBookProps) {
  const hook = useAdminCopyState({ copies });
  const { state } = hook;

  return (
    <TabPanel>
      <Stack>
        <Create hook={hook} books={books} />
        <Search hook={hook} />
        <Copy
          copies={state.searching ? state.searchResult : copies}
          hook={hook}
        />
      </Stack>
    </TabPanel>
  );
}

type HookProps = {
  hook: ReturnType<typeof useAdminCopyState>;
};

function useAdminCopyState({ copies }: AdminCopyProps) {
  type State = Partial<{
    creating: boolean;
    createFormLoading: boolean;
    searching: boolean;
    searchTerm: string;
    searchResult: typeof copies;
    updating: boolean;
    updateCurrentCopy: (typeof copies)[0];
    updateFormLoading: boolean;
    deleting: boolean;
  }>;

  const { state, dispatch } = useCustomReducer<State>({});
  const searchResult = useMemo(() => {
    const searchTerm = state.searchTerm;
    if (searchTerm) {
      return copies.filter((copy) =>
        [copy.serial, copy.Book.title]
          .map((term) => term.toLowerCase())
          .some((term) => term.includes(searchTerm.toLowerCase())),
      );
    }
    return copies;
  }, [copies, state.searchTerm]);

  useEffect(() => {
    dispatch({ type: "set", payload: { searchResult } });
  }, [dispatch, searchResult]);

  return { state, dispatch };
}
