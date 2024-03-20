import { useContext, useEffect, useMemo } from "react";

import { StudentDataContext } from "@/context/Student";

import useCustomReducer from "./useCustomReducer";

export function useStudentBookState() {
  type State = Partial<{
    searching: boolean;
    searchTerm: string;
    searchResult: typeof books;
  }>;

  const { books } = useContext(StudentDataContext);
  const { state, dispatch } = useCustomReducer<State>({});
  const searchResult = useMemo(() => {
    const searchTerm = state.searchTerm;
    if (searchTerm) {
      return books?.filter((book) =>
        [book.title, book.author, book.isbn.toString()]
          .map((term) => term.toLowerCase())
          .some((term) => term.includes(searchTerm.toLowerCase())),
      );
    }
    return books;
  }, [books, state.searchTerm]);

  useEffect(() => {
    dispatch({ type: "set", payload: { searchResult } });
  }, [dispatch, searchResult]);

  return { state, dispatch };
}
