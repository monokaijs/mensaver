const nav = document.querySelector(".header"),
  hamBtn = document.querySelector(".ham__btn"),
  navMenu = document.querySelector(".nav__menu"),
  navLinks = document.querySelectorAll(".nav__link"),
  sections = document.querySelectorAll("section[id]"),
  themeBtn = document.querySelector(".theme__toggle");

  // Hamburger menu start
  hamBtn.addEventListener("click", (e) => {
    navMenu.classList.toggle("show__menu");
  });
  
  navLinks.forEach((e) => {
    e.addEventListener("click", () => navMenu.classList.remove("show__menu"));
  });
  // Hamburger menu start


// Current section view in nav links 
const scrollActive = () => {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navMenu
        .querySelector("a[href*=" + sectionId + "]")
        .classList.add("active__link");
    } else {
      navMenu
        .querySelector("a[href*=" + sectionId + "]")
        .classList.remove("active__link");
    }
  });
};
window.addEventListener("scroll", scrollActive);


// Shadow add to header after scroll 
const scrollHeader = () => {
  if (window.scrollY >= 80) nav.classList.add("scroll__header");
  else nav.classList.remove("scroll__header");
};
window.addEventListener("scroll", scrollHeader);


// Scroll to top button 
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// Theme Changer
// Theme Changer
// Theme Changer
let theme = "light";

const activeDark = (event) => {
  event.classList.remove("bx-toggle-left");
  event.classList.add("bx-toggle-right");
  document.querySelector("body").classList.add("dark__theme");
};

const deActiveDark = (event) => {
  event.classList.remove("bx-toggle-right");
  event.classList.add("bx-toggle-left");
  document.querySelector("body").classList.remove("dark__theme");
};

if (localStorage.getItem("theme__rdw") === null) {
  localStorage.setItem("theme__rdw", "light");
} else {
  theme = localStorage.getItem("theme__rdw");
}
theme === "dark" ? activeDark(themeBtn) : null;
themeBtn.addEventListener("click", (e) => {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme__rdw", theme);
  theme === "dark" ? activeDark(e.target) : deActiveDark(e.target);
});
