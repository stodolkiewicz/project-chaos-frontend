export default interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  totalElements: number
  onPageChange: (page: number) => void
  isLoading: boolean
}