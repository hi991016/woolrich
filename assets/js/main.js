"use strict";

// ===== globals =====
let mm = gsap.matchMedia();
const mw = 1024;
const isMobile = window.matchMedia(`(max-width: ${mw}px)`);
const eventsTrigger = ["pageshow", "scroll"];

// ===== init =====
const init = () => {
  // # gsap
  ScrollTrigger.clearScrollMemory("manual");
  ScrollTrigger.refresh();
  // # app height
  appHeight();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 100,
    elements_selector: ".lazy",
  });
};

// ===== lenis =====
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
  // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1.0,
  smoothTouch: true,
  touchMultiplier: 1.5,
  infinite: false,
  direction: "vertical",
  gestureDirection: "vertical",
});
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);

  if (isMobile.matches) {
    doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
    doc.style.setProperty("--menu-height", `${menuH}px`);
  } else {
    doc.style.removeProperty("--app-height");
    doc.style.removeProperty("--menu-height");
  }
};
window.addEventListener("resize", appHeight);

// ===== scroll trigger =====
gsap.registerPlugin(ScrollTrigger);

const initGsap = () => {
  // # change bg
  const defaultColor = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll("[data-bg]").forEach((panel) => {
    let color = panel.dataset.bg;
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      end: "bottom top",
      markers: false,
      onEnter: () =>
        gsap.to("body", {
          duration: 0.3,
          ease: "power1.inOut",
          backgroundColor: color,
        }),
      onLeaveBack: () =>
        gsap.to("body", {
          duration: 0.3,
          ease: "power1.inOut",
          backgroundColor: defaultColor,
        }),
    });
  });

  // # hide tree
  mm.add(`(max-width: ${mw}px)`, () => {
    gsap.to("[data-fv-tree]", {
      autoAlpha: 0,
      duration: 0.3,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: "[data-diary]",
        start: "top bottom",
        end: "bottom top",
        markers: false,
        toggleActions: "play none none reverse",
      },
    });
  });

  // refactor refresh
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
};

// # reset trigger when resize
let resizeTimeout;
const optimizedResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    requestAnimationFrame(initGsap);
  }, 200);
};

const resizeObserver = new ResizeObserver(optimizedResize);
resizeObserver.observe(document.documentElement, {
  box: "content-box",
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("pageshow", () => {
  document.body.classList.remove("fadeout");
});
