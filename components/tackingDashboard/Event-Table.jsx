"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function EventTable({ data }) {
  const [sortConfig, setSortConfig] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
    setCurrentPage(1)
  }

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) return <div className="w-4 h-4" />
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const truncateUrl = (url, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("timestamp")}>
                <div className="flex items-center gap-2">
                  Timestamp
                  <SortIcon column="timestamp" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("eventType")}>
                <div className="flex items-center gap-2">
                  Event Type
                  <SortIcon column="eventType" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("page")}>
                <div className="flex items-center gap-2">
                  Page
                  <SortIcon column="page" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("buttonName")}>
                <div className="flex items-center gap-2">
                  Button Name
                  <SortIcon column="buttonName" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("ipAddress")}>
                <div className="flex items-center gap-2">
                  IP Address
                  <SortIcon column="ipAddress" />
                </div>
              </TableHead>
              <TableHead className="text-right">Repetitions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((event) => (
              <TableRow key={event._id} className="hover:bg-muted/50">
                <TableCell className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {event.eventType}
                  </span>
                </TableCell>
                <TableCell className="text-sm" title={event.page}>
                  {truncateUrl(event.page)}
                </TableCell>
                <TableCell className="text-sm" title={event.buttonName}>
                  {truncateUrl(event.buttonName)}
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">{event.ipAddress}</TableCell>
                <TableCell className="text-right font-medium">{event.repetitionCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}{" "}
          events
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
