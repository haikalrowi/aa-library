import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { adminIsAdmin } from "@/lib/action";
import prisma from "@/lib/prisma";

function Login() {
  return <AdminLogin />;
}

async function Dashboard() {
  const books = await prisma.book.findMany();
  const copies = await prisma.copy.findMany({ include: { Book: true } });
  const checkouts = await prisma.checkout.findMany({
    include: {
      Student: { select: { id: true, email: true, name: true } },
      Copy: { include: { Book: true } },
    },
  });
  const students = await prisma.student.findMany({
    select: { id: true, email: true, name: true },
  });
  const copiesAvailable = await prisma.copy.findMany({
    where: { available: true },
  });

  return <AdminDashboard data={{ books, copies }} />;
}

export default async function Admin() {
  const isAdmin = await adminIsAdmin();

  return isAdmin ? <Dashboard /> : <Login />;
}
