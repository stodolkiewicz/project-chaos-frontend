import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setArchiveOpen, setBacklogOpen, setBoardOpen } from "@/app/state/uiSlice";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCheck, LayoutDashboard, ListPlus } from "lucide-react";

export default function ShowHideSections() {
  const dispatch = useAppDispatch();
  const isBoardOpen = useAppSelector((state) => state.ui.isBoardOpen);
  const isBacklogOpen = useAppSelector((state) => state.ui.isBacklogOpen);
  const isArchiveOpen = useAppSelector((state) => state.ui.isArchiveOpen);

  const value = [
    isBoardOpen && "board",
    isBacklogOpen && "backlog",
    isArchiveOpen && "archive",
  ].filter(v => Boolean(v)) as string[];

  function onValueChange(value: string[]) {
    dispatch(setBoardOpen(value.includes("board")));
    dispatch(setBacklogOpen(value.includes("backlog")));
    dispatch(setArchiveOpen(value.includes("archive")));
  }

  return (
    <ToggleGroup variant="default" type="multiple" 
        onValueChange={(value) => onValueChange(value)}
        value={value}
        >
      <ToggleGroupItem value="board" aria-label="Toggle board">
        <LayoutDashboard />
      </ToggleGroupItem>
      <ToggleGroupItem value="backlog" aria-label="Toggle backlog">
        <ListPlus />
      </ToggleGroupItem>
      <ToggleGroupItem value="archive" aria-label="Toggle archive">
        <CheckCheck />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}