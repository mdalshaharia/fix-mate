"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, CloudUpload, LayoutDashboard, LogOut, ChevronDown, Wrench, Phone, MapPin, Drill } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/layout/SocialIcons";
import { authClient, useSession } from "@/lib/auth-client";

// Edit the strip content here
const CALL = { label: "Call us today:", phone: "+880 1605763746" };
const ADDRESS = "Chattogram, Bangladesh";
const SOCIAL_LINKS = [
    { label: "X", href: "https://x.com/", icon: XIcon },
    { label: "Facebook", href: "https://facebook.com/", icon: FacebookIcon },
    { label: "Instagram", href: "https://instagram.com/", icon: InstagramIcon },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: LinkedinIcon },
];

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

// `onDark` = logo shown on the dark navbar (white text); otherwise on a light surface
function Logo({
    onClick
}) {
    return <Link href="/" onClick={onClick} className="group flex items-center " aria-label="FixMate home">
        <span className='grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105'>
            {/* <Wrench className="h-5 w-5" /> */}
            <Drill className="h-6 w-6 text-brand-primary"></Drill>
        </span>
        <span className='font-pacifico text-2xl font-normal tracking-wider text-brand-primary'>
            FixmatE
        </span>
    </Link>;
}

// Slim strip above the main bar: address on the left, social + call badge on the right
function TopStrip() {
    return <div className="hidden border-b border-brand-primary/10 text-brand-primary sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <p className="hidden items-center gap-1.5 text-[11px] text-brand-primary/70 lg:flex">
                <MapPin className="h-3.5 w-3.5" />
                {ADDRESS}
            </p>

            <div className="ml-auto flex items-stretch">
                <ul className="flex items-center">
                    {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => <li key={label}>
                        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`FixMate on ${label}`} className="flex h-10 w-10 items-center justify-center text-brand-primary/60 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary">
                            <Icon className="h-3.5 w-3.5" />
                        </a>
                    </li>)}
                </ul>
                <a href={`tel:${CALL.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-brand-secondary-light px-4 text-[11px] font-bold uppercase tracking-wider text-brand-secondary-foreground transition-colors hover:bg-brand-secondary-light">
                    <Phone className="h-3.5 w-3.5" />
                    {CALL.label} {CALL.phone}
                </a>
            </div>
        </div>
    </div>;
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
        href: "/dashboard/profile", // leading slash added: it was a relative link before
        icon: CloudUpload
    }
    ];

    return <>
        <div className="bg-white/70 backdrop-blur-xl">
            <TopStrip />
        </div>

        <header className="sticky top-0 z-50 border-b border-brand-primary/10 bg-white/70 backdrop-blur-xl shadow-[0_1px_3px_0_rgba(21,65,90,0.06)] dark:border-border dark:bg-background/80">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Left: menu button (mobile) + logo */}
                <div className="flex items-center gap-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger render={<button className="btn btn-ghost btn-square text-brand-primary hover:bg-brand-primary/10 dark:text-foreground dark:hover:bg-white/5 lg:hidden" aria-label="Open menu" />}>
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
                                        <SheetClose nativeButton={false} render={<Link href={href} aria-current={active ? "page" : undefined} className={`rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${active ? "bg-brand-secondary/10 font-bold text-brand-secondary" : "text-brand-primary/70 hover:bg-brand-primary/5 hover:text-brand-primary"}`} />}>
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
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {user.name}{" "}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    ({user.role})
                                                </span>
                                            </p>
                                            <span>{user?.role}</span>
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

                    <Logo />
                </div>

                {/* Right: links + account */}
                <div className="flex items-center gap-2 lg:gap-6">
                    <ul className="hidden items-center lg:flex">
                        {NAV_LINKS.map(({
                            label,
                            href
                        }) => {
                            const active = isActive(pathname, href);
                            return <li key={href}>
                                <Link href={href} aria-current={active ? "page" : undefined} className={`relative flex h-20 items-center px-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${active ? "text-brand-primary dark:text-foreground" : "text-brand-primary/70 hover:text-brand-primary dark:text-white/70 dark:hover:text-white"}`}>
                                    {label}
                                    <span className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand-secondary transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`} />
                                </Link>
                            </li>;
                        })}
                    </ul>

                    {isPending ? <div className="h-9 w-9 animate-pulse rounded-full bg-brand-primary/10" aria-hidden /> : user ? <DropdownMenu>
                        <DropdownMenuTrigger render={<button className="flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white p-1 pr-2.5 outline-none transition hover:bg-brand-primary-lighter focus-visible:ring-2 focus-visible:ring-brand-primary/30 dark:border-white/15 dark:bg-card dark:ring-white/25 dark:hover:bg-white/5" aria-label="Open user menu" />}>
                            <UserAvatar user={user} />
                            <span className="hidden max-w-[120px] truncate text-sm font-semibold text-brand-primary dark:text-foreground md:block">
                                {user.name}
                            </span>
                            <ChevronDown className="hidden h-4 w-4 text-brand-primary/60 dark:text-white/60 md:block" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-60 rounded-2xl border border-brand-primary/10 bg-popover p-1.5 text-foreground shadow-xl dark:border-border">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="truncate px-3 py-2 text-foreground">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {user.name}{" "}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            ({user.role})
                                        </span>
                                    </p>
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
                        <Link href="/sign-in" className="hidden px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary/80 transition hover:text-brand-primary dark:text-white/80 dark:hover:text-white sm:inline-flex">
                            Login
                        </Link>
                        <Link href="/sign-up" className="btn hidden rounded-full border-none bg-brand-secondary px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-secondary-foreground shadow-sm shadow-black/20 transition-all hover:bg-brand-secondary-light sm:inline-flex">
                            Register
                        </Link>
                        <Link href="/sign-in" className="btn btn-sm rounded-full border-none bg-brand-secondary text-xs font-semibold text-brand-secondary-foreground hover:bg-brand-secondary-light sm:hidden">
                            Login
                        </Link>
                    </>}
                </div>
            </nav>
        </header>
    </>;
}

function UserAvatar({
    user
}) {
    return <Avatar className="h-9 w-9 border border-brand-primary/15 ring-2 ring-brand-secondary/40 shadow-2xs dark:border-white/15">
        <AvatarImage src={user.image || undefined} />
        <AvatarFallback className="bg-brand-primary/10 font-bold text-brand-primary">
            {initials(user.name)}
        </AvatarFallback>
    </Avatar>;
}

export default function Navbar() {
    return <Suspense fallback={<header className="sticky top-0 z-50 border-b border-brand-primary/10 bg-white/70 backdrop-blur-xl shadow-[0_1px_3px_0_rgba(21,65,90,0.06)] dark:border-border dark:bg-background/80">
        <div className="mx-auto h-20 max-w-7xl px-4 sm:px-6 lg:px-8" />
    </header>}>
        <NavbarInner />
    </Suspense>;
}