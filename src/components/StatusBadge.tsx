// StatusBadge component to display task status
import type { Status } from "../types";

export function StatusBadge({ value }: { value: Status }) {
    const cls = value === 'Done' ? 'bg-green-100 text-green-700' : value === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700';
    return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{value}</span>;
}