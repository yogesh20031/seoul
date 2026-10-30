import type { MemberPreview } from "@seoul/shared";
import { Avatar } from "./Avatar";

type AvatarStackProps = {
  members: MemberPreview[];
  total: number;
  size?: number;
};

export const AvatarStack = ({
  members,
  total,
  size = 28,
}: AvatarStackProps) => {
  const extra = total - members.length;
  return (
    <div className="flex items-center -space-x-2">
      {members.map((member) => (
        <Avatar
          key={member.id}
          name={member.name}
          src={member.avatarUrl}
          size={size}
        />
      ))}
      {extra > 0 ? (
        <span className="z-10 inline-flex size-7 items-center justify-center rounded-full bg-muted text-3xs font-semibold text-muted-foreground ring-2 ring-background">
          +{extra}
        </span>
      ) : null}
    </div>
  );
};
