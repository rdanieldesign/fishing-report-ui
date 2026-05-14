import { Button } from "../components/shared/Button";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 gap-y-8">
      {/* Row 1 — 4 equal widgets */}
      <div className="col-span-4 lg:col-span-3 rounded-lg bg-primary py-6 px-10">
        <h2 className="text-[4rem] text-white">102</h2>
        <p className="text-white text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="col-span-4 lg:col-span-3 rounded-lg bg-white border border-gray-300 py-6 px-10">
        <h2 className="text-[4rem]">102</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="col-span-4 lg:col-span-3 rounded-lg bg-white border border-gray-300 py-6 px-10">
        <h2 className="text-[4rem]">102</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="col-span-4 lg:col-span-3 rounded-lg bg-white border border-gray-300 py-6 px-10">
        <h2 className="text-[4rem]">102</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Row 2 — two containers */}
      <div className="col-span-4 md:col-span-6 lg:col-span-8 rounded-lg overflow-hidden">
        {/* Mock Image */}
        <div className="h-120 w-full bg-gray-500" />
      </div>
      <div className="col-span-4 md:col-span-2 lg:col-span-4 self-center">
        <p className="mb-4">This time last year...</p>
        <h2>Sweetwater Creek</h2>
        <Button>View Report</Button>
      </div>
    </div>
  );
}
