import Sidebar from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#030303]">
      <Sidebar />
      <main className="flex-1 p-4 pl-80">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </main>
    </div>
  );
}
