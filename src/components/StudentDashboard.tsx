"use client";

import { StudentData, StudentDataContext } from "@/context/Student";
import { studentLogout } from "@/lib/action";
import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";

import SharedLogout from "./SharedLogout";
import StudentBook from "./StudentBook";
import StudentCheckout from "./StudentCheckout";

export default function StudentDashboard({ data }: { data: StudentData }) {
  return (
    <StudentDataContext.Provider value={data}>
      <Tabs isFitted className="!flex h-full flex-col">
        <TabPanels className="flex-1">
          <StudentBook />
          <StudentCheckout />
          <SharedLogout form={{ action: studentLogout }} />
        </TabPanels>
        <TabList className="flex-none">
          <Tab>Book</Tab>
          <Tab>Checkout</Tab>
          <Tab>Logout</Tab>
        </TabList>
      </Tabs>
    </StudentDataContext.Provider>
  );
}
