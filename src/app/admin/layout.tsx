import SharedLayout from "@/components/SharedLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
