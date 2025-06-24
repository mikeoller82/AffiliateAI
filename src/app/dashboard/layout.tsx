
'use client';

import type React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, redirect } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { app } from '@/lib/firebase';
import { getAuth, signOut } from 'firebase/auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
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
  Users,
  Settings,
  HelpCircle,
  Search,
  Bell,
  BrainCircuit,
  FileText,
  Workflow,
  ClipboardList,
  Globe,
  Newspaper,
  Mails,
  BookText,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/links', icon: LinkIcon, label: 'Affiliate Links' },
    { href: '/dashboard/funnels', icon: Filter, label: 'Funnels' },
    { href: '/dashboard/websites', icon: Globe, label: 'Websites' },
    { href: '/dashboard/blog', icon: Newspaper, label: 'Blog' },
    { href: '/dashboard/newsletter', icon: Mails, label: 'Newsletters' },
    { href: '/dashboard/docs', icon: BookText, label: 'Docs' },
    { href: '/dashboard/forms', icon: ClipboardList, label: 'Forms' },
    { href: '/dashboard/crm', icon: Users, label: 'CRM' },
    { href: '/dashboard/email', icon: Mail, label: 'Email Marketing' },
    { href: '/dashboard/automations', icon: Workflow, label: 'Automations' },
    { href: '/dashboard/ai-tools', icon: BrainCircuit, label: 'AI Tools' },
];

function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    const getPageTitle = () => {
        if (pathname.startsWith('/dashboard/settings')) return 'Settings';
        for (const item of navItems) {
             if (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) {
                return item.label;
            }
        }
        return 'Dashboard';
    };
    
    const pageTitle = getPageTitle();
    
    const isBuilderPage = /^\/dashboard\/(funnels|websites|automations|forms|blog|newsletter|docs)\/(\w|\d)/.test(pathname);

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
            <main className={cn("flex-1 overflow-y-auto", !isBuilderPage && "p-6")}>{children}</main>
        </div>
    );
}

function AppSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSignOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            toast({
                title: "Signed Out",
                description: "You have been successfully signed out.",
            });
            // The AuthProvider will handle the redirect
        } catch (error) {
            console.error("Error signing out:", error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Failed to sign out. Please try again.",
            });
        }
    };
    
    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    }
    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="p-1 bg-transparent rounded-lg">
                        <Image
                            src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                            alt="HighLaunchPad Logo"
                            width={32}
                            height={32}
                            className="rounded-md"
                        />
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">HighLaunchPad</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{children: item.label}}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto border-t p-4 space-y-4">
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
                        <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')} tooltip={{children: 'Settings'}}>
                            <Link href="/dashboard/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="p-2 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} data-ai-hint="profile picture"/>
                            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <p className="font-semibold text-sm truncate">{user?.displayName || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} className="group-data-[collapsible=icon]:hidden">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    
    useEffect(() => {
        if (!loading && !user) {
            redirect('/login');
        }
    }, [user, loading, pathname]);

    if (loading) {
         return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null;
    }
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <MainContent>{children}</MainContent>
            </SidebarInset>
        </SidebarProvider>
    );
}
