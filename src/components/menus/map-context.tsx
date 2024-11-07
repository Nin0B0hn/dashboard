import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } from "@/components/ui/context-menu"
  import { CommentSection } from '@/components/comment'
  
  export function MapMenu() {
    return (
      <ContextMenu>
        <ContextMenuTrigger>Right click</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>
            <CommentSection />
          </ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }
  