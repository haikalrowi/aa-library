import { createContext } from "react";

import { useStudentBookState, useStudentCheckoutState } from "@/hooks/Student";
import { Prisma } from "@prisma/client";

export type StudentData = Partial<{
  books: Prisma.BookGetPayload<{}>[];
  checkouts: Prisma.CheckoutGetPayload<{
    include: { Copy: { include: { Book: true } } };
  }>[];
}>;
export type StudentBookState =
  | ReturnType<typeof useStudentBookState>
  | undefined;
export type StudentCheckoutState =
  | ReturnType<typeof useStudentCheckoutState>
  | undefined;

export const StudentDataContext = createContext<StudentData>({});
export const StudentBookStateContext =
  createContext<StudentBookState>(undefined);
export const StudentCheckoutStateContext =
  createContext<StudentCheckoutState>(undefined);
