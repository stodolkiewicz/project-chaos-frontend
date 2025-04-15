import LoginCard from "./components/root-path-logging/LoginCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="text-center mb-8">
        <h1>Project Chaos</h1>
        <p className="text-xl">Manage your projects in a Kanban style</p>
      </div>
      <LoginCard />
    </main>
  );
}
