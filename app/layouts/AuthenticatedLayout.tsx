"use client";

import UserProvider from "../providers/UserProvider";
import TopMenu from "../components/TopMenu/TopMenu";
import { UserData } from "../types/UserData";
import { Provider } from "react-redux";
import { store } from "../store";

// layout with top menu and content
export default function AuthenticatedLayout({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <div className="min-h-screen min-w-screen" style={{ background: 'var(--color-bg)' }}>
        <UserProvider user={user}>
          <TopMenu userData={user}/>
          <main className="pt-[48px] px-4">{children}</main>
        </UserProvider>
      </div>
    </Provider>
  );
}