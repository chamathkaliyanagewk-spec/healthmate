// Returns today's date like "2026-10-30" using your local time
export const todayStr = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// Returns the date n days ago, like "2026-10-27"
export const daysAgoStr = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};