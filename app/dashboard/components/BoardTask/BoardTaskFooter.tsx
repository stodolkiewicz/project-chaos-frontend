interface BoardTaskFooterProps {
  assigneeEmail: string;
}

export default function BoardTaskFooter({
  assigneeEmail,
}: BoardTaskFooterProps) {
  return (
    <div className="flex mt-3">
      <div className="text-xs font-medium flex-1">assigned to:</div>
      <div className="text-xs">{assigneeEmail}</div>
    </div>
  );
}
