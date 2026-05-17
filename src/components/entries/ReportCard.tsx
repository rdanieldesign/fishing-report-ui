import { Link } from "react-router-dom";
import { Trash2, MapPin, SquareArrowUpRight } from "lucide-react";
import dayjs from "dayjs";
import type { IEntry } from "../../types/entry.types";

interface ReportCardProps {
  report: IEntry;
  handleDelete?: (id: string) => void;
}

export function ReportCard({ report, handleDelete }: ReportCardProps) {
  return (
    <li className="border border-gray-200 border-l-primary border-l-6 bg-white rounded-lg overflow-hidden flex">
      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
        <Link to={`/entries/${report.id}`} className="hover:underline">
          <h5 className="inline-block mb-0">
            {dayjs(report.date).format("MMM D, YYYY")}
          </h5>
        </Link>
        <Link
          to={`/locations/${report.locationId}/entries`}
          className="text-primary hover:underline block"
        >
          <MapPin className="inline mx-1 ml-0 mb-0.5 text-primary" size={18} />
          <span className="text-base">{report.locationName}</span>
        </Link>
      </div>
      <div className="shrink-0 grow-0 flex flex-col justify-center py-4 md:mr-2">
        <div className="w-1 bg-gray-100 h-full rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-[6rem_6rem_6rem_3rem] shrink-0 w-48 md:w-84">
        {/* TODO: randomize colors / use author images */}
        <Link
          to={`/users/${report.authorId}/entries`}
          className="min-h-24 flex flex-col text-center items-center justify-center md:order-1"
        >
          <span className="block bg-primary py-1 px-2 mb-2 rounded text-white text-xl">
            {report.authorInitials}
          </span>
          <p className="text-xs text-gray-500 hidden md:block">
            {report.authorName}
          </p>
        </Link>
        {/* Actions */}
        <div className="min-h-24 bg-gray-900 flex flex-col items-center justify-evenly md:order-4">
          <Link
            to={`/entries/${report.id}`}
            className="text-gray-300 hover:text-gray-100"
          >
            <SquareArrowUpRight size={20} />
          </Link>
          {handleDelete && (
            <button
              type="button"
              onClick={() => handleDelete(report.id)}
              className="text-danger hover:text-danger-dark md:text-gray-300 md:hover:text-danger"
              aria-label="Delete entry"
            >
              <Trash2 size={20} />
            </button>
          )}{" "}
        </div>
        {/* Catch Count */}
        <div className="min-h-24 flex flex-col items-center justify-center text-center md:order-2">
          <p className="text-xs text-gray-500">catch</p>
          <span className="text-3xl text-primary">{report.catchCount}</span>
          <p className="text-xs text-gray-500">count</p>
        </div>
        {/* Image */}
        <div className="min-h-24 bg-gray-200 md:order-3">
          {report.thumbnailUrl && (
            <img
              src={report.thumbnailUrl}
              alt="Entry"
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>
    </li>
  );
}
