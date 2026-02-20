function pad(n) {
  return String(n).padStart(2, "0");
}

export function toDateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function generateSlotsForDay(startHour = 10, endHour = 18, stepMin = 30) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

export function generateNextDaysSlots(days = 7) {
  const out = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out[toDateKey(d)] = generateSlotsForDay(10, 18, 30);
  }
  return out;
}