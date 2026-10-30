import type { Paginated } from "@seoul/shared";

type PageInput = { page: number; pageSize: number };

export const pageArgs = ({ page, pageSize }: PageInput) => ({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

export const toPaginated = <T>(
  items: T[],
  total: number,
  { page, pageSize }: PageInput,
): Paginated<T> => ({
  items,
  total,
  page,
  pageSize,
});
