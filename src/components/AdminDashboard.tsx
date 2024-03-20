"use client";

import { AdminData, AdminDataContext } from "@/context/Admin";
import { adminLogout } from "@/lib/action";
import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";

import AdminBook from "./AdminBook";
import AdminCheckout from "./AdminCheckout";
import AdminCopy from "./AdminCopy";
import SharedLogout from "./SharedLogout";

export default function AdminDashboard({ data }: { data: AdminData }) {
  return (
    <AdminDataContext.Provider value={data}>
      <Tabs isFitted className="!flex h-full flex-col" defaultIndex={2}>
        <TabPanels className="flex-1 overflow-y-scroll">
          <AdminBook />
          <AdminCopy />
          <AdminCheckout />
          <SharedLogout form={{ action: adminLogout }} />
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
