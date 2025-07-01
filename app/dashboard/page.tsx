import { extractTokenInfoFromCookies } from "@/lib/tokenHelper";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import DashboardContent from "./components/DashboardContent";
import { UserData } from "../types/UserData";

export default async function Dashboard() {
  // await + this function accesses cookies = only in server component
  const user: UserData = await extractTokenInfoFromCookies();

  return (
    <AuthenticatedLayout user={user}>
      <DashboardContent />
    </AuthenticatedLayout>
  );
}
