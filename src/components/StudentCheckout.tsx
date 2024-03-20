import {
  StudentCheckoutStateContext,
  StudentDataContext,
} from "@/context/Student";
import { useStudentCheckoutState } from "@/hooks/Student";
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
import { useContext } from "react";

function Search() {
  const { dispatch } = useContext(StudentCheckoutStateContext)!;

  return (
    <Card>
      <CardBody>
        <Input
          placeholder="Search by book (title, author, isbn), copy (serial)"
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
  const { checkouts } = useContext(StudentDataContext);
  const { state } = useContext(StudentCheckoutStateContext)!;

  return (state.searching ? state.searchResult : checkouts)?.map((checkout) => (
    <Card key={checkout.id}>
      <CardBody>
        <Text className="text-right">
          <Badge>{checkout.returned ? "Returned" : "Not Returned"}</Badge>
        </Text>
        <Heading size={"md"}>{checkout.Copy.Book.title}</Heading>
        <Badge>{checkout.Copy.Book.isbn.toString()}</Badge>
        <Text>{checkout.Copy.Book.author}</Text>
      </CardBody>
      <CardBody>
        <Badge>{checkout.Copy.serial}</Badge>
      </CardBody>
    </Card>
  ));
}

export default function StudentCheckout() {
  const state = useStudentCheckoutState();

  return (
    <StudentCheckoutStateContext.Provider value={state}>
      <TabPanel>
        <Stack>
          <Search />
          <Checkout />
        </Stack>
      </TabPanel>
    </StudentCheckoutStateContext.Provider>
  );
}
