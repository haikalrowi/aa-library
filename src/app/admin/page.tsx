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

  return <AdminDashboard books={books} copies={copies} />;
}

export default async function Admin() {
  const isAdmin = await adminIsAdmin();

  return isAdmin ? <Dashboard /> : <Login />;
}
