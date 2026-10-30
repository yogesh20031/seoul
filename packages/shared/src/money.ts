/** Platform keeps 15% of every booking; the rest is the guide's. */
export const PLATFORM_FEE_RATE = 0.15;

export const splitAmount = (gross: number) => {
  const platformFee = Math.round(gross * PLATFORM_FEE_RATE);
  return { gross, platformFee, net: gross - platformFee };
};
