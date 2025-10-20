import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../../api/tasks";

export function DashboardPage() {
    const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });
    const stats = {
        total: tasks.length,
        pending: tasks.filter((t: any) => t.status === 'pending').length,
        inprog: tasks.filter((t: any) => t.status === 'In Progress').length,
        done: tasks.filter((t: any) => t.status === 'Done' ).length,
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Tasks" value={stats.total} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="In Progress" value={stats.inprog} />
                <StatCard label="Completed" value={stats.done} />
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return <div className="bg-white p-5 border rounded-xl shadow-sm"><div className="text-gray-500 text-sm">{label}</div><div className="text-2xl font-semibold">{value}</div></div>;
}