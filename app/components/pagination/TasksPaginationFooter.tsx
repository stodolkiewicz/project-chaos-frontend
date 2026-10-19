import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// The first option is the default page size. In the 3-column grid none of them fills the last row, so the "+" fits there
export const TASKS_PAGE_SIZE_OPTIONS = [10, 25, 50]

interface TasksPaginationFooterProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  totalElements: number
}

export function TasksPaginationFooter({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalElements,
}: TasksPaginationFooterProps) {
  if (totalElements <= 0) {
    return null
  }

  const firstShown = currentPage * pageSize + 1
  const lastShown = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    // The side columns share the free space equally, so the pagination stays centered
    <div className="flex flex-col items-center gap-2 px-2 sm:grid sm:grid-cols-[1fr_auto_1fr]">
      <span className="text-sm text-text-muted sm:justify-self-start">
        Showing {firstShown}–{lastShown} of {totalElements}
      </span>

      <div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 0) {
                      onPageChange(currentPage - 1)
                    }
                  }}
                  className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => onPageChange(index)}
                    isActive={index === currentPage}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages - 1) {
                      onPageChange(currentPage + 1)
                    }
                  }}
                  className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-text-muted sm:justify-self-end">
        Per page
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger size="sm" aria-label="Tasks per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASKS_PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  )
}
