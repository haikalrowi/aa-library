import SharedLogin from "@/components/SharedLogin";
import StudentDashboard from "@/components/StudentDashboard";
import { demo } from "@/config";
import { studentIsStudent, studentLogin } from "@/lib/action";
import prisma from "@/lib/prisma";

function Login() {
  return (
    <>
      {demo.enabled && <demo.DemoStudentLogin />}
      <SharedLogin form={{ action: studentLogin }} />
    </>
  );
}

async function Dashboard(props: { studentId: string }) {
  const books = await prisma.book.findMany({
    where: { Copy: { some: { available: true } } },
  });
  const checkouts = await prisma.checkout.findMany({
    where: { studentId: props.studentId },
    include: { Copy: { include: { Book: true } } },
    orderBy: { returned: "asc" },
  });

  return <StudentDashboard data={{ books, checkouts }} />;
}

export default async function Student() {
  const { isStudent, studentId } = await studentIsStudent();

  return isStudent ? <Dashboard studentId={studentId} /> : <Login />;
}
