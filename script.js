document.getElementById("contactForm").addEventListener("submit", function(e){

e.preventDefault()

alert("Thank you for contacting Blessed Plumbing. We will respond soon!")

})


const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
nav.classList.toggle("active");
});