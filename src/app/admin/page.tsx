import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { adminIsAdmin } from "@/lib/action";

export default async function Admin() {
  const isAdmin = await adminIsAdmin();

  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
