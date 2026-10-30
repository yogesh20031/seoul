import type { SoloRequest } from "./solo";
import type { TourDetail } from "./tour";

export type Earning = {
  id: string;
  gross: number;
  platformFee: number;
  net: number;
  status: "PENDING" | "AVAILABLE" | "PAID_OUT";
  createdAt: string;
  label: string;
};

export type GuideOverview = {
  upcomingTours: TourDetail[];
  pendingRequests: SoloRequest[];
  upcomingSolo: SoloRequest[];
  earnings: {
    totalNet: number;
    pendingNet: number;
    recent: Earning[];
  };
  stats: {
    ratingAvg: number;
    ratingCount: number;
    toursLed: number;
    travellersHosted: number;
  };
};
