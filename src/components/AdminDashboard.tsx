"use client";

import { useFormStatus } from "react-dom";

import { AdminData, AdminDataContext } from "@/context/Admin";
import { Button, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";

import { AdminBook } from "./AdminBook";
import { AdminCopy } from "./AdminCopy";
import { AdminLogout } from "./AdminLogout";

export function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      Logout
    </Button>
  );
}

export default function AdminDashboard({ data }: { data: AdminData }) {
  return (
    <AdminDataContext.Provider value={data}>
      <Tabs isFitted className="!flex h-full flex-col" defaultIndex={0}>
        <TabPanels className="flex-1 overflow-y-scroll">
          <AdminBook />
          <AdminCopy />
          {/* <AdminCheckout /> */}
          <AdminLogout />
        </TabPanels>
        <TabList className="flex-none">
          <Tab>Book</Tab>
          <Tab>Copy</Tab>
          <Tab>Checkout</Tab>
          <Tab>Logout</Tab>
        </TabList>
      </Tabs>
    </AdminDataContext.Provider>
  );
}
