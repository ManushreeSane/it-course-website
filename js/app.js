const $ = (id) => document.getElementById(id);
const rupee = (n) => "₹" + n.toLocaleString("en-IN");

const CAT_COLORS = {
  "Cloud": "from-sky-500 to-indigo-600",
  "Web Development": "from-fuchsia-500 to-pink-600",
  "Programming": "from-amber-400 to-orange-600",
  "Data & AI": "from-emerald-500 to-teal-600",
  "Security": "from-rose-500 to-red-700",
};
const LEVEL_COLORS = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const categories = ["All", ...new Set(COURSES.map((c) => c.category))];
let activeCat = "All";

const discount = (c) => Math.round((1 - c.price / c.mrp) * 100);

function getFiltered() {
  const q = $("search").value.toLowerCase().trim();
  const level = $("level").value;
  const sort = $("sort").value;

  let list = COURSES.filter((c) =>
    (activeCat === "All" || c.category === activeCat) &&
    (level === "All" || c.level === level) &&
    `${c.title} ${c.desc} ${c.category}`.toLowerCase().includes(q)
  );

  if (sort === "low") list.sort((a, b) => a.price - b.price);
  else if (sort === "high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.rating - a.rating);
  return list;
}

function cardHTML(c) {
  return `
  <article class="course-card flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white" onclick="openModal(${c.id})">
    <div class="flex h-28 items-center justify-center bg-gradient-to-br ${CAT_COLORS[c.category]} text-5xl">${c.icon}</div>
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-center justify-between text-xs">
        <span class="rounded-full px-2.5 py-1 font-semibold ${LEVEL_COLORS[c.level]}">${c.level}</span>
        <span class="font-semibold text-amber-500">★ ${c.rating}</span>
      </div>
      <h3 class="mt-3 text-lg font-bold leading-snug">${c.title}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-slate-600">${c.desc}</p>
      <p class="mt-3 text-xs text-slate-500">${c.duration} · ${c.lessons} lessons</p>
      <div class="mt-auto flex items-end justify-between pt-4">
        <div>
          <span class="text-xl font-extrabold text-indigo-600">${rupee(c.price)}</span>
          <span class="ml-1 text-sm text-slate-400 line-through">${rupee(c.mrp)}</span>
        </div>
        <span class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">${discount(c)}% off</span>
      </div>
      <button class="mt-4 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">View details</button>
    </div>
  </article>`;
}

function render() {
  const list = getFiltered();
  $("grid").innerHTML = list.map(cardHTML).join("");
  $("empty").classList.toggle("hidden", list.length > 0);
  $("count").textContent = `Showing ${list.length} of ${COURSES.length} courses`;
}

function renderChips() {
  $("chips").innerHTML = categories
    .map((c) => `<button class="chip ${c === activeCat ? "on" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
  document.querySelectorAll(".chip").forEach((b) =>
    b.addEventListener("click", () => {
      activeCat = b.dataset.cat;
      renderChips();
      render();
    })
  );
}

function openModal(id) {
  const c = COURSES.find((x) => x.id === id);
  $("modalBody").innerHTML = `
    <div class="relative flex h-32 items-center justify-center bg-gradient-to-br ${CAT_COLORS[c.category]} text-6xl">
      ${c.icon}
      <button onclick="closeModal()" class="absolute right-4 top-4 rounded-full bg-white/25 px-3 py-1 text-white hover:bg-white/40" aria-label="Close">✕</button>
    </div>
    <div class="p-6">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="rounded-full bg-indigo-100 px-2.5 py-1 font-semibold text-indigo-700">${c.category}</span>
        <span class="rounded-full px-2.5 py-1 font-semibold ${LEVEL_COLORS[c.level]}">${c.level}</span>
        <span class="font-semibold text-amber-500">★ ${c.rating}</span>
      </div>
      <h3 class="mt-3 text-2xl font-extrabold">${c.title}</h3>
      <p class="mt-2 text-slate-600">${c.desc}</p>
      <div class="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div class="rounded-xl bg-slate-100 py-3"><p class="font-bold">${c.duration}</p><p class="text-xs text-slate-500">Duration</p></div>
        <div class="rounded-xl bg-slate-100 py-3"><p class="font-bold">${c.lessons}</p><p class="text-xs text-slate-500">Lessons</p></div>
        <div class="rounded-xl bg-slate-100 py-3"><p class="font-bold">${c.level}</p><p class="text-xs text-slate-500">Level</p></div>
      </div>
      <h4 class="mt-5 font-bold">What you will learn</h4>
      <ul class="mt-2 space-y-2 text-sm text-slate-700">
        ${c.syllabus.map((s) => `<li class="flex gap-2"><span class="text-emerald-500">✔</span>${s}</li>`).join("")}
      </ul>
      <div class="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
        <div>
          <span class="text-2xl font-extrabold text-indigo-600">${rupee(c.price)}</span>
          <span class="ml-1 text-sm text-slate-400 line-through">${rupee(c.mrp)}</span>
          <p class="text-xs font-semibold text-emerald-600">${discount(c)}% off · lifetime access</p>
        </div>
        <button onclick="enroll(${c.id})" class="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500">Enroll now</button>
      </div>
    </div>`;
  $("modal").classList.remove("hidden");
  $("modal").classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("modal").classList.add("hidden");
  $("modal").classList.remove("flex");
  document.body.style.overflow = "";
}

function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => t.classList.add("translate-y-20", "opacity-0"), 2500);
}

function enroll(id) {
  const c = COURSES.find((x) => x.id === id);
  closeModal();
  showToast(`Demo: enrollment request for "${c.title}" received`);
}

// Events
["search", "level", "sort"].forEach((id) => $(id).addEventListener("input", render));
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
$("menuBtn").addEventListener("click", () => $("mobileMenu").classList.toggle("hidden"));
$("mobileMenu").querySelectorAll("a").forEach((a) => a.addEventListener("click", () => $("mobileMenu").classList.add("hidden")));

// Init
$("statCourses").textContent = COURSES.length;
$("statCats").textContent = categories.length - 1;
renderChips();
render();