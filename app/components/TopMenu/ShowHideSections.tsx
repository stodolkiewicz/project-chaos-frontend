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
    <div className="border border-white/30 shadow-md rounded-lg backdrop-blur-sm">
      <ToggleGroup variant="default" type="multiple" 
          onValueChange={(value) => onValueChange(value)}
          value={value}
          className=""
          >
      <ToggleGroupItem 
        value="backlog" 
        aria-label="Toggle backlog"
        title={`${isBacklogOpen ? 'Hide' : 'Show'} Backlog`}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer data-[state=on]:bg-white data-[state=on]:text-black !rounded-l-lg !rounded-r-none"
      >
        <ListPlus className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="board" 
        aria-label="Toggle board"
        title={`${isBoardOpen ? 'Hide' : 'Show'} Board`}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer data-[state=on]:bg-white data-[state=on]:text-black !rounded-none"
      >
        <LayoutDashboard className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="archive" 
        aria-label="Toggle archive"
        title={`${isArchiveOpen ? 'Hide' : 'Show'} Archive`}
        className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer data-[state=on]:bg-white data-[state=on]:text-black !rounded-l-none !rounded-r-lg"
      >
        <CheckCheck className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
    </div>
  )
}