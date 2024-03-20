import { useContext } from "react";

import { StudentBookStateContext, StudentDataContext } from "@/context/Student";
import { useStudentBookState } from "@/hooks/Student";
import {
  Badge,
  Card,
  CardBody,
  Heading,
  Input,
  Stack,
  TabPanel,
  Text,
} from "@chakra-ui/react";

function Search() {
  const { dispatch } = useContext(StudentBookStateContext)!;

  return (
    <Card>
      <CardBody>
        <Input
          placeholder="Search by title, author, isbn"
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

function Books() {
  const { books } = useContext(StudentDataContext);
  const { state } = useContext(StudentBookStateContext)!;

  return (state.searching ? state.searchResult : books)?.map((book) => (
    <Card key={book.id}>
      <CardBody>
        <Heading size={"md"}>{book.title}</Heading>
        <Badge>{book.isbn.toString()}</Badge>
        <Text>{book.author}</Text>
      </CardBody>
    </Card>
  ));
}

export default function StudentBook() {
  const state = useStudentBookState();

  return (
    <StudentBookStateContext.Provider value={state}>
      <TabPanel>
        <Stack>
          <Search />
          <Books />
        </Stack>
      </TabPanel>
    </StudentBookStateContext.Provider>
  );
}
