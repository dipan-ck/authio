'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';

const gettingStarted = [
   { title: 'Installation', href: '/docs/installation' },
   { title: 'Quick Start', href: '/docs/quick-start' },
   { title: 'Providers', href: '/docs/providers' },
];

const authentication = [
   { title: 'Email & Password', href: '/docs/authentication/email-password' },
   { title: 'Google', href: '/docs/authentication/google' },
   { title: 'GitHub', href: '/docs/authentication/github' },
];

export function DocsSidebar() {
   const pathname = usePathname();

   return (
      <Sidebar>
         <SidebarHeader className="border-b border-border px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
               <Image src="/logo.svg" alt="Swift Auth" width={124} height={124} />
            </Link>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {gettingStarted.map((item) => (
                        <SidebarMenuItem key={item.href}>
                           <SidebarMenuButton asChild isActive={pathname === item.href}>
                              <Link href={item.href}>{item.title}</Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
               <SidebarGroupLabel>Authentication</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {authentication.map((item) => (
                        <SidebarMenuItem key={item.href}>
                           <SidebarMenuButton asChild isActive={pathname === item.href}>
                              <Link href={item.href}>{item.title}</Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
