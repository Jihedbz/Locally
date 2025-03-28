import {  Home, Settings, FolderDot, Wrench } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    { title: "Home", url: "/", icon: Home,},
    { title: "Projects", url: "/projects",icon: FolderDot,},
    { title: "Tools", url: "/tools", icon: Wrench,},
    { title: "Settings", url: "/settings",icon: Settings,},
];
  
export function AppSidebar() {
  return (
    <SidebarProvider>
        <Sidebar>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar>
    </SidebarProvider>
  )
}
