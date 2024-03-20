import { createContext } from "react";

import { useStudentBookState } from "@/hooks/Student";
import { Prisma } from "@prisma/client";

export type StudentData = Partial<{
  books: Prisma.BookGetPayload<{}>[];
  checkouts: Prisma.CheckoutGetPayload<{}>[];
}>;

export type StudentBookState =
  | ReturnType<typeof useStudentBookState>
  | undefined;

export const StudentDataContext = createContext<StudentData>({});
export const StudentBookStateContext =
  createContext<StudentBookState>(undefined);
