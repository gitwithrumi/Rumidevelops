function init() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}
init();

var tl = gsap.timeline();
let startTime = Date.now();
let minimumDuration = 2000;

function incrementLoader(actualDuration) {
  return new Promise((resolve) => {
    let a = 0;
    let interval = setInterval(function () {
      let elapsedTime = Date.now() - startTime;
      let totalDuration = Math.max(actualDuration, minimumDuration);
      a = Math.min((elapsedTime / totalDuration) * 100, 100);
      document.querySelector("#loader h1").innerHTML = Math.floor(a) + "%";

      if (a >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 20); // Update every 50ms for smoother increment
  });
}

tl.from("#loader", {
  left: "-100%",
  duration: 1,
  easing: "easeOut",
  delay: 0,
});

window.addEventListener("load", function () {
  let loadTime = Date.now() - startTime;

  incrementLoader(loadTime).then(() => {
    tl.to("#loader h1", {
      duration: 0.5,
    })
      .to("#loader", {
        left: "100%",
        delay: 0.1,
        duration: 1.2,
        onComplete: function () {
          document.getElementById("loader").style.display = "none";
        },
      })
      .from(
        ".logo img, #nav-part--2 ul li, #nav-part--3 #contactBtn, #home-part--1 h1, #home-part--1 h3, #home-part--1 #contactBtn, #about-intro--1 h1, #about-intro--1 h3, #pricing-header h1, #pricing-header h3, #pricing-header h3, #pricing-offers>h1, .project-item h2, .project-item p, .project-item #pricingBtn, .project-item img",
        {
          x: -100,
          opacity: 0,
          duration: 0.5,
          easing: "easeOut",
          stagger: 0.11,
        }
      )
      .from("#home-part--2 img, #about-intro--2 img", {
        opacity: 0,
        scale: 0.5,
      });
  });
});

incrementLoader(minimumDuration);

gsap.to("#sales-growth--1 h2", {
  transform: "translateX(-50%)",
  fontWeight: "100",
  scrollTrigger: {
    trigger: "#sales-growth--1 h2",
    scroller: "#main",
    start: "top 0%",
    end: "top -160%",
    scrub: 2,
    pin: true,
  },
});

function toggleAnswer(id) {
  const answer = document.getElementById(`answer${id}`);
  const item = answer.parentElement;

  if (answer.style.maxHeight === "0px" || answer.style.maxHeight === "") {
    answer.style.maxHeight = answer.scrollHeight + "px";
    item.classList.add("open");
  } else {
    answer.style.maxHeight = "0";
    item.classList.remove("open");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0;
  const navbar = document.getElementById("nav");

  window.addEventListener("scroll", function () {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      // Downscroll
      navbar.style.opacity = "0"; // Hide navbar
    } else {
      // Upscroll
      navbar.style.opacity = "1"; // Show navbar
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
  });
});
