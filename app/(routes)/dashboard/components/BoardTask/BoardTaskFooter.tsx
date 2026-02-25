interface BoardTaskFooterProps {
  assigneeEmail: string;
}

export default function BoardTaskFooter({
  assigneeEmail,
}: BoardTaskFooterProps) {
  return (
    <div className="flex flex-col xl:flex-row mt-3">
      <div className="text-xs font-medium flex-1">assigned&nbsp;to:</div>
      <div className="text-xs break-all">{assigneeEmail}</div>
    </div>
  );
}
