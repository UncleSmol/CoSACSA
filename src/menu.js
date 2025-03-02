document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const menuToggle = document.getElementById("menu-toggle");
	const mobileMenu = document.getElementById("mobile-menu");
	const mobileLinks = document.querySelectorAll(".mobile-link");
	const body = document.body;

	// Toggle menu function
	function toggleMenu() {
		body.classList.toggle("menu-open");

		// Add this line to directly toggle the mobile menu's transform
		if (mobileMenu.classList.contains("translate-x-full")) {
			mobileMenu.classList.remove("translate-x-full");
		} else {
			mobileMenu.classList.add("translate-x-full");
		}
	}
    

	// Event listeners
	menuToggle.addEventListener("click", toggleMenu);

	// Close menu when clicking links
	mobileLinks.forEach((link) => {
		link.addEventListener("click", toggleMenu);
	});

	// Close menu on resize
	window.addEventListener("resize", () => {
		if (window.innerWidth >= 1024 && body.classList.contains("menu-open")) {
			toggleMenu();
		}
	});
});
