import { MapPin, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function TechnicianCard({ name, email, image, bio, area }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-4">
      <Avatar className="size-12">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {name?.charAt(0).toUpperCase() || "T"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-foreground">{name}</p>
          <Badge variant="outline" className="gap-1 border-primary/25 bg-primary/5 text-primary">
            <ShieldCheck className="size-3" />
            Verified
          </Badge>
        </div>

        <p className="truncate text-xs text-muted-foreground">{email}</p>

        {area && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {area}
          </p>
        )}

        {bio && <p className="pt-1 text-sm text-muted-foreground">{bio}</p>}
      </div>
    </div>
  );
}