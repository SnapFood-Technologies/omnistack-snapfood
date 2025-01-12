// components/ui/data-table.tsx
"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PenIcon, Trash2Icon, Eye } from "lucide-react"
import InputSelect from "../Common/InputSelect"


interface DataTableProps {
  data: any[]
  columns: {
    header: string
    accessorKey: string
    cell?: (row: any) => React.ReactNode
  }[]
  onView?: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  searchKey?: string
  showToolbar?: boolean
}

export function DataTable({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  searchKey = "title",
  showToolbar = true,
}: DataTableProps) {

    const [pageSize, setPageSize] = React.useState("10")

  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <InputSelect
              name="pageSize"
              label="" // or "Show" if you want a small label
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              options={[
                { value: "10", label: "10 rows" },
                { value: "20", label: "20 rows" },
                { value: "50", label: "50 rows" },
                { value: "100", label: "100 rows" },
              ]}
            />
            <span className="text-sm text-muted-foreground">records</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Search:</span>
            <Input
              placeholder="Search..."
              className="max-w-sm"
              onChange={(e) => {
                // Implement search functionality
              }}
            />
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
                {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
                ))}
                {(onEdit || onDelete || onView) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
        </TableHeader>
        <TableBody>
        {data.map((row) => (
            <TableRow key={row.id}>
            {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                {column.cell ? column.cell(row) : row[column.accessorKey]}
                </TableCell>
            ))}

            {(onView || onEdit || onDelete) && (
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row)}
                    >
                      <PenIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
            </TableRow>
        ))}
        </TableBody>
        </Table>
      </div>
    </div>
  )
}