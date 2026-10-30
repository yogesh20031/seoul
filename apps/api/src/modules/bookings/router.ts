import { Router } from "express";
import { createBookingSchema, idSchema } from "@seoul/shared";
import { getAuth, requireAuth, requireRole } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { cancelBooking, createBooking, listMyBookings } from "./service";

export const bookingsRouter: Router = Router();

bookingsRouter.post(
  "/tours/:id/bookings",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    const checkout = await createBooking(
      getAuth(req).userId,
      parse(idSchema, req.params.id),
      parse(createBookingSchema, req.body),
    );
    res.status(201).json(checkout);
  },
);

bookingsRouter.get(
  "/me/bookings",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    res.json(await listMyBookings(getAuth(req).userId));
  },
);

bookingsRouter.post("/bookings/:id/cancel", requireAuth, async (req, res) => {
  res.json(
    await cancelBooking(getAuth(req).userId, parse(idSchema, req.params.id)),
  );
});
