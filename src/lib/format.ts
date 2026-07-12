const dateFmt = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const timeFmt = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export function formatEventDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatEventTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return "Free";
  return `₹${price.toLocaleString("en-IN")}`;
}
