'use strict';
/////////////////////////////////////
const scrollToButton = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const showModalBtns = document.querySelectorAll('.btn--show-modal');
const closeModalBtn = document.querySelector('.btn--close-modal');
const navLink = document.querySelector('.nav__links');
const tabContainer = document.querySelector('.operations__tab-container');
const navLogo = document.querySelector('.nav__logo');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
const allImage = document.querySelectorAll('.features__img');
const allSlide = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

// 1. Open and Close Modal
const modalToggle = function () {
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

showModalBtns.forEach(function (btn) {
  btn.addEventListener('click', modalToggle);
});

closeModalBtn.addEventListener('click', modalToggle);
overlay.addEventListener('click', modalToggle);
document.addEventListener('keyup', function (e) {
  if (e.key !== 'Escape') return;
  modalToggle();
});

// 2. Implementing Smooth Scrolling
scrollToButton.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// 3. Page Navigation
navLink.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  const sectionId = e.target.getAttribute('href');
  document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
});

// 4. Tabs
tabContainer.addEventListener('click', function (e) {
  const tab = e.target.closest('.operations__tab');
  if (!tab) return;
  const tabId = tab.dataset.tab;
  document.querySelectorAll('.operations__tab').forEach(function (el) {
    if (el.dataset.tab === tabId) el.classList.add('operations__tab--active');
    else el.classList.remove('operations__tab--active');
  });
  document.querySelectorAll('.operations__content').forEach(function (el) {
    if (el.classList.contains(`operations__content--${tabId}`))
      el.classList.add('operations__content--active');
    else el.classList.remove('operations__content--active');
  });
});

// 5. Navigation Hover
const opacityNav = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  navLink.querySelectorAll('.nav__link').forEach(el => {
    if (el !== e.target) el.style.opacity = this;
  });
  navLogo.style.opacity = this;
};

navLink.addEventListener('mouseover', opacityNav.bind(0.5));
navLink.addEventListener('mouseout', opacityNav.bind(1));

// 6. Sticky Nav
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(nav).height}`,
});

headerObserver.observe(header);

// 7. Revealing Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
});

// 8. Lazy Loading Image
const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0.1,
});

allImage.forEach(function (img) {
  imageObserver.observe(img);
});

// 9. Slider
let curSlide = 0;

allSlide.forEach(function (_, i) {
  const dot = document.createElement('div');
  dot.classList.add('dots__dot');
  dot.setAttribute('data-slide', `${i}`);
  dots.append(dot);
});

const moveToSlide = function (slideNumber) {
  console.log('hey');
  console.log(allSlide);
  allSlide.forEach(function (slide, i) {
    slide.style.transform = `translateX(${(i - slideNumber) * 100}%)`;
  });
};

moveToSlide(curSlide);

const nextSlide = function () {
  if (curSlide === allSlide.length - 1) curSlide = 0;
  else curSlide++;
  moveToSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = allSlide.length - 1;
  else curSlide--;
  moveToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keyup', function (e) {
  console.log(e.key);
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dots.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  document
    .querySelectorAll('dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  e.target.classList.add('dots__dot--active');
  moveToSlide(e.target.dataset.slide);
});
