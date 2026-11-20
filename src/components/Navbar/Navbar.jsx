"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, CloudUpload, LayoutDashboard, PlusSquare, Building2, CalendarCheck, LogOut, ChevronDown, Clapperboard } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient, useSession } from "@/lib/auth-client";

const NAV_LINKS = [{
    label: "Home",
    href: "/"
}, {
    label: "Services",
    href: "/services"
}, {
    label: "About",
    href: "/about"
}];

const isActive = (pathname, href) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "U";

function Logo({
    onClick
}) {
    return <Link href="/" onClick={onClick} className="group flex items-center gap-2.5" aria-label="FixMte home">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary transition-transform duration-200 group-hover:scale-105 dark:bg-brand-primary-lighter dark:text-brand-primary-foreground">
            <Clapperboard className="h-5 w-5" />
        </span>
        <span className="text-xl font-extrabold tracking-tight text-brand-primary dark:text-foreground">
            Fix<span className="text-brand-secondary">Mte</span>
        </span>
    </Link>;
}

function NavbarInner() {
    const {
        data: session,
        isPending
    } = useSession();
    const user = session?.user ?? null;
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const handleLogout = async () => {
        await authClient.signOut();
        setOpen(false);
        router.push("/");
        router.refresh();
    };

    const USER_MENU = [{
        label: "Dashboard",
        href: `/dashboard/${session?.user?.role}`,
        icon: LayoutDashboard
    }, {
        label: "Update Profile",
        href: "dashboard/profile",
        icon: CloudUpload
    }
    ];

    return <header className="sticky top-0 z-50 border-b border-brand-primary/10 bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_0_rgba(21,65,90,0.06)] transition-colors duration-300 dark:bg-background/90 dark:border-border">
        <nav className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
            { }
            <div className="navbar-start gap-1">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger render={<button className="btn btn-ghost btn-square text-brand-primary hover:bg-brand-primary/10 hover:text-brand-primary-light dark:text-foreground dark:hover:bg-white/5 lg:hidden" aria-label="Open menu" />}>
                        <Menu className="h-6 w-6" />
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[85%] max-w-xs border-r border-brand-primary/10 bg-white p-0 text-foreground shadow-2xl dark:border-border dark:bg-background">
                        <SheetHeader className="border-b border-brand-primary/10 p-4 text-left dark:border-border">
                            <SheetTitle render={<div />}>
                                <Logo onClick={() => setOpen(false)} />
                            </SheetTitle>
                        </SheetHeader>

                        <ul className="menu w-full gap-1 p-3 text-foreground">
                            {NAV_LINKS.map(({
                                label,
                                href
                            }) => {
                                const active = isActive(pathname, href);
                                return <li key={href}>
                                    <SheetClose nativeButton={false} render={<Link href={href} aria-current={active ? "page" : undefined} className={`rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${active ? "bg-brand-secondary/10 font-bold text-brand-secondary" : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary dark:text-white/70 dark:hover:bg-white/5"}`} />}>
                                        {label}
                                    </SheetClose>
                                </li>;
                            })}
                        </ul>

                        <div className="mt-auto border-t border-brand-primary/10 bg-brand-primary-lighter/30 p-4 dark:border-border dark:bg-muted/40">
                            {user ? <div className="space-y-1">
                                <div className="mb-3 flex items-center gap-3 px-1">
                                    <UserAvatar user={user} />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                                        {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                                    </div>
                                </div>
                                {USER_MENU.map(({
                                    label,
                                    href,
                                    icon: Icon
                                }) => <SheetClose key={href} nativeButton={false} render={<Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive(pathname, href) ? "bg-brand-secondary/10 font-semibold text-brand-secondary" : "text-brand-primary/80 hover:bg-brand-primary/5 hover:text-brand-primary dark:text-white/80 dark:hover:bg-white/5"}`} />}>
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </SheetClose>)}
                                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div> : <div className="grid gap-2">
                                <SheetClose nativeButton={false} render={<Link href="/sign-in" className="btn btn-outline rounded-xl border-brand-primary/30 font-semibold text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 dark:border-white/20 dark:bg-transparent dark:text-foreground dark:hover:border-white/40 dark:hover:bg-white/5" />}>
                                    Login
                                </SheetClose>
                                <SheetClose nativeButton={false} render={<Link href="/sign-up" className="btn rounded-xl border-none bg-brand-secondary font-semibold text-brand-secondary-foreground shadow-sm shadow-brand-secondary/25 hover:bg-brand-secondary-light" />}>
                                    Register
                                </SheetClose>
                            </div>}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="hidden sm:block lg:ml-0">
                    <Logo />
                </div>
            </div>

            { }
            <div className="navbar-center">
                <div className="sm:hidden">
                    <Logo />
                </div>
                <ul className="hidden items-center gap-1 lg:flex">
                    {NAV_LINKS.map(({
                        label,
                        href
                    }) => {
                        const active = isActive(pathname, href);
                        return <li key={href}>
                            <Link href={href} aria-current={active ? "page" : undefined} className={`relative rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${active ? "font-bold text-brand-secondary" : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary dark:text-white/70 dark:hover:bg-white/5"}`}>
                                {label}
                                { }
                                <span className={`absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-brand-secondary transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`} />
                            </Link>
                        </li>;
                    })}
                </ul>
            </div>

            { }
            <div className="navbar-end gap-2">
                {/* <ThemeToggle /> */}
                {isPending ? <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-hidden /> : user ? <DropdownMenu>
                    <DropdownMenuTrigger render={<button className="flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white p-1 pr-2.5 shadow-2xs outline-none ring-brand-primary/30 transition hover:bg-brand-primary-lighter focus-visible:ring-2 dark:border-white/15 dark:bg-card dark:ring-white/25 dark:hover:bg-white/5" aria-label="Open user menu" />}>
                        <UserAvatar user={user} />
                        <span className="hidden max-w-[120px] truncate text-sm font-semibold text-brand-primary dark:text-foreground md:block">
                            {user.name}
                        </span>
                        <ChevronDown className="hidden h-4 w-4 text-brand-primary/50 dark:text-muted-foreground md:block" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-60 rounded-2xl border border-brand-primary/10 bg-popover p-1.5 text-foreground shadow-xl dark:border-border">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="truncate px-3 py-2 text-foreground">
                                <span className="font-semibold text-foreground">{user.name}</span>
                                {user.email && <span className="block truncate text-xs font-normal text-muted-foreground">
                                    {user.email}
                                </span>}
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="my-1 bg-brand-primary/10 dark:bg-border" />
                        {USER_MENU.map(({
                            label,
                            href,
                            icon: Icon
                        }) => <DropdownMenuItem key={href} render={<Link href={href} className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-colors ${isActive(pathname, href) ? "bg-brand-secondary/10 font-semibold text-brand-secondary" : "text-brand-primary/80 hover:bg-brand-primary/5 hover:text-brand-primary focus:bg-brand-primary/5 focus:text-brand-primary dark:text-white/80 dark:hover:bg-white/5 dark:focus:bg-white/5"}`} />}>
                                <Icon className="mr-2.5 h-4 w-4" />
                                {label}
                            </DropdownMenuItem>)}
                        <DropdownMenuSeparator className="my-1 bg-brand-primary/10 dark:bg-border" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:focus:text-red-400">
                            <LogOut className="mr-2.5 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> : <>
                    <Link href="/sign-in" className="btn btn-ghost hidden rounded-xl px-4 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 hover:text-brand-primary-light sm:inline-flex transition dark:text-foreground dark:hover:bg-white/5">
                        Login
                    </Link>
                    <Link href="/sign-up" className="btn hidden rounded-full border-none bg-brand-secondary px-5 text-sm font-semibold text-brand-secondary-foreground shadow-sm shadow-brand-secondary/25 hover:bg-brand-secondary-light hover:shadow-md hover:shadow-brand-secondary/35 sm:inline-flex transition-all">
                        Register
                    </Link>
                    { }
                    <Link href="/sign-in" className="btn btn-sm rounded-full border-none bg-brand-secondary text-xs font-semibold text-brand-secondary-foreground shadow-2xs hover:bg-brand-secondary-light sm:hidden">
                        Login
                    </Link>
                </>}
            </div>
        </nav>
    </header>;
}

function UserAvatar({
    user
}) {
    return <Avatar className="h-9 w-9 border border-brand-primary/15 ring-2 ring-brand-secondary/30 shadow-2xs dark:border-white/15">
        <AvatarImage src={user.image || undefined} />
        <AvatarFallback className="bg-brand-primary/10 font-bold text-brand-primary">
            {initials(user.name)}
        </AvatarFallback>
    </Avatar>;
}

export default function Navbar() {
    return <Suspense fallback={<header className="sticky top-0 z-50 border-b border-brand-primary/10 bg-white/80 shadow-xs dark:bg-background">
        <div className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8" />
    </header>}>
        <NavbarInner />
    </Suspense>;
}
