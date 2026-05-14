import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";
import type { IEntry } from "../../types/entry.types";

interface ReportCardProps {
  report: IEntry;
  handleDelete?: (id: string) => void;
}

export function ReportCard({ report, handleDelete }: ReportCardProps) {
  return (
    <li className="border border-gray-200 bg-white rounded-lg flex items-start justify-between px-4 py-3">
      <div className="space-y-0.5 min-w-0">
        <Link
          to={`/entries/${report.id}`}
          className="block text-sm font-medium text-primary hover:underline truncate"
        >
          {report.notes || dayjs(report.date).format("MMM D, YYYY")}
        </Link>
        <p className="text-xs text-gray-500">
          Author:{" "}
          <Link
            to={`/users/${report.authorId}/entries`}
            className="text-primary hover:underline"
          >
            {report.authorName}
          </Link>
        </p>
        <p className="text-xs text-gray-500">
          Location:{" "}
          <Link
            to={`/locations/${report.locationId}/entries`}
            className="text-primary hover:underline"
          >
            {report.locationName}
          </Link>
        </p>
        <p className="text-xs text-gray-500">
          Date: {dayjs(report.date).format("MMM D, YYYY")}
        </p>
        <p className="text-xs text-gray-500">
          Catch Count: {report.catchCount}
        </p>
      </div>

      {handleDelete && (
        <button
          type="button"
          onClick={() => handleDelete(report.id)}
          className="ml-3 shrink-0 text-danger hover:text-danger-dark"
          aria-label="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      )}
    </li>
  );
}
