'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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
*/
