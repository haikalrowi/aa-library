import SharedLogin from "@/components/SharedLogin";
import StudentDashboard from "@/components/StudentDashboard";
import { studentIsStudent, studentLogin } from "@/lib/action";
import prisma from "@/lib/prisma";

function Login() {
  return <SharedLogin form={{ action: studentLogin }} />;
}

function Dashboard(props: { studentId: string }) {
  const books = prisma.book.findMany({
    where: { Copy: { some: { available: true } } },
  });
  const checkouts = prisma.checkout.findMany({
    where: { studentId: props.studentId },
  });

  return <StudentDashboard />;
}

export default async function Student() {
  const { isStudent, studentId } = await studentIsStudent();

  return isStudent ? <Dashboard studentId={studentId} /> : <Login />;
}
