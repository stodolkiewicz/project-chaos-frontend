"use client";

import { Provider } from "react-redux";
import { store } from "@/app/store";
import UserProvider from "../../providers/UserProvider";
import TopMenu from "../../components/TopMenu/TopMenu";

export default function DashboardClientWrapper({ user, children }) {
  return (
    <Provider store={store}>
      <UserProvider user={user}>
        <div className="min-h-screen">
          <TopMenu />
          <main className="pt-[48px] px-4">{children}</main>
        </div>
      </UserProvider>
    </Provider>
  );
}
