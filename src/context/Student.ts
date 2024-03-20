import { createContext } from "react";

import { Prisma } from "@prisma/client";

export type StudentData = Partial<{
  books: Prisma.BookGetPayload<{}>[];
  checkouts: Prisma.CheckoutGetPayload<{}>[];
}>;

export const StudentDataContext = createContext<StudentData>({});
