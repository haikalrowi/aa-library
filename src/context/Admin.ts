import { createContext } from "react";

import { useAdminBookState, useAdminCopyState } from "@/hooks/Admin";
import { Prisma } from "@prisma/client";

export type AdminData = Partial<{
  books: Prisma.BookGetPayload<{}>[];
  copies: Prisma.CopyGetPayload<{
    include: {
      Book: true;
    };
  }>[];
}>;
export type AdminBookState = ReturnType<typeof useAdminBookState> | undefined;
export type AdminCopyState = ReturnType<typeof useAdminCopyState> | undefined;

export const AdminDataContext = createContext<AdminData>({});
export const AdminBookStateContext = createContext<AdminBookState>(undefined);
export const AdminCopyStateContext = createContext<AdminCopyState>(undefined);
