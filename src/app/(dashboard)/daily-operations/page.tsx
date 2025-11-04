import { DataTable } from "../dashboard/components/data-table"
import data from "../dashboard/data/data.json"
import pastPerformanceData from "../dashboard/data/past-performance-data.json"
import keyPersonnelData from "../dashboard/data/key-personnel-data.json"
import focusDocumentsData from "../dashboard/data/focus-documents-data.json"

export default function DailyOperationsPage() {
  return (
    <div className="px-6">
      <h1 className="text-2xl font-semibold">Food Inventory Tracking</h1>
      <div className="mt-6">
        <DataTable
          data={data}
          pastPerformanceData={pastPerformanceData}
          keyPersonnelData={keyPersonnelData}
          focusDocumentsData={focusDocumentsData}
        />
      </div>
    </div>
  )
}


