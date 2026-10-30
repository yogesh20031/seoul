const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

export const seoulInstant = (date: string, time = "00:00") =>
  new Date(`${date}T${time}:00+09:00`);

export const seoulToday = (now = new Date()) =>
  new Date(now.getTime() + SEOUL_OFFSET_MS).toISOString().slice(0, 10);

export const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

export const addMinutesToDate = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * MINUTE_MS);

export const endsAt = (start: Date, durationMin: number) =>
  addMinutesToDate(start, durationMin);

export const HOUR_MS = 60 * MINUTE_MS;
