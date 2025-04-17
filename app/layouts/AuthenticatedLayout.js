"use client";

import { Provider } from "react-redux";
import { store } from "@/app/store";
import UserProvider from "../providers/UserProvider";
import TopMenu from "../components/TopMenu/TopMenu";

// layout with top menu and content
export default function AuthenticatedLayout({ user, children }) {
  return (
    <Provider store={store}>
      {/* individual provider for user state initialisation */}
      <UserProvider user={user}>
        <div className="min-h-screen">
          <TopMenu />
          <main className="pt-[48px] px-4">{children}</main>
        </div>
      </UserProvider>
    </Provider>
  );
}
