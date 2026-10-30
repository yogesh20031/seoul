import { useLocale } from "next-intl";
import type { Review } from "@seoul/shared";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Stars } from "@/components/ui/Stars";
import { formatDate } from "@/lib/format";

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  const locale = useLocale();
  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review) => (
        <li key={review.id}>
          <Card padding="sm" className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar
                name={review.author.name}
                src={review.author.avatarUrl}
                size={32}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {review.author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[review.author.country, formatDate(review.createdAt, locale)]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <Stars value={review.rating} />
            </div>
            {review.comment ? (
              <p className="text-sm text-text-secondary">{review.comment}</p>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
};
