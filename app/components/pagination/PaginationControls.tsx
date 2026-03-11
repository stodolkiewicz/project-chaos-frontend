import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  currentPageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  totalElements?: number
  className?: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  currentPageSize,
  onPageSizeChange,
  totalElements = 0,
  className = ""
}: PaginationControlsProps) {
  if (totalElements <= 0) {
    return null
  }

  return (
    <div className={`border-t pt-4 mt-2 ${className}`}>
      <div className="flex flex-col">
        {/* Page Size Controls */}
        {currentPageSize !== undefined && onPageSizeChange && (
          <div className="flex justify-end items-center gap-2">
            {[5, 10, 20].map((size) => (
              <button
                key={size}
                onClick={() => onPageSizeChange(size)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPageSize === size
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center">
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
          </div>
        )}
      </div>
    </div>
  )
}