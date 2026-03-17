const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const reveals = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const EMAILJS_SDK_URL = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
const EMAILJS_PUBLIC_KEY = "WwI5nYrI5ZDYRPm4i";
const EMAILJS_SERVICE_ID = "service_g5q2env";
const EMAILJS_TEMPLATE_ID = "template_96rsnfj";

let emailJsLoadPromise = null;
let emailJsInitialized = false;

function loadEmailJsSdk() {
	if (window.emailjs) {
		return Promise.resolve(window.emailjs);
	}

	if (emailJsLoadPromise) {
		return emailJsLoadPromise;
	}

	emailJsLoadPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = EMAILJS_SDK_URL;
		script.async = true;
		script.onload = () => {
			if (window.emailjs) {
				resolve(window.emailjs);
				return;
			}

			reject(new Error("EmailJS SDK loaded but emailjs is unavailable."));
		};
		script.onerror = () => reject(new Error("Failed to load EmailJS SDK."));
		document.head.appendChild(script);
	});

	return emailJsLoadPromise;
}

function initEmailJs() {
	if (window.emailjs && !emailJsInitialized) {
		window.emailjs.init(EMAILJS_PUBLIC_KEY);
		emailJsInitialized = true;
	}
}

if (contactForm) {
	contactForm.addEventListener("submit", async function (e) {
		e.preventDefault();
		const submitButton = this.querySelector("button[type='submit']");

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = "Sending...";
		}

		try {
			await loadEmailJsSdk();
			initEmailJs();
			await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);
			alert("Message sent successfully!");
		} catch (error) {
			alert("Failed to send message");
			console.error(error);
		} finally {
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.textContent = "Send Message";
			}
		}
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

