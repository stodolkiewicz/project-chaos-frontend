import { extractTokenInfoFromCookies } from "@/lib/tokenHelper";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import DashboardContent from "./components/DashboardContent";
import { UserAuthPayload } from "../types/UserData";

export default async function Dashboard() {
  // await + this function accesses cookies = only in server component
  const user: UserAuthPayload = await extractTokenInfoFromCookies();

  return (
    <AuthenticatedLayout user={user}>
      <DashboardContent />
    </AuthenticatedLayout>
  );
}
