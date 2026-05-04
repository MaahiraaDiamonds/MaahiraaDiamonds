const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const revealItems = document.querySelectorAll(".reveal");
const heroMedia = document.querySelector(".hero-media");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox]");
const collectionSlider = document.querySelector("[data-collection-slider]");
const testimonials = document.querySelectorAll(".testimonial");
const dotsContainer = document.querySelector("[data-dots]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);

  if (heroMedia) {
    heroMedia.style.setProperty("--parallax", Math.min(window.scrollY * 0.16, 90));
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navPanel.classList.toggle("open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navPanel.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const openLightbox = (src) => {
  lightboxImage.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger.dataset.lightbox));
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

if (collectionSlider) {
  const viewport = collectionSlider.querySelector("[data-slider-viewport]");
  const slides = [...collectionSlider.querySelectorAll(".collection-slide")];
  const prev = collectionSlider.querySelector("[data-slider-prev]");
  const next = collectionSlider.querySelector("[data-slider-next]");
  const dots = collectionSlider.querySelector("[data-slider-dots]");
  const videoCards = [...collectionSlider.querySelectorAll("[data-video-card]")];
  let activeSlide = 0;
  let scrollTimeout;

  const playCardVideo = (card) => {
    const video = card.querySelector("video");
    if (!video) return;
    card.classList.add("playing");
    video.play().catch(() => {
      card.classList.remove("playing");
    });
  };

  const pauseCardVideo = (card) => {
    const video = card.querySelector("video");
    if (!video) return;
    video.pause();
    card.classList.remove("playing");
  };

  const pauseInactiveVideos = (activeCard) => {
    videoCards.forEach((card) => {
      if (card !== activeCard) pauseCardVideo(card);
    });
  };

  const scrollToSlide = (index) => {
    const slide = slides[index];
    if (!slide) return;
    viewport.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  const updateDots = (index) => {
    activeSlide = index;
    [...dots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  const detectActiveSlide = () => {
    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    const closest = slides.reduce(
      (best, slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Infinity }
    );

    updateDots(closest.index);
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to collection design ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => scrollToSlide(index));
    dots.append(dot);
  });

  prev.addEventListener("click", () => {
    scrollToSlide(Math.max(activeSlide - 1, 0));
  });

  next.addEventListener("click", () => {
    scrollToSlide(Math.min(activeSlide + 1, slides.length - 1));
  });

  viewport.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(detectActiveSlide, 80);
  }, { passive: true });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") scrollToSlide(Math.min(activeSlide + 1, slides.length - 1));
    if (event.key === "ArrowLeft") scrollToSlide(Math.max(activeSlide - 1, 0));
  });

  videoCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      pauseInactiveVideos(card);
      playCardVideo(card);
    });
    card.addEventListener("mouseleave", () => pauseCardVideo(card));
    card.addEventListener("focus", () => {
      pauseInactiveVideos(card);
      playCardVideo(card);
    });
    card.addEventListener("blur", () => pauseCardVideo(card));
    card.addEventListener("click", () => {
      const video = card.querySelector("video");
      if (!video) return;
      const isTouchLike = window.matchMedia("(hover: none)").matches;
      pauseInactiveVideos(card);
      if (isTouchLike && !video.paused) return;
      if (video.paused) {
        playCardVideo(card);
      } else {
        pauseCardVideo(card);
      }
    });
  });

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const sliderBox = collectionSlider.getBoundingClientRect();
        const sliderVisible = sliderBox.bottom > 0 && sliderBox.top < window.innerHeight;
        if (entry.isIntersecting && sliderVisible && window.matchMedia("(hover: none)").matches) {
          pauseInactiveVideos(card);
          playCardVideo(card);
        } else if (!entry.isIntersecting) {
          pauseCardVideo(card);
        }
      });
    },
    { root: viewport, threshold: 0.62 }
  );

  videoCards.forEach((card) => videoObserver.observe(card));
}

let activeTestimonial = 0;
let testimonialTimer;

const showTestimonial = (index) => {
  testimonials[activeTestimonial].classList.remove("active");
  dotsContainer.children[activeTestimonial].classList.remove("active");
  activeTestimonial = index;
  testimonials[activeTestimonial].classList.add("active");
  dotsContainer.children[activeTestimonial].classList.add("active");
};

const startTestimonials = () => {
  testimonialTimer = window.setInterval(() => {
    showTestimonial((activeTestimonial + 1) % testimonials.length);
  }, 5200);
};

testimonials.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    window.clearInterval(testimonialTimer);
    showTestimonial(index);
    startTestimonials();
  });
  dotsContainer.append(dot);
});

startTestimonials();

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name");
  formStatus.textContent = `Thank you, ${name}. Your enquiry is ready for the Maahiraa Diamonds team.`;
  contactForm.reset();
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
