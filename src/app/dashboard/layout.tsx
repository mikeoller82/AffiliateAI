
"use client";

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  Link as LinkIcon,
  Filter,
  Mail,
  Rocket,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Users,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/links', icon: LinkIcon, label: 'Affiliate Links' },
    { href: '/dashboard/funnels', icon: Filter, label: 'Funnels' },
    { href: '/dashboard/crm', icon: Users, label: 'CRM' },
    { href: '/dashboard/email', icon: Mail, label: 'Email Marketing' },
    { href: '/dashboard/ai-tools', icon: BrainCircuit, label: 'AI Tools' },
];

function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const pageTitle = navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard';
    
    // Check if the current page is a funnel editor page
    const isFunnelEditor = /^\/dashboard\/funnels\/./.test(pathname);


    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b bg-card px-6">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="w-full bg-background pl-9 md:w-64" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </div>
            </header>
            <main className={cn("flex-1 overflow-y-auto", !isFunnelEditor && "p-6")}>{children}</main>
        </div>
    );
}

function AppSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">HighLaunchPad</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)} tooltip={{children: item.label}}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarContent className="mt-auto p-4 space-y-4 border-t">
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: 'Support'}}>
                            <Link href="#">
                                <HelpCircle />
                                <span>Support</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: 'Settings'}}>
                            <Link href="#">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="p-2 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://placehold.co/40x40" data-ai-hint="profile picture"/>
                            <AvatarFallback>DU</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <p className="font-semibold text-sm truncate">Demo User</p>
                            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                        </div>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <MainContent>{children}</MainContent>
            </SidebarInset>
        </SidebarProvider>
    );
}
