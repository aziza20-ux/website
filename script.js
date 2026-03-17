const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const reveals = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const EMAILJS_SDK_URL = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
const EMAILJS_PUBLIC_KEY = "WwI5nYrI5ZDYRPm4i";
const EMAILJS_SERVICE_ID = "service_g5q2env";
const EMAILJS_TEMPLATE_ID = "template_96rsnfj";
const MIN_FILL_TIME_MS = 4000;
const SUBMIT_COOLDOWN_MS = 60000;
const LAST_SUBMIT_STORAGE_KEY = "contact_form_last_submit_ts";
const MAX_URL_COUNT = 2;

let emailJsLoadPromise = null;
let emailJsInitialized = false;

function countUrls(text) {
	const matches = text.match(/(https?:\/\/|www\.)/gi);
	return matches ? matches.length : 0;
}

function looksLikeSpam(messageText) {
	if (countUrls(messageText) > MAX_URL_COUNT) {
		return true;
	}

	if (/(.)\1{7,}/.test(messageText)) {
		return true;
	}

	if (/\b(crypto|bitcoin|forex|seo service|backlink|casino|betting|loan)\b/i.test(messageText)) {
		return true;
	}

	return false;
}

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
	const startedAtInput = contactForm.querySelector("#form-started-at");
	if (startedAtInput) {
		startedAtInput.value = String(Date.now());
	}

	contactForm.addEventListener("submit", async function (e) {
		e.preventDefault();
		const submitButton = this.querySelector("button[type='submit']");
		const honeypot = this.querySelector("input[name='website']");
		const messageField = this.querySelector("textarea[name='message']");
		const startedAt = Number((this.querySelector("#form-started-at") || {}).value || 0);
		const now = Date.now();
		const elapsed = now - startedAt;
		const lastSubmitAt = Number(window.localStorage.getItem(LAST_SUBMIT_STORAGE_KEY) || 0);
		const cooldownRemaining = SUBMIT_COOLDOWN_MS - (now - lastSubmitAt);
		const messageText = (messageField ? messageField.value : "").trim();

		if (honeypot && honeypot.value.trim() !== "") {
			return;
		}

		if (!startedAt || elapsed < MIN_FILL_TIME_MS) {
			alert("Please wait a few seconds and try again.");
			return;
		}

		if (cooldownRemaining > 0) {
			const seconds = Math.ceil(cooldownRemaining / 1000);
			alert("Please wait " + seconds + " seconds before sending another message.");
			return;
		}

		if (messageText.length < 10 || looksLikeSpam(messageText)) {
			alert("Please enter a valid message without spam links.");
			return;
		}

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = "Sending...";
		}

		try {
			await loadEmailJsSdk();
			initEmailJs();
			await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);
			window.localStorage.setItem(LAST_SUBMIT_STORAGE_KEY, String(Date.now()));
			if (startedAtInput) {
				startedAtInput.value = String(Date.now());
			}
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

