const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxItems = document.querySelectorAll(".parallax");
const cursorStar = document.querySelector(".cursor-star");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -6% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 28);
}

function updateParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const speed = Number(item.dataset.speed || 0.08);
    const viewportCenter = window.innerHeight / 2;
    const itemCenter = rect.top + rect.height / 2;
    const offset = (viewportCenter - itemCenter) * speed;
    item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    item.style.transform = `translateY(var(--parallax-y))`;
  });
}

function handlePointerMove(event) {
  if (!cursorStar) return;

  cursorStar.style.left = `${event.clientX + 18}px`;
  cursorStar.style.top = `${event.clientY + 14}px`;
  cursorStar.classList.add("is-visible");
}

function handlePointerLeave() {
  cursorStar?.classList.remove("is-visible");
}

let ticking = false;

function onScroll() {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    updateHeader();
    updateParallax();
    ticking = false;
  });

  ticking = true;
}

document.addEventListener("pointermove", handlePointerMove);
document.addEventListener("pointerleave", handlePointerLeave);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);

updateHeader();
updateParallax();
