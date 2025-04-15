import { extractAccesstokenInfoFromCookie } from "@/lib/tokenHelper";
import DashboardClientWrapper from "./components/DashboardClientWrapper";

export default async function DashboardLayout({ children }) {
  const user = await extractAccesstokenInfoFromCookie();

  // props only gofrom client component to client component.
  // That's why this wrapper is needed here
  return (
    <DashboardClientWrapper user={user}>{children}</DashboardClientWrapper>
  );
}
