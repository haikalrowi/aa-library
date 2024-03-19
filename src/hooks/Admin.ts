import { useContext, useEffect, useMemo } from "react";

import { AdminDataContext } from "@/context/Admin";

import useCustomReducer from "./useCustomReducer";

export function useAdminBookState() {
  type State = Partial<{
    creating: boolean;
    createFormLoading: boolean;
    searching: boolean;
    searchTerm: string;
    searchResult: typeof books;
    updating: boolean;
    updateCurrentBook: NonNullable<typeof books>[number];
    updateFormLoading: boolean;
    deleting: boolean;
  }>;

  const { books } = useContext(AdminDataContext);
  const { state, dispatch } = useCustomReducer<State>({});
  const searchBooks = useMemo(() => {
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
    dispatch({ type: "set", payload: { searchResult: searchBooks } });
  }, [dispatch, searchBooks]);

  return { state, dispatch };
}

export function useAdminCopyState() {
  type State = Partial<{
    creating: boolean;
    createFormLoading: boolean;
    searching: boolean;
    searchTerm: string;
    searchResult: typeof copies;
    updating: boolean;
    updateCurrentCopy: NonNullable<typeof copies>[number];
    updateFormLoading: boolean;
    deleting: boolean;
  }>;

  const { copies } = useContext(AdminDataContext);
  const { state, dispatch } = useCustomReducer<State>({});
  const searchResult = useMemo(() => {
    const searchTerm = state.searchTerm;
    if (searchTerm) {
      return copies?.filter((copy) =>
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
