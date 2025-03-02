document.addEventListener("DOMContentLoaded", () => {
	// Register GSAP plugins
	gsap.registerPlugin(ScrollTrigger);

	// Initialize master timeline
	const masterTl = gsap.timeline();

	// Initial page load animations
	masterTl
		.from("header", {
			y: -100,
			opacity: 0,
			duration: 1,
			ease: "power3.out",
		})
		.from(
			"#home h2, #home p, #home .btn-primary",
			{
				opacity: 0,
				y: 50,
				duration: 0.8,
				stagger: 0.2,
				ease: "back.out(1.7)",
			},
			"-=0.5"
		);

	// Hero Slideshow with GSAP
	
	const slides = gsap.utils.toArray(".hero-slide");
	let current = 0;

	// Set initial state
	gsap.set(slides, { position: "absolute", width: "100%" });
	gsap.set(slides[0], { zIndex: 2 });
	gsap.set(slides.slice(1), { autoAlpha: 0 });

	function nextSlide() {
		const next = (current + 1) % slides.length;

		// Slide transition using GSAP
		const slideTl = gsap.timeline();

		slideTl
			.set(slides[next], { zIndex: 1 })
			.set(slides[current], { zIndex: 2 })
			.to(slides[current], {
				xPercent: -100,
				duration: 1.2,
				ease: "power2.inOut",
			})
			.set(slides[current], { autoAlpha: 0, xPercent: 0 })
			.set(slides[next], { zIndex: 2, autoAlpha: 1 });

		current = next;
	}

	// Change slide every 8 seconds
	const slideInterval = setInterval(nextSlide, 8000);

	// Scroll animations
	const sections = gsap.utils.toArray("section:not(#home)");

	sections.forEach((section) => {
		// Section entrance animation
		gsap.from(section, {
			opacity: 0,
			y: 50,
			duration: 1,
			scrollTrigger: {
				trigger: section,
				start: "top 80%",
				end: "top 50%",
				scrub: 1,
				once: false,
			},
		});

		// Animate children with stagger
		const elements = section.querySelectorAll(
			"h2, p, .card-custom, .btn-primary, form > *"
		);

		gsap.from(elements, {
			opacity: 0,
			y: 30,
			scale: 0.95,
			duration: 0.6,
			stagger: 0.1,
			ease: "power1.out",
			scrollTrigger: {
				trigger: section,
				start: "top 70%",
				once: true,
			},
		});
	});

	// Button hover animations
	gsap.utils.toArray(".btn-primary").forEach((button) => {
		const btnTl = gsap.timeline({ paused: true });

		btnTl.to(button, {
			scale: 1.05,
			duration: 0.3,
			ease: "power1.out",
			boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
		});

		button.addEventListener("mouseenter", () => btnTl.play());
		button.addEventListener("mouseleave", () => btnTl.reverse());
	});

	// Card hover animations
	gsap.utils.toArray(".card-custom").forEach((card) => {
		const cardTl = gsap.timeline({ paused: true });

		cardTl.to(card, {
			y: -10,
			scale: 1.02,
			boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
			duration: 0.4,
			ease: "power2.out",
		});

		card.addEventListener("mouseenter", () => cardTl.play());
		card.addEventListener("mouseleave", () => cardTl.reverse());
	});

	// Mobile Menu Animations
	const menuToggle = document.getElementById("menu-toggle");
	const mobileMenu = document.getElementById("mobile-menu");
	const hamburger = document.querySelector(".hamburger");
	const mobileLinks = mobileMenu.querySelectorAll("a");

	// Create hamburger animation
	const hamburgerTl = gsap.timeline({ paused: true });

	hamburgerTl
		.to(
			hamburger.children[0],
			{
				y: 8,
				rotation: 45,
				duration: 0.4,
				ease: "power2.inOut",
			},
			0
		)
		.to(
			hamburger.children[1],
			{
				opacity: 0,
				duration: 0.2,
			},
			0
		)
		.to(
			hamburger.children[2],
			{
				y: -8,
				rotation: -45,
				duration: 0.4,
				ease: "power2.inOut",
			},
			0
		);

	// Create mobile menu animation
	const mobileTl = gsap.timeline({ paused: true });

	mobileTl
		.to(mobileMenu, {
			x: "0%",
			duration: 0.5,
			ease: "power3.out",
		})
		.fromTo(
			mobileLinks,
			{
				y: 30,
				opacity: 0,
				borderBottom: "2px solid transparent",
			},
			{
				y: 0,
				opacity: 1,
				borderBottom: "2px solid white",
				padding: "8px 0",
				duration: 0.4,
				stagger: 0.1,
				ease: "back.out(1.7)",
			},
			"-=0.2"
		);

	// Toggle menu function
	function toggleMenu() {
		if (mobileTl.progress() === 0) {
			hamburgerTl.play();
			mobileTl.play();
			document.body.classList.add("overflow-hidden");
		} else {
			hamburgerTl.reverse();
			mobileTl.reverse();
			document.body.classList.remove("overflow-hidden");
		}
	}

	// Menu event listeners
	menuToggle.addEventListener("click", toggleMenu);

	mobileLinks.forEach((link) => {
		link.addEventListener("click", toggleMenu);
	});

	// Handle resize
	window.addEventListener("resize", () => {
		if (window.innerWidth >= 1024 && mobileTl.progress() > 0) {
			toggleMenu();
		}
	});

	// Parallax effect for hero section
	gsap.to("#home .absolute.inset-0", {
		yPercent: 50,
		ease: "none",
		scrollTrigger: {
			trigger: "#home",
			start: "top top",
			end: "bottom top",
			scrub: true,
		},
	});

	// Text reveal animations for important headings
	gsap.utils.toArray("h2.section-title").forEach((heading) => {
		const chars = heading.textContent.split("");
		heading.textContent = "";

		chars.forEach((char) => {
			const span = document.createElement("span");
			span.textContent = char === " " ? "\u00A0" : char;
			span.style.display = "inline-block";
			heading.appendChild(span);
		});

		gsap.from(heading.children, {
			opacity: 0,
			y: 20,
			rotateX: -90,
			stagger: 0.03,
			duration: 0.5,
			ease: "back.out",
			scrollTrigger: {
				trigger: heading,
				start: "top 80%",
				once: true,
			},
		});
	});
	
 // Call the stats animation function
    animateStats();
	
	// Fade in about section content
    gsap.from("#about .container", {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "top 50%",
            scrub: false
        }
    });
	
});


// Animate statistics numbers in About section
function animateStats() {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;
    
    // Create master timeline
    const statsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 80%',
            once: true
        }
    });
    
    // Stagger the appearance of stat items
    statsTl.from(statItems, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)'
    });
    
    // Fade in background images
    statsTl.to('.stat-bg', {
        opacity: 0.7,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.inOut'
    }, '-=0.8');
    
    // Animate the numbers
    statItems.forEach((item, index) => {
        const numberEl = item.querySelector('.stat-number');
        const value = parseInt(numberEl.getAttribute('data-value'));
        const hasPlusSign = numberEl.textContent.includes('+');
        
        const counter = { val: 0 };
        
        statsTl.to(counter, {
            val: value,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
                numberEl.textContent = Math.round(counter.val) + (hasPlusSign ? '+' : '');
            },
            delay: index * 0.1
        }, '-=1.8');
    });
    
    // Add subtle pulse animation to each stat
    statItems.forEach((item, index) => {
        const pulseTl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            delay: index * 0.5
        });
        
        pulseTl.to(item, {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            duration: 1.5,
            ease: 'sine.inOut'
        });
    });
    
    return statsTl;
}


