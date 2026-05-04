/* ============================================================
   MAAHIRAA DIAMONDS - Script
   ============================================================ */

'use strict';

/* --- Footer year ------------------------------------------ */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* --- Nav: scroll state ------------------------------------ */
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* --- Nav: mobile toggle ----------------------------------- */
const toggle    = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('nav-mobile');

function closeMenu() {
  toggle.classList.remove('open');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  const isOpen = toggle.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (mobileNav.classList.contains('open')) closeMenu();
    if (!lightbox.hidden) closeLightbox();
  }
});

/* --- Reveal on scroll ------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- Collection media paths ------------------------------- */
/*
  To update the portfolio, edit only these path/title/type entries.
  Keep six items per category. Alternate type: 'image', 'video', 'image', 'video', ...
*/
const collectionItems = {
  rings: [
    { type: 'image', title: 'Sapphire Petal', src: 'assets/collection/blue-sapphire-ring.jpeg', alt: 'Blue sapphire ring with diamond petal setting' },
    { type: 'video', title: 'Ring Motion 01', src: 'assets/collection/collection-motion-07.mp4', alt: 'Diamond ring motion preview' },
    { type: 'image', title: 'Crown Solitaire', src: 'assets/collection/diamond-crown-ring.jpeg', alt: 'Diamond crown solitaire ring' },
    { type: 'video', title: 'Ring Motion 02', src: 'assets/collection/collection-motion-05.mp4', alt: 'Gold diamond ring motion preview' },
    { type: 'image', title: 'Emerald Halo', src: 'assets/collection/emerald-halo-ring.jpeg', alt: 'Emerald halo ring with diamond setting' },
    { type: 'video', title: 'Ring Motion 03', src: 'assets/collection/collection-motion-06.mp4', alt: 'Fine ring motion preview' },
  ],
  necklaces: [
    { type: 'image', title: 'Diamond Riviera', src: 'assets/collection/emerald-drop-necklace.jpeg', alt: 'Diamond riviera necklace' },
    { type: 'video', title: 'Necklace Motion 01', src: 'assets/collection/collection-motion-02.mp4', alt: 'Diamond necklace motion preview' },
    { type: 'image', title: 'Emerald Drop', src: 'assets/collection/red-d-neck.jpeg', alt: 'Emerald drop pendant necklace' },
    { type: 'video', title: 'Necklace Motion 02', src: 'assets/collection/collection-motion-03.mp4', alt: 'Gemstone necklace motion preview' },
    { type: 'image', title: 'Ruby Statement', src: 'assets/collection/d-neck.jpeg', alt: 'Ruby statement necklace with diamonds' },
    { type: 'video', title: 'Necklace Motion 03', src: 'assets/collection/collection-motion-01.mp4', alt: 'Statement necklace motion preview' },
  ],
  bracelets: [
    { type: 'image', title: 'Diamond Tennis', src: 'assets/collection/diamond-bracelet.jpeg', alt: 'Diamond tennis bracelet' },
    { type: 'video', title: 'Bracelet Motion 01', src: 'assets/collection/brace5.mp4', alt: 'Diamond bracelet motion preview' },
    { type: 'image', title: 'Rose Gold Bangle', src: 'assets/collection/rose-gold-bracelet.jpeg', alt: 'Rose gold diamond bangle bracelet' },
    { type: 'video', title: 'Bracelet Motion 02', src: 'assets/collection/brace4.mp4', alt: 'Rose gold bracelet motion preview' },
    { type: 'image', title: 'Crown Detail', src: 'assets/collection/ruby-statement-necklace.jpeg', alt: 'Diamond facet detail used as bracelet inspiration placeholder' },
    { type: 'video', title: 'Bracelet Motion 03', src: 'assets/collection/brace3.mp4', alt: 'Bracelet atelier motion preview' },
  ],
};

const categoryLabels = {
  rings: 'Rings',
  necklaces: 'Necklaces',
  bracelets: 'Bracelets',
};

const collectionGrid = document.getElementById('collection-grid');
const catTabs = document.querySelectorAll('.cat-tab');
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

function mediaMarkup(item) {
  if (item.type === 'video') {
    return `
      <video class="grid-media" muted loop playsinline preload="metadata" aria-label="${item.alt}">
        <source src="${item.src}" type="video/mp4" />
      </video>
      <span class="grid-video-badge" aria-hidden="true">Play</span>
    `;
  }

  return `<img class="grid-media" src="${item.src}" alt="${item.alt}" loading="lazy" />`;
}

function createCollectionItem(item, category) {
  const article = document.createElement('article');
  article.className = 'grid-item';
  article.dataset.category = category;
  article.dataset.type = item.type;
  article.dataset.src = item.src;
  article.dataset.alt = item.alt;
  article.setAttribute('role', 'listitem');
  article.tabIndex = 0;
  article.setAttribute('aria-label', `View ${item.title}`);
  article.innerHTML = `
    ${mediaMarkup(item)}
    <div class="grid-item-info" aria-hidden="true">
      <p>${item.title}</p>
      <span>${categoryLabels[category]}</span>
    </div>
  `;
  return article;
}

function renderCollection(category = 'all') {
  const categories = category === 'all' ? Object.keys(collectionItems) : [category];
  const fragment = document.createDocumentFragment();

  categories.forEach(cat => {
    collectionItems[cat].slice(0, 6).forEach(item => {
      fragment.appendChild(createCollectionItem(item, cat));
    });
  });

  collectionGrid.replaceChildren(fragment);
  bindCollectionItems();
}

catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat;

    catTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    renderCollection(cat);
  });
});

/* --- Lightbox --------------------------------------------- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBdrop = document.getElementById('lightbox-backdrop');

let lastFocused = null;

function openLightbox(src, alt, type = 'image') {
  lastFocused = document.activeElement;
  if (type === 'video') {
    lightboxImg.hidden = true;
    lightboxImg.src = '';
    lightboxVideo.hidden = false;
    lightboxVideo.src = src;
    lightboxVideo.setAttribute('aria-label', alt || '');
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.hidden = true;
    lightboxVideo.removeAttribute('src');
    lightboxImg.hidden = false;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
  }
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  lightboxImg.hidden = false;
  lightboxVideo.pause();
  lightboxVideo.hidden = true;
  lightboxVideo.removeAttribute('src');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function playTileVideo(item) {
  const video = item.querySelector('video');
  if (video) video.play().catch(() => {});
}

function pauseTileVideo(item) {
  const video = item.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function bindCollectionItems() {
  document.querySelectorAll('.grid-item').forEach(item => {
    if (item.dataset.type === 'video') {
      item.addEventListener('mouseenter', () => playTileVideo(item));
      item.addEventListener('mouseleave', () => pauseTileVideo(item));
      item.addEventListener('focus', () => playTileVideo(item));
      item.addEventListener('blur', () => pauseTileVideo(item));
    }

    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const alt = item.dataset.alt || '';
      const type = item.dataset.type || 'image';

      if (isTouchDevice && type === 'video' && !item.classList.contains('is-previewing')) {
        document.querySelectorAll('.grid-item.is-previewing').forEach(activeItem => {
          activeItem.classList.remove('is-previewing');
          pauseTileVideo(activeItem);
        });
        item.classList.add('is-previewing');
        playTileVideo(item);
        return;
      }

      if (src) openLightbox(src, alt, type);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBdrop.addEventListener('click', closeLightbox);
renderCollection();
