import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { adminIsAdmin } from "@/lib/action";
import prisma from "@/lib/prisma";

function Login() {
  return <AdminLogin />;
}

async function Dashboard() {
  const books = await prisma.book.findMany();

  return <AdminDashboard books={books} />;
}

export default async function Admin() {
  const isAdmin = await adminIsAdmin();

  return isAdmin ? <Dashboard /> : <Login />;
}
