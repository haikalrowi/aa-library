import { createContext } from "react";

import {
  useAdminBookState,
  useAdminCheckoutState,
  useAdminCopyState,
} from "@/hooks/Admin";
import { Prisma } from "@prisma/client";

export type AdminData = Partial<{
  books: Prisma.BookGetPayload<{}>[];
  copies: Prisma.CopyGetPayload<{ include: { Book: true } }>[];
  checkouts: Prisma.CheckoutGetPayload<{
    include: {
      Student: { select: { id: true; email: true; name: true } };
      Copy: { include: { Book: true } };
    };
  }>[];
  students: Prisma.StudentGetPayload<{
    select: { id: true; email: true; name: true };
  }>[];
  copiesAvailable: Prisma.CopyGetPayload<{ include: { Book: true } }>[];
}>;
export type AdminBookState = ReturnType<typeof useAdminBookState> | undefined;
export type AdminCopyState = ReturnType<typeof useAdminCopyState> | undefined;
export type AdminCheckoutState =
  | ReturnType<typeof useAdminCheckoutState>
  | undefined;

export const AdminDataContext = createContext<AdminData>({});
export const AdminBookStateContext = createContext<AdminBookState>(undefined);
export const AdminCopyStateContext = createContext<AdminCopyState>(undefined);
export const AdminCheckouteStateContext =
  createContext<AdminCheckoutState>(undefined);
