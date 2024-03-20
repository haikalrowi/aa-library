import SharedLayout from "@/components/SharedLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
