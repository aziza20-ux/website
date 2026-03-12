const contactForm = document.getElementById("contactForm");
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const reveals = document.querySelectorAll(".reveal");

if (contactForm) {
	contactForm.addEventListener("submit", (e) => {
		e.preventDefault();
		alert("Thank you for contacting Blessed Plumbing. We will respond soon!");
		contactForm.reset();
	});
}

if (toggle && nav) {
	toggle.addEventListener("click", () => {
		const isOpen = nav.classList.toggle("active");
		toggle.setAttribute("aria-expanded", String(isOpen));
	});

	nav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			nav.classList.remove("active");
			toggle.setAttribute("aria-expanded", "false");
		});
	});
}

if ("IntersectionObserver" in window) {
	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					obs.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	reveals.forEach((section) => observer.observe(section));
} else {
	reveals.forEach((section) => section.classList.add("visible"));
}