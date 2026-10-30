import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { api, resetDb, seedPlaces } from "./helpers";

beforeAll(resetDb);

describe("place detail", () => {
  it("returns visitor highlights and tips, defaulting to empty lists", async () => {
    const [palace] = await seedPlaces();
    const bare = await api().get(`/api/v1/places/${palace!.slug}`);
    expect(bare.status).toBe(200);
    expect(bare.body.highlightsEn).toEqual([]);
    expect(bare.body.tipsKo).toEqual([]);
    expect(bare.body.admissionEn).toBeNull();

    await prisma.place.update({
      where: { id: palace!.id },
      data: {
        highlightsEn: ["Throne hall"],
        highlightsKo: ["근정전"],
        tipsEn: ["Closed Tuesdays"],
        tipsKo: ["화요일 휴궁"],
        admissionEn: "₩3,000",
      },
    });
    const filled = await api().get(`/api/v1/places/${palace!.slug}`);
    expect(filled.body.highlightsEn).toEqual(["Throne hall"]);
    expect(filled.body.tipsKo).toEqual(["화요일 휴궁"]);
    expect(filled.body.admissionEn).toBe("₩3,000");
  });
});
