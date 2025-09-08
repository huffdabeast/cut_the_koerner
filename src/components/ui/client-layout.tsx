"use client";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { LayoutDashboard, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientLayout() {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-16 right-0 z-40">
      <Dock>
        <DockItem onClick={() => router.push("/tech-directory")}>
          <DockLabel>Blueprints</DockLabel>
          <DockIcon>
            <LayoutDashboard className="text-black dark:text-white" />
          </DockIcon>
        </DockItem>
        <DockItem>
          <DockLabel>Reach Out</DockLabel>
          <DockIcon>
            <Send className="text-black dark:text-white" />
          </DockIcon>
        </DockItem>
        <DockItem>
          <DockLabel>Log-in</DockLabel>
          <DockIcon>
            <User className="text-black dark:text-white" />
          </DockIcon>
        </DockItem>
      </Dock>
    </div>
  );
}
