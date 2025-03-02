/**
 * Advanced Web Performance Optimization Script
 * This script enhances website performance through various optimization techniques
 * 
 * Features:
 * - Advanced lazy loading with priority hints
 * - Responsive image optimization
 * - Connection-aware loading
 * - Idle time optimization
 * - Content visibility management
 * - Performance metrics tracking
 * - GSAP animation optimization
 */

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // ======== Feature Detection ========
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsIdleCallback = 'requestIdleCallback' in window;
    const supportsContentVisibility = CSS.supports('content-visibility', 'auto');
    const supportsConnectionAPI = 'connection' in navigator;
    
    // Detect image format support
    const supportsWebP = checkWebpSupport();
    const supportsAVIF = checkAvifSupport();
    
    // ======== Configuration ========
    const config = {
        lazyLoadMargin: '200px 0px', // Load 200px before element enters viewport
        idleTimeout: 2000, // 2 seconds timeout for idle callback
        lowDataMode: checkLowDataMode(), // Check if user is on low-data mode
        isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        priority: {
            high: ['hero-slide', 'nav-logo'],
            medium: ['featured-event', 'primary-content'],
            low: ['instagram-post', 'social-card']
        }
    };
    
    // ======== Lazy Loading Implementation ========
    function initLazyLoading() {
        // Select all elements that should be lazy loaded
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        const lazyIframes = document.querySelectorAll('iframe[loading="lazy"], iframe[data-src]');
        const lazyBackgrounds = document.querySelectorAll('[data-background]');
        const lazyVideos = document.querySelectorAll('video[loading="lazy"], video[data-src]');
        
        // Create intersection observer if supported
        if (supportsIntersectionObserver) {
            const lazyItemObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyItem = entry.target;
                        
                        // Handle different element types
                        if (lazyItem.tagName === 'IMG') {
                            loadImage(lazyItem);
                        } else if (lazyItem.tagName === 'IFRAME') {
                            loadIframe(lazyItem);
                        } else if (lazyItem.tagName === 'VIDEO') {
                            loadVideo(lazyItem);
                        } else if (lazyItem.dataset.background) {
                            loadBackground(lazyItem);
                        }
                        
                        observer.unobserve(lazyItem);
                        
                        // Log performance data
                        if (supportsIdleCallback) {
                            requestIdleCallback(() => {
                                logLoadPerformance(lazyItem);
                            });
                        }
                    }
                });
            }, { 
                rootMargin: config.lazyLoadMargin,
                threshold: 0
            });
            
            // Observe all lazy elements
            lazyImages.forEach(img => lazyItemObserver.observe(img));
            lazyIframes.forEach(iframe => lazyItemObserver.observe(iframe));
            lazyBackgrounds.forEach(bg => lazyItemObserver.observe(bg));
            lazyVideos.forEach(video => lazyItemObserver.observe(video));
            
        } else {
            // Fallback for browsers without IntersectionObserver
            loadAllLazyElements();
        }
    }
    
    // ======== Content Visibility Management ========
    function initContentVisibility() {
        if (!supportsContentVisibility) return;
        
        const sections = document.querySelectorAll('section');
        
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When section is near viewport, set content-visibility to auto
                // When far away, set to hidden to save resources
                if (entry.isIntersecting || Math.abs(entry.boundingClientRect.top) < window.innerHeight * 2) {
                    entry.target.style.contentVisibility = 'auto';
                } else {
                    entry.target.style.contentVisibility = 'hidden';
                }
            });
        }, { 
            rootMargin: '200% 0%' // Large margin to prepare content well in advance
        });
        
        sections.forEach(section => {
            // Only apply to larger sections that benefit from this optimization
            if (section.offsetHeight > 500) {
                section.style.containIntrinsicSize = '1px 500px'; // Placeholder size
                visibilityObserver.observe(section);
            }
        });
    }
    
    // ======== Resource Hint Management ========
    function manageResourceHints() {
        // Dynamically add preload/prefetch hints based on viewport and user journey
        
        // Preload critical resources for current view
        const currentSection = getCurrentSection();
        
        if (currentSection) {
            // Find visible images that should be preloaded
            const criticalImages = currentSection.querySelectorAll('img:not([loading="lazy"])');
            criticalImages.forEach(img => {
                if (!img.src && img.dataset.src) {
                    createPreloadLink(img.dataset.src, 'image');
                }
            });
            
            // Preload next section's critical resources
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && !config.lowDataMode) {
                // Find the first high-priority image in the next section
                const nextHighPriorityImage = nextSection.querySelector('.hero-slide img, .featured-image');
                if (nextHighPriorityImage && nextHighPriorityImage.dataset.src) {
                    createPreloadLink(nextHighPriorityImage.dataset.src, 'image');
                }
            }
        }
        
        // Clean up unused resource hints after 10 seconds
        setTimeout(cleanupResourceHints, 10000);
    }
    
    // ======== GSAP Animation Optimization ========
    function optimizeGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        
        // Apply will-change only during animations to optimize GPU usage
        const animatedElements = document.querySelectorAll('.gsap-animate');
        
        animatedElements.forEach(element => {
            // Create an observer to detect when element is near viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Element is visible, prepare for animation
                        prepareForAnimation(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50%' });
            
            observer.observe(element);
        });
        
        // Disable complex animations for reduced motion preference
        if (config.isReducedMotion) {
            gsap.defaults({
                duration: 0.5,
                ease: 'power1.out'
            });
            
            // Replace parallax effects with simpler transitions
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(element => {
                element.classList.remove('parallax');
                element.classList.add('simple-fade');
            });
        }
        
        // Optimize ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.config({
                limitCallbacks: true, // Limit callbacks for better performance
                ignoreMobileResize: true // Ignore resize events on mobile
            });
            
            // Batch ScrollTrigger refreshes
            let refreshTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(refreshTimeout);
                refreshTimeout = setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 250);
            });
        }
    }
    
    // ======== Network-aware Loading ========
    function initNetworkAwareLoading() {
        if (!supportsConnectionAPI) return;
        
        const connection = navigator.connection;
        
        // Update configuration based on connection
        function updateForConnection() {
            const effectiveType = connection.effectiveType; // 4g, 3g, 2g, slow-2g
            const saveData = connection.saveData; // true if data saver is enabled
            
            config.lowDataMode = saveData || effectiveType === '2g' || effectiveType === 'slow-2g';
            
            // Adjust loading strategy based on connection
            if (config.lowDataMode) {
                // Load low-res images
                document.documentElement.classList.add('low-data-mode');
                
                // Disable autoplay for videos
                document.querySelectorAll('video[autoplay]').forEach(video => {
                    video.removeAttribute('autoplay');
                    video.setAttribute('preload', 'none');
                });
                
                // Remove non-essential resources
                document.querySelectorAll('link[data-importance="low"]').forEach(link => {
                    link.remove();
                });
            }
        }
        
        // Initial update
        updateForConnection();
        
        // Listen for connection changes
        connection.addEventListener('change', updateForConnection);
    }
    
    // ======== Idle Time Optimization ========
    function initIdleTimeOptimization() {
        if (!supportsIdleCallback) return;
        
        const nonCriticalTasks = [
            () => loadNonCriticalCSS(),
            () => initThirdPartyScripts(),
            () => prefetchLikelyDestinations(),
            () => preconnectThirdPartyOrigins(),
            () => loadHighResImages()
        ];
        
        // Queue tasks to execute during idle time
        function queueIdleTasks() {
            if (nonCriticalTasks.length === 0) return;
            
            requestIdleCallback((deadline) => {
                // Check if we have enough idle time
                while (deadline.timeRemaining() > 10 && nonCriticalTasks.length > 0) {
                    const task = nonCriticalTasks.shift();
                    task();
                }
                
                // If tasks remain, queue again
                if (nonCriticalTasks.length > 0) {
                    queueIdleTasks();
                }
            }, { timeout: config.idleTimeout });
        }
        
        // Start queuing tasks
        queueIdleTasks();
    }
    
    // ======== Font Loading Optimization ========
    function optimizeFontLoading() {
        // Use font-display: swap in CSS
        // Alternatively, use the Font Loading API
        if ('fonts' in document) {
            const fontPromises = [
                // Load critical fonts first
                document.fonts.load('1em PrimaryFont'),
                document.fonts.load('bold 1em PrimaryFont')
            ];
            
            Promise.all(fontPromises).then(() => {
                // Add class when critical fonts are loaded
                document.documentElement.classList.add('fonts-loaded');
                
                // Load non-critical fonts during idle time
                if (supportsIdleCallback) {
                    requestIdleCallback(() => {
                        document.fonts.load('italic 1em PrimaryFont');
                        document.fonts.load('300 1em PrimaryFont');
                    });
                }
            });
        }
    }
    
    // ======== Helper Functions ========
    function loadImage(img) {
        if (img.dataset.src) {
            // Choose the right image format based on browser support
            if (supportsAVIF && img.dataset.srcAvif) {
                img.src = img.dataset.srcAvif;
            } else if (supportsWebP && img.dataset.srcWebp) {
                img.src = img.dataset.srcWebp;
            } else {
                img.src = img.dataset.src;
            }
            
            // Handle srcset if available
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            
            // Handle sizes if available
            if (img.dataset.sizes) {
                img.sizes = img.dataset.sizes;
            }
            
            // Clean up data attributes
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            img.removeAttribute('data-sizes');
            img.removeAttribute('data-src-webp');
            img.removeAttribute('data-src-avif');
        }
        
        // Remove lazy loading attribute to prevent double-loading
        img.removeAttribute('loading');
        
        // Add loaded class for CSS transitions
        img.classList.add('loaded');
    }
    
    function loadIframe(iframe) {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
        }
        iframe.removeAttribute('loading');
        iframe.classList.add('loaded');
    }
    
    function loadVideo(video) {
        if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load(); // Reload the video with the new source
            video.removeAttribute('data-src');
        }
        
        // Load poster if available
        if (video.dataset.poster) {
            video.poster = video.dataset.poster;
            video.removeAttribute('data-poster');
        }
        
        video.removeAttribute('loading');
        video.classList.add('loaded');
    }
    
    function loadBackground(element) {
        if (element.dataset.background) {
            // Choose the right image format based on browser support
            if (supportsAVIF && element.dataset.backgroundAvif) {
                element.style.backgroundImage = `url('${element.dataset.backgroundAvif}')`;
            } else if (supportsWebP && element.dataset.backgroundWebp) {
                element.style.backgroundImage = `url('${element.dataset.backgroundWebp}')`;
            } else {
                element.style.backgroundImage = `url('${element.dataset.background}')`;
            }
            
            element.removeAttribute('data-background');
            element.removeAttribute('data-background-webp');
            element.removeAttribute('data-background-avif');
        }
        element.classList.add('bg-loaded');
    }
    
    function loadAllLazyElements() {
        // Fallback function for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(loadImage);
        document.querySelectorAll('iframe[data-src]').forEach(loadIframe);
        document.querySelectorAll('video[data-src]').forEach(loadVideo);
        document.querySelectorAll('[data-background]').forEach(loadBackground);
    }
    
    function createPreloadLink(url, as) {
        // Check if this resource is already being preloaded
        if (document.querySelector(`link[rel="preload"][href="${url}"]`)) {
            return;
        }
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as || 'image';
        
        // Mark as dynamically added for cleanup
        link.setAttribute('data-dynamic', 'true');
        
        document.head.appendChild(link);
    }
    
    function cleanupResourceHints() {
        // Remove dynamically added resource hints that have served their purpose
        document.querySelectorAll('link[data-dynamic="true"]').forEach(link => {
            link.remove();
        });
    }
    
    function getCurrentSection() {
        // Find the section currently in viewport
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section');
        
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                return section;
            }
        }
        
        return null;
    }
    
    function prepareForAnimation(element) {
        // Apply will-change only right before animation
        element.style.willChange = 'transform, opacity';
        
        // Remove will-change after animation completes
        element.addEventListener('animationend', () => {
            element.style.willChange = 'auto';
        }, { once: true });
    }
    
    function loadNonCriticalCSS() {
        // Load non-critical CSS during idle time
        document.querySelectorAll('link[data-lazy-css]').forEach(link => {
            const href = link.getAttribute('data-lazy-css');
            link.setAttribute('href', href);
            link.removeAttribute('data-lazy-css');
        });
    }
    
    function initThirdPartyScripts() {
        // Initialize non-critical third-party scripts
        document.querySelectorAll('script[data-src]').forEach(script => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'data-src') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            newScript.src = script.getAttribute('data-src');
            script.parentNode.replaceChild(newScript, script);
        });
    }
    
    function prefetchLikelyDestinations() {
        // Prefetch pages the user is likely to visit
        const likelyLinks = document.querySelectorAll('a[data-prefetch]');
        
        likelyLinks.forEach(link => {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            prefetchLink.setAttribute('data-dynamic', 'true');
            document.head.appendChild(prefetchLink);
            
            link.removeAttribute('data-prefetch');
        });
    }
    
    function preconnectThirdPartyOrigins() {
        // Preconnect to third-party origins
        const origins = [
            'https://cdn.tailwindcss.com',
            'https://cdnjs.cloudflare.com'
        ];
        
        origins.forEach(origin => {
            if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = origin;
                link.setAttribute('data-dynamic', 'true');
                document.head.appendChild(link);
            }
        });
    }
    
    function loadHighResImages() {
        // Load high-resolution images for retina displays
        if (window.devicePixelRatio > 1 && !config.lowDataMode) {
            document.querySelectorAll('img[data-high-res]').forEach(img => {
                const highResSrc = img.getAttribute('data-high-res');
                img.setAttribute('src', highResSrc);
                img.removeAttribute('data-high-res');
            });
        }
    }
    
    function logLoadPerformance(element) {
        // Log performance metrics for debugging
        if (window.performance && window.performance.getEntriesByName) {
            if (element.tagName === 'IMG' && element.src) {
                const resources = performance.getEntriesByName(element.src);
                if (resources.length > 0) {
                    const loadTime = resources[0].responseEnd - resources[0].startTime;
                    console.debug(`Loaded ${element.src} in ${loadTime.toFixed(2)}ms`);
                }
            }
        }
    }
    
    function checkWebpSupport() {
        // Feature detection for WebP support
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }
    
    function checkAvifSupport() {
        // We'll assume no AVIF support for now
        // In a real implementation, you would use a more robust detection method
        return false;
    }
    
    function checkLowDataMode() {
        // Check if user has enabled data saving mode
        if (navigator.connection) {
            return navigator.connection.saveData;
        }
        return false;
    }
    
    // ======== Initialize Optimizations ========
    function initOptimizations() {
        // Initialize in order of priority
        initLazyLoading();
        optimizeFontLoading();
        initNetworkAwareLoading();
        
        // Slightly defer less critical optimizations
        setTimeout(() => {
            manageResourceHints();
            initContentVisibility();
            optimizeGSAPAnimations();
        }, 100);
        
        // Initialize idle time optimizations last
        setTimeout(() => {
            initIdleTimeOptimization();
        }, 500);
        
        // Register event listeners
        window.addEventListener('load', () => {
            // Run these after everything else has loaded
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    // Cleanup and final optimizations
                    removeUnusedCSS();
                });
            }
        });
    }
    
    function removeUnusedCSS() {
        // This is a placeholder for a more complex implementation
        // In a real-world scenario, you might use PurgeCSS or similar
        console.debug('Cleanup operations completed');
    }
    
    // Start the optimization process
    initOptimizations();
});
