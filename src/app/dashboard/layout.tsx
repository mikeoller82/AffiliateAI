
"use client"

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AIKeyProvider, useAIKey } from '@/contexts/ai-key-context';
import Link from 'next/link';
import Image from 'next/image';

import * as Icons from 'lucide-react';
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users,
  ChevronDown,
  LogOut,
  BrainCircuit,
  PanelLeft,
  Search
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ApiKeyDialog } from '@/components/ai/api-key-dialog';
import { Logo } from '@/components/icons/logo';


const navLinks = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/links", icon: Icons.Link, label: "Links" },
  { href: "/dashboard/funnels", icon: Icons.Filter, label: "Funnels" },
  { href: "/dashboard/websites", icon: Icons.Globe, label: "Websites" },
  { href: "/dashboard/courses", icon: Icons.BookOpen, label: "Courses" },
  { href: "/dashboard/crm", icon: Users, label: "CRM" },
  { href: "/dashboard/email", icon: Icons.Mail, label: "Email" },
  { href: "/dashboard/social-scheduler", icon: Icons.Calendar, label: "Social Scheduler" },
  { href: "/dashboard/automations", icon: Icons.Workflow, label: "Automations" },
  { href: "/dashboard/conversations", icon: Icons.MessageSquare, label: "Conversations" },
  { href: "/dashboard/notion-pad", icon: Icons.FileText, label: "Notion Pad" },
  { href: "/dashboard/docs", icon: Icons.Folder, label: "Docs" },
  { href: "/dashboard/forms", icon: Icons.ClipboardList, label: "Forms" },
  { href: "/dashboard/ai-tools", icon: BrainCircuit, label: "AI Tools" },
];

function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { promptApiKey, apiKey } = useAIKey();

  const handleSignOut = async () => {
    try {
      if(signOut) {
        await signOut();
      }
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };
  
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user.photoURL || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.uid}`}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={promptApiKey}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            { apiKey ? 'Update' : 'Set' } AI Key
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
    const { user, loading, authError, signOut } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return null;
    }
  
    return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link
                href="/dashboard"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Logo className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">HighLaunchPad</span>
              </Link>
               {navLinks.map((link) => (
                  <Tooltip key={link.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                  </Tooltip>
              ))}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                 <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                      <Link
                        href="/dashboard"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                      >
                       <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">HighLaunchPad</span>
                      </Link>
                      {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          >
                            <link.icon className="h-5 w-5" />
                            {link.label}
                          </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
                 <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
                <UserMenu />
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AIKeyProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </AIKeyProvider>
    )
}
