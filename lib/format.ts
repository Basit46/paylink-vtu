export function naira(value: number, opts: { sign?: boolean } = {}) {
  const abs = Math.abs(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = opts.sign ? (value < 0 ? "-" : "+") : value < 0 ? "-" : "";
  return `${prefix}\u20A6${abs}`;
}

export function nairaShort(value: number) {
  return `\u20A6${Math.abs(value).toLocaleString("en-NG")}`;
}

export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

export function formatMeter(digits: string) {
  return digits
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(.{5})(.{4})(.*)/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))
    .trim();
}

export function formatToken(token: string) {
  return token.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function clockTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", { hour12: false });
}
