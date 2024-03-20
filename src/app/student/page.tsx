import SharedLogin from "@/components/SharedLogin";
import StudentDashboard from "@/components/StudentDashboard";
import { studentIsStudent, studentLogin } from "@/lib/action";

function Login() {
  return <SharedLogin form={{ action: studentLogin }} />;
}

function Dashboard() {
  return <StudentDashboard />;
}

export default async function Student() {
  const isStudent = await studentIsStudent();

  return isStudent ? <Dashboard /> : <Login />;
}
