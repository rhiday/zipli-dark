"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ParsedExcelData } from "@/lib/excel-parser"
import { FileSpreadsheet, Rows3 } from "lucide-react"

interface DataPreviewProps {
  data: ParsedExcelData
  maxRows?: number
}

export function DataPreview({ data, maxRows = 5 }: DataPreviewProps) {
  const previewRows = data.rows.slice(0, maxRows)
  const hasMoreRows = data.rows.length > maxRows

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Data Preview
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Rows3 className="h-4 w-4" />
            {data.totalRows} rows
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header) => (
                  <TableHead key={header} className="whitespace-nowrap font-semibold">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {data.headers.map((header) => (
                    <TableCell key={header} className="whitespace-nowrap">
                      {formatCellValue(row[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {hasMoreRows && (
                <TableRow>
                  <TableCell
                    colSpan={data.headers.length}
                    className="text-center text-muted-foreground py-4"
                  >
                    ... and {data.rows.length - maxRows} more rows
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return String(value)
}

