import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Topbar({ user, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <Home className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}