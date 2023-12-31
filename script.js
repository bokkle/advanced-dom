'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', (e) => {
  const s1coords = section1.getBoundingClientRect();

  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //SCROLLING
  //   window.scrollTo(
  //     s1coords.left + window.pageXOffset,
  //     s1coords.top + window.pageYOffset
  //   );

  //OLD SCHOOL SMOOTH SCROLL
  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });

  //MODERN SMOOTH SCROLL
  //only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation //////////////

// document.querySelectorAll('.nav__link').forEach((el) => {
//   el.addEventListener('click', (e) => {
//     e.preventDefault();
//     const id = e.currentTarget.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//EVENT DELEGATION
//1. Add event listener to common parent element
//2. Determine which element originated the event

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENT

//bad practice, use event delegation instead
// tabs.forEach((t) => t.addEventListener('click', () => {
//   console.log('Tab')
// }))

tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause (return early if nothing matches)
  if (!clicked) return;

  //ACTIVE TAB
  //remove 'active status from existing'
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  //'add active status to clicked
  clicked.classList.add('operations__tab--active');

  //ACTIVE CONTENT AREA

  //remove active status from existing
  tabsContent.forEach((content) =>
    content.classList.remove('operations__content--active')
  );
  //add active status to clicked, using the dataset (data-tab in html)
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION

const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', (e) => handleHover(e, 0.5));
nav.addEventListener('mouseout', (e) => handleHover(e, 1));

// STICKY NAVIGATION
//using scroll eventlistener (not efficient)
/*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', (e) => {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

//using intersection observer API
// const obsCallback = (entries, observer) => {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   //root = the element that the target is intersecting
//   root: null,
//   //whenever section1 intersects the viewport at (threshold, %), then the obs
//   //callback function will get called
//   //can have multi threshholds (as an array)
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //rootmargin = 90px before the threshold, the sticky nav will display
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// REVEAL SECTIONS ON SCROLL
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMGS
// * great for performance *
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //remove blur filter
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach((img) => imgObserver.observe(img));

// SLIDER COMPONENT
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = (slide) => {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = (slide) => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //next slide
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = () => {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////
/*

console.log(document.documentElement); // logs entire doc
console.log(document.head); // logs doc head
console.log(document.body); // logs doc body

const header = document.querySelector('.header'); // only querySelector needs a '.'
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // <button>
//getElemByTagName returns an HTML collection (a list which updates as the DOM updates)
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// CREATING / INSERTING ELEMS ------------------
// .insertAdjacentHMTL easy way to create an element

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.'
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message)
// header.after(message)

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// STYLES
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.padding = '10px';

console.log(message.style.backgroundColor); // rgb(55, 56, 61)

console.log(message.style.color); // nothing (bc we didnt set it in JS)
console.log(getComputedStyle(message).color); // this is how u do the above
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Bankist logo
console.log(logo.src); // link to img
console.log(logo.className); // nav__logo

logo.alt = 'Beautiful minimalist logo';

//non-standard
console.log(logo.designer); // nothing
console.log(logo.getAttribute('designer')); // Jonas
logo.setAttribute('company', 'Bankist');

//absolute URL
console.log(logo.src); // http://127.0.0.1:5500/img/logo.png
//relative URL
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // http://127.0.0.1:5500/index.html?#
console.log(link.getAttribute('href')); // #

// DATA ATTRIBUTES
// data keyword used in HTML when we need to store data in the UI
console.log(logo.dataset.versionNumber); // 3.0

// CLASSES
//these make it ez to work with classes without interfering with existing classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

//dont use (overrides all existing classes and only allows for 1 class)
logo.className = 'jonas';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', (e) => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //SCROLLING
  //   window.scrollTo(
  //     s1coords.left + window.pageXOffset,
  //     s1coords.top + window.pageYOffset
  //   );

  //OLD SCHOOL SMOOTH SCROLL
  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });

  //MODERN SMOOTH SCROLL
  //only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

const h1 = document.querySelector('h1');

const alertH1 = (e) => {
  alert('addEventListener: Great! You are reading the heading');
  //REMOVING EVENT LISTENER AFTER 1ST TRIGGER
  //   h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

//REMOVING EVENT LISTENER AFTER TIME
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = (e) => {
//   alert('addEventListener: Great! You are reading the heading');
// };

//rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

document.querySelector('.nav__link').addEventListener('click', (e) => {
  e.currentTarget.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //stop propogation (not generally a good idea)
//   e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.currentTarget.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', (e) => {
  e.currentTarget.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

const h1 = document.querySelector('h1');
//GOING DOWNWARDS: child elements
//1. use queryselector
// since .highlight is a child of the h1 parent, they are selected.
// other elems with the class of .highlight won't be selected
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); // not really used, returns everything within the h1
console.log(h1.children); // gives an HTML collection (live updates)
// only works for DIRECT children
h1.firstElementChild.style.color = 'white'; // only first child
h1.lastElementChild.style.color = 'orangered'; // only last child

//GOING UPWARDS: selecting parent elements
console.log(h1.parentNode);
console.log(h1.parentElement);
// closest will select parent element of h1
// POPULAR
h1.closest('.header').style.background = 'var(--gradient-secondary)';
// the closest parent element here is the h1 itself
h1.closest('h1').style.background = 'var(--gradient-primary)';
// think of closest as the opposite of queryselector.
// closest finds parents, queryselector find children

//GOING SIDEWAYS: siblings
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // the h4 that comes after the h1

console.log(h1.previousSibling); // returns #text
console.log(h1.nextSibling); // returns #text

//all siblings
console.log(h1.parentElement.children); // nodes of siblings + itself

//this will spread the nodes into an array that we can iterate over
[...h1.parentElement.children].forEach((el) => {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)'
  }
});
*/

// document.addEventListener('DOMContentLoaded', (e) => {
//   console.log('HTML Parsed and DOM tree built', e);
// });

// window.addEventListener('load', (e) => {
//   console.log('Page fully loaded', e);
// });

// PREVENT PPL FROM LEAVING SITE
// window.addEventListener('beforeunload', (e) => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
