import { useTranslations } from "next-intl";
import type { TourMember } from "@seoul/shared";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

/** Public profiles of everyone with a paid seat: the "travel with strangers, but know who they are" part. */
export const MemberList = ({ members }: { members: TourMember[] }) => {
  const t = useTranslations("Tours");
  const tCommon = useTranslations("Common");

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {members.map((member) => (
        <li key={member.id} className="flex gap-3 glassy-md p-4">
          <Avatar name={member.name} src={member.avatarUrl} size={48} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold">
                {member.name}
              </span>
              {member.seats > 1 ? (
                <Badge tone="primary">
                  {tCommon("seats", { count: member.seats })}
                </Badge>
              ) : null}
            </div>
            <span className="text-xs text-muted-foreground">
              {[member.country, t("memberTrips", { count: member.tripsCount })]
                .filter(Boolean)
                .join(" · ")}
            </span>
            {member.bio ? (
              <p className="line-clamp-2 text-xs text-text-secondary">
                {member.bio}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};
