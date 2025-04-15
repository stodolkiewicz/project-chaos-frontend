import { extractAccesstokenInfoFromCookie } from "@/lib/tokenHelper";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

export default async function DashboardLayout({ children }) {
  // await + this function accesses cookies = only in server component
  const user = await extractAccesstokenInfoFromCookie();

  // UserProvider uses a hook -> client component
  return <AuthenticatedLayout user={user}>{children}</AuthenticatedLayout>;
}
