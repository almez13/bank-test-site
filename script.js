'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector(".nav");
//tabs
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
//scroll
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");



const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener("click", openModal)
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Menu smoth navigation - event delegation 
// 1. we add eventlistener to common parent element
// 2. determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function(e) {
  e.preventDefault(); 
  //matching strategy (ignore unnesessary clicks)
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    //setup scroll
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
});

//Menu animation 
const handleHover = function(e, opacity) {
  if(e.target.classList.contains("nav__link")) {
    const link = e.target;
    //chose parant element of all links and then select all siblings links of menu
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    //select Logo in menu
    const logo = link.closest(".nav").querySelector(".nav__logo");
    //check if link is active and add style
    siblings.forEach (el => {
      if(el !== link) el.style.opacity = /*opacity*/this;
    });
    //add style to logo
    logo.style.opacity = /*opacity*/this;
  }
};
// hover on
/*nav.addEventListener("mouseover", function(e) {
 handleHover(e, 0.5);
});
*/
//better way of the same - passing argument into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));

// hover out
/*nav.addEventListener("mouseout", function(e) {
  handleHover(e, 1);
});
*/
//better way of the same - passing argument into handler
nav.addEventListener("mouseout", handleHover.bind(1));


//Sticky menu navigation
/*
//Option 1 - bad code, should to avoid scroll event because of system overloading 
//need to get the current position of section1
const initialCoords = section1.getBoundingClientRect();
//add event handler
window.addEventListener("scroll", function(e) {
  if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky"); 
});
*/

//Option 2 - sticky menu creating by Intersection Observer API
const header = document.querySelector(".header");
//determine height of nav menu
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;  

  if(!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky"); 
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);


//Smooth button scroling
btnScrollTo.addEventListener("click", function (e) {
  //get coordinates of section 1
  const s1coords = section1.getBoundingClientRect();
  //scrolling - current position + current scroll
  /*
  window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  */
  //alternative scroll
  window.scrollTo({
    left: s1coords.left + window.pageXOffset, 
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  //modern way of scroll effect
  section1.scrollIntoView({behavior:"smooth"});
});

/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
//Get a random color
const randomColor  = () =>`rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function(e) {
  this.style.backgroungColor = randomColor();

  e.stopPropagation();

})
*/

//tabbed components
tabsContainer.addEventListener("click", function(e) {
  e.preventDefault();
  //even we click on name or a number we get the parent element with class "operations__tab" - the tab itself
  const clicked = e.target.closest(".operations__tab");
  //prevent from clicking on other areas than the tab
  if (!clicked) return;
  //first - remove active class from all tabs
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  //and remove active contend calss
  tabsContent.forEach(t => t.classList.remove("operations__content--active"));
  //then add active class to clicked tab  
  clicked.classList.add("operations__tab--active");
  //activate the content area adding active class
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});

//Reveal sections - unhide all of them by remove class
const allSections = document.querySelectorAll(".section");

const revealSection = function(entries, observer) {
  const [entry] = entries;  
  if(!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  //unobserve
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  //section reveal when 20% visible
  treshold: 0.20
});

allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

//Lazy load images of all sections
const imageTargets = document.querySelectorAll("img[data-src]");

const loadImg = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace low res image by high res image
  entry.target.src = entry.target.dataset.src;
  //only when image will be loaded the blure class will be removed
  entry.target.addEventListener("load", function() {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver (loadImg, {
  root: null,
  treshold: 0,
  //it will preload images 200px before user scrolls them
  rootMargin: "200px" 
});

imageTargets.forEach(img => {
  imgObserver.observe(img);
});

//slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
//Current slide
let currSlide = 0;
//Max amount of slides in slider
const maxSlides = slides.length;

// Slises position
const slidesPosition = function(slide) {
  slides.forEach ((sl, index) => {
    sl.style.transform = `translateX(${100 * (index - slide)}%)`;
  });
};
//starting point of slider, slide 0
slidesPosition(0);

//Next slide
const nextSlide = function() {
  if (currSlide === maxSlides - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }   
  //reposition slide according to current slide
  slidesPosition(currSlide);
  activeDot(currSlide);
};

//Previous slide
const prevSlide = function() {
  if (currSlide === 0) {
    currSlide = maxSlides - 1;
  } else {
    currSlide--;
  }   
  //reposition slide according to current slide
  slidesPosition(currSlide);
  activeDot(currSlide);
};

//Slide buttons
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

//Add keyboard events to slider
document.addEventListener("keydown", function(e) {
  if (e.key ==="ArrowLeft") prevSlide();
  e.key === "ArrowRight" && nextSlide();
});

//Create doots on the bottom of the slider
const createDots = function() {
  slides.forEach((s, i) =>{
    dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`)

  });
};

createDots();
// make dots work
dotContainer.addEventListener("click", function(e){
  if(e.target.classList.contains("dots__dot")){
    const {slide} = e.target.dataset;
    slidesPosition(slide);
    activeDot(slide);
  };  
});

//make active dot functionality
const activeDot = function(slide) {
  //remove active class from all dots
  document.querySelectorAll(".dots__dot").forEach(dot =>dot.classList.remove("dots__dot--active"));
  //add active class
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
};

activeDot(0);