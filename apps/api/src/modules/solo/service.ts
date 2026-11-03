import type { Prisma } from "@prisma/client";
import type {
  AcceptSoloRequestInput,
  CheckoutResponse,
  CreateSoloRequestInput,
  SoloPayInput,
  SoloRequest,
} from "@seoul/shared";
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
} from "../../lib/http-error";
import { toMemberPreview } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { endsAt, seoulInstant, seoulToday } from "../../lib/time";
import { createSoloCheckout } from "../payments/service";

export const soloInclude = {
  traveller: true,
  guide: { include: { user: true } },
  review: true,
} satisfies Prisma.SoloRequestInclude;

export type SoloRow = Prisma.SoloRequestGetPayload<{
  include: typeof soloInclude;
}>;

export const toSoloRequest = (row: SoloRow): SoloRequest => {
  const ended =
    endsAt(seoulInstant(row.date, row.startTime), row.durationMin) < new Date();
  const paid = row.status === "PAID" || row.status === "COMPLETED";
  return {
    id: row.id,
    date: row.date,
    startTime: row.startTime,
    durationMin: row.durationMin,
    note: row.note,
    amount: row.amount,
    // Same lazy approach as tours: a paid trip that has ended reads as completed without a cron job.
    status: row.status === "PAID" && ended ? "COMPLETED" : row.status,
    meetingName: row.meetingName,
    meetingLat: row.meetingLat,
    meetingLng: row.meetingLng,
    createdAt: row.createdAt.toISOString(),
    traveller: toMemberPreview(row.traveller),
    guide: toMemberPreview(row.guide.user),
    canReview: paid && ended && !row.review,
  };
};

export const createSoloRequest = async (
  travellerId: string,
  guideId: string,
  input: CreateSoloRequestInput,
) => {
  const guide = await prisma.guideProfile.findUnique({
    where: { userId: guideId },
  });
  if (!guide) throw notFound("Guide");
  const now = new Date();
  if (
    input.date < seoulToday(now) ||
    seoulInstant(input.date, input.startTime) <= now
  ) {
    throw badRequest("Pick a date and time in the future");
  }
  const row = await prisma.soloRequest.create({
    data: {
      travellerId,
      guideId,
      date: input.date,
      startTime: input.startTime,
      durationMin: guide.soloDurationMin,
      note: input.note,
      amount: guide.soloPrice,
    },
    include: soloInclude,
  });
  return toSoloRequest(row);
};

export const listMySoloRequests = async (
  userId: string,
  role: "TRAVELLER" | "GUIDE",
) => {
  const rows = await prisma.soloRequest.findMany({
    where: role === "GUIDE" ? { guideId: userId } : { travellerId: userId },
    include: soloInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSoloRequest);
};

const findForGuide = async (guideId: string, id: string) => {
  const row = await prisma.soloRequest.findUnique({ where: { id } });
  if (!row) throw notFound("Solo request");
  if (row.guideId !== guideId)
    throw forbidden("This request isn't addressed to you");
  if (row.status !== "PENDING")
    throw conflict(`This request is already ${row.status.toLowerCase()}`);
  return row;
};

const findForTraveller = async (travellerId: string, id: string) => {
  const row = await prisma.soloRequest.findUnique({
    where: { id },
    include: soloInclude,
  });
  if (!row) throw notFound("Solo request");
  if (row.travellerId !== travellerId)
    throw forbidden("This isn't your request");
  return row;
};

export const acceptSoloRequest = async (
  guideId: string,
  id: string,
  input: AcceptSoloRequestInput,
) => {
  await findForGuide(guideId, id);
  // Guarded update so two concurrent clicks can't both succeed.
  const { count } = await prisma.soloRequest.updateMany({
    where: { id, status: "PENDING" },
    data: {
      status: "ACCEPTED",
      meetingName: input.meetingName,
      meetingLat: input.meetingLat,
      meetingLng: input.meetingLng,
      ...(input.startTime ? { startTime: input.startTime } : {}),
    },
  });
  if (count === 0) throw conflict("This request was already handled");
  return toSoloRequest(
    await prisma.soloRequest.findUniqueOrThrow({
      where: { id },
      include: soloInclude,
    }),
  );
};

export const declineSoloRequest = async (guideId: string, id: string) => {
  await findForGuide(guideId, id);
  const { count } = await prisma.soloRequest.updateMany({
    where: { id, status: "PENDING" },
    data: { status: "DECLINED" },
  });
  if (count === 0) throw conflict("This request was already handled");
  return toSoloRequest(
    await prisma.soloRequest.findUniqueOrThrow({
      where: { id },
      include: soloInclude,
    }),
  );
};

export const cancelSoloRequest = async (travellerId: string, id: string) => {
  const row = await findForTraveller(travellerId, id);
  if (row.status !== "PENDING" && row.status !== "ACCEPTED")
    throw conflict(`This request is already ${row.status.toLowerCase()}`);
  const { count } = await prisma.soloRequest.updateMany({
    where: { id, status: { in: ["PENDING", "ACCEPTED"] } },
    data: { status: "CANCELLED" },
  });
  if (count === 0) throw conflict("This request was already handled");
  return toSoloRequest(
    await prisma.soloRequest.findUniqueOrThrow({
      where: { id },
      include: soloInclude,
    }),
  );
};

export const paySoloRequest = async (
  travellerId: string,
  id: string,
  { locale, returnTo }: SoloPayInput,
): Promise<CheckoutResponse> => {
  const row = await findForTraveller(travellerId, id);
  if (row.status !== "ACCEPTED")
    throw conflict("The guide has to accept this request before you can pay");
  return createSoloCheckout(row, row.guide.user.name, locale, returnTo);
};
