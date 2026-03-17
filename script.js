const contactForm = document.getElementById("contactForm");
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const reveals = document.querySelectorAll(".reveal");

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_g5q2env", "template_96rsnfj", this)
    .then(function() {
      alert("✅ Message sent successfully!");
    }, function(error) {
      alert("❌ Failed to send message");
      console.log(error);
    });
});

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

