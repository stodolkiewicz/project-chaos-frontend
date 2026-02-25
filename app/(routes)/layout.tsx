import { extractTokenInfoFromCookies } from "@/lib/tokenHelper";
import { UserData } from "../types/UserData";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: UserData = await extractTokenInfoFromCookies();

  return (
    <AuthenticatedLayout user={user}>
      {children}
    </AuthenticatedLayout>
  );
}