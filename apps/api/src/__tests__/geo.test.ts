import { describe, expect, it } from "vitest";
import { addMinutes, estimateLeg, haversineKm, orderStops } from "../lib/geo";

const gyeongbokgung = { name: "Gyeongbokgung", lat: 37.5796, lng: 126.977 };
const bukchon = { name: "Bukchon", lat: 37.5826, lng: 126.983 };
const insadong = { name: "Insadong", lat: 37.574, lng: 126.985 };
const nTower = { name: "N Seoul Tower", lat: 37.5512, lng: 126.9882 };
const myeongdong = { name: "Myeongdong", lat: 37.5636, lng: 126.9822 };

describe("orderStops", () => {
  const shuffled = [nTower, gyeongbokgung, myeongdong, bukchon, insadong];

  it("keeps every stop exactly once", () => {
    const ordered = orderStops(shuffled);
    expect(ordered).toHaveLength(5);
    expect(new Set(ordered.map((s) => s.name)).size).toBe(5);
  });

  it("groups the northern old-town stops and visits the tower at one end", () => {
    const names = orderStops(shuffled).map((s) => s.name);
    const towerIndex = names.indexOf("N Seoul Tower");
    expect([0, 4]).toContain(towerIndex);
    const northern = new Set(["Gyeongbokgung", "Bukchon", "Insadong"]);
    const run = names.filter((n) => northern.has(n));
    expect(run).toHaveLength(3);
    const positions = names
      .map((n, i) => (northern.has(n) ? i : -1))
      .filter((i) => i >= 0);
    expect(positions[2]! - positions[0]!).toBe(2);
  });

  it("is never longer than the naive input order", () => {
    const total = (route: typeof shuffled) =>
      route
        .slice(1)
        .reduce((sum, stop, i) => sum + haversineKm(route[i]!, stop), 0);
    expect(total(orderStops(shuffled))).toBeLessThanOrEqual(total(shuffled));
  });

  it("starts at the stop closest to the start point", () => {
    const start = { lat: 37.5512, lng: 126.9882 };
    expect(orderStops(shuffled, start)[0]?.name).toBe("N Seoul Tower");
  });

  it("handles zero and one stop", () => {
    expect(orderStops([])).toEqual([]);
    expect(orderStops([insadong])).toEqual([insadong]);
  });
});

describe("estimateLeg", () => {
  it("walks short hops", () => {
    const leg = estimateLeg(gyeongbokgung, bukchon);
    expect(leg.mode).toBe("WALK");
    expect(leg.travelMin).toBeGreaterThan(0);
  });

  it("takes the subway for longer hops", () => {
    const leg = estimateLeg(gyeongbokgung, nTower);
    expect(leg.mode).toBe("SUBWAY");
    expect(leg.distanceKm).toBeGreaterThan(1.2);
  });
});

describe("addMinutes", () => {
  it("adds across the hour", () => {
    expect(addMinutes("09:45", 30)).toBe("10:15");
  });

  it("wraps past midnight", () => {
    expect(addMinutes("23:30", 60)).toBe("00:30");
  });
});
