import { useTranslations } from "next-intl";
import type { Booking, SoloRequest } from "@seoul/shared";
import { RateTripsCard, type TripToRate } from "./RateTripsCard";

type RateTripsProps = { bookings: Booking[]; solo: SoloRequest[] };

// Shown first on the dashboard because a rating is only possible after the trip, which is
// exactly when people stop opening the app. One tap on a star should be all it takes.
export const RateTrips = ({ bookings, solo }: RateTripsProps) => {
  const t = useTranslations("Dashboard");
  const trips: TripToRate[] = [
    ...bookings
      .filter((booking) => booking.canReview)
      .map((booking) => ({
        key: booking.id,
        title: booking.tour.title,
        date: booking.tour.startsAt,
        guide: booking.tour.guide,
        bookingId: booking.id,
      })),
    ...solo
      .filter((request) => request.canReview)
      .map((request) => ({
        key: request.id,
        title: t("soloTripWith", { name: request.guide.name }),
        date: request.date,
        guide: request.guide,
        soloRequestId: request.id,
      })),
  ];
  // Rendered even when empty so the card keeps its place in the tree; see RateTripsCard.
  return <RateTripsCard trips={trips} />;
};
