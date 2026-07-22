const todayKey = "2026-07-17";
const taskInputs = document.querySelectorAll("[data-task]");
const progressInputs = document.querySelectorAll(".progress-input");
const countInputs = document.querySelectorAll("[data-count]");
const noteAreas = document.querySelectorAll("[data-note]");
const resetButton = document.querySelector("#resetTasks");

function getStore(key, fallback) {
  const value = localStorage.getItem(key);
  return value === null ? fallback : value;
}

function setRing(input) {
  const metric = input.closest(".metric");
  const ring = metric.querySelector(".ring");
  const value = Number(input.value);
  const degrees = value * 3.6;
  const color = ring.classList.contains("green")
    ? "var(--green)"
    : ring.classList.contains("amber")
      ? "var(--amber)"
      : "var(--blue)";
  ring.style.background = `conic-gradient(${color} 0deg, ${color} ${degrees}deg, #e8eef3 ${degrees}deg)`;
  ring.querySelector("span").textContent = `${value}%`;
}

taskInputs.forEach((input) => {
  const key = `jz-task-${todayKey}-${input.dataset.task}`;
  input.checked = getStore(key, "false") === "true";
  input.addEventListener("change", () => {
    localStorage.setItem(key, String(input.checked));
  });
});

progressInputs.forEach((input) => {
  const key = `jz-progress-${todayKey}-${input.dataset.key}`;
  input.value = getStore(key, input.value);
  setRing(input);
  input.addEventListener("input", () => {
    localStorage.setItem(key, input.value);
    setRing(input);
  });
});

countInputs.forEach((input) => {
  const output = document.querySelector(`[data-count-output="${input.dataset.count}"]`);
  const key = `jz-count-${todayKey}-${input.dataset.count}`;
  input.value = getStore(key, input.value);
  if (output) output.textContent = input.value;
  input.addEventListener("input", () => {
    const max = Number(input.max || 100);
    const nextValue = Math.max(0, Math.min(max, Number(input.value || 0)));
    input.value = String(nextValue);
    localStorage.setItem(key, input.value);
    if (output) output.textContent = input.value;
  });
});

noteAreas.forEach((area) => {
  const key = `jz-note-${todayKey}-${area.dataset.note}`;
  area.value = getStore(key, "");
  area.addEventListener("input", () => {
    localStorage.setItem(key, area.value);
  });
});

resetButton.addEventListener("click", () => {
  taskInputs.forEach((input) => {
    input.checked = false;
    localStorage.setItem(`jz-task-${todayKey}-${input.dataset.task}`, "false");
  });
});
