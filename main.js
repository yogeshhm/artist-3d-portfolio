/**
 * ArtKid Studio - Main Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 3D Card Tilt Physics Effect (Only on devices that support hover / mouse)
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    if (isHoverDevice) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // deg
                const rotateY = ((x - centerX) / centerX) * 10;  // deg

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // 2. Navbar Scroll Class Toggle
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Drawer Navigation Controller
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link, #mobile-nav-order-btn');

    function openMobileMenu() {
        if (navLinks) navLinks.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scrolling while drawer is open
    }

    function closeMobileMenu() {
        if (navLinks) navLinks.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

    navItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });

    // 4. Portfolio Gallery Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Multi-Currency Custom Art Price Calculator Engine (Exact Pricing from Artist Notebook)
    const currencySelect = document.getElementById('currency-type');
    const serviceSelect = document.getElementById('service-type');
    const portraitTypeSelect = document.getElementById('portrait-type');
    const sizeSelect = document.getElementById('art-size');
    const priceDisplay = document.getElementById('calc-price');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');

    // Exact Pricing Lookup Table (Pencil & Color Pencil: A4, A3, A2)
    const pricingTable = {
        INR: {
            symbol: '₹',
            format: (val) => '₹' + val.toLocaleString('en-IN'),
            pencil: {
                a4: { single: 1000, double: 1700, pet: 1000, family: 2800 },
                a3: { single: 1800, double: 2500, pet: 1800, family: 4000 },
                a2: { single: 6000, double: 7500, pet: 6000, family: 9000 }
            },
            color_pencil: {
                a4: { single: 2500, double: 3300, pet: 2500, family: 4500 },
                a3: { single: 4000, double: 5100, pet: 4000, family: 6500 },
                a2: { single: 8000, double: 10000, pet: 8000, family: 12500 }
            }
        },
        USD: {
            symbol: '$',
            format: (val) => '$' + val.toLocaleString('en-US'),
            pencil: {
                a4: { single: 20, double: 35, pet: 20, family: 55 },
                a3: { single: 35, double: 50, pet: 35, family: 75 },
                a2: { single: 110, double: 140, pet: 110, family: 170 }
            },
            color_pencil: {
                a4: { single: 50, double: 65, pet: 50, family: 90 },
                a3: { single: 75, double: 95, pet: 75, family: 125 },
                a2: { single: 150, double: 190, pet: 150, family: 240 }
            }
        }
    };

    // Auto-detect country (India -> INR, International -> USD)
    function detectDefaultCurrency() {
        try {
            const timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
            const locale = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (timeZone.includes('calcutta') || timeZone.includes('kolkata') || timeZone.includes('asia/colombo') || locale.includes('in')) {
                return 'INR';
            }
        } catch (e) {}
        return 'USD';
    }

    // Set initial detected currency
    if (currencySelect) {
        const detected = detectDefaultCurrency();
        currencySelect.value = detected;
    }

    function updatePrice() {
        if (!serviceSelect || !sizeSelect || !priceDisplay) return;

        const currKey = (currencySelect ? currencySelect.value : 'INR') || 'INR';
        const curr = pricingTable[currKey] || pricingTable.INR;

        const service = serviceSelect.value;
        const size = sizeSelect.value;
        const pType = portraitTypeSelect ? portraitTypeSelect.value : 'single';

        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        const sizeName = sizeSelect.options[sizeSelect.selectedIndex].text;
        const typeName = portraitTypeSelect ? portraitTypeSelect.options[portraitTypeSelect.selectedIndex].text : 'Single Portrait';

        // Check if this combination has an exact fixed price in the table
        const serviceRates = curr[service];
        const hasExactRate = serviceRates && serviceRates[size] && (serviceRates[size][pType] !== undefined);

        if (hasExactRate) {
            const exactPrice = serviceRates[size][pType];
            priceDisplay.textContent = curr.format(exactPrice);

            if (whatsappBtn) {
                whatsappBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Book Order on WhatsApp`;
                const message = encodeURIComponent(
                    `Hi ArtKid Studio! I would like to order a custom artwork:\n` +
                    `• Service: ${serviceName}\n` +
                    `• Type: ${typeName}\n` +
                    `• Size: ${sizeName}\n` +
                    `• Total Price: ${curr.format(exactPrice)}\n` +
                    `• 50% Advance Booking • Free Insured Delivery Included\n\n` +
                    `Can we discuss details and reference photos?`
                );
                whatsappBtn.href = `https://wa.me/?text=${message}`;
            }
        } else {
            // Other services, custom sizes, murals, or custom portraits -> Direct WhatsApp Quote
            priceDisplay.textContent = 'Custom Quote';

            if (whatsappBtn) {
                whatsappBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp for Quote`;
                const customMsg = encodeURIComponent(
                    `Hi ArtKid Studio! I would like to get a quote for a custom project:\n` +
                    `• Service: ${serviceName}\n` +
                    `• Type: ${typeName}\n` +
                    `• Size: ${sizeName}\n\n` +
                    `Can you provide a custom quote and discuss details?`
                );
                whatsappBtn.href = `https://wa.me/?text=${customMsg}`;
            }
        }
    }

    if (serviceSelect && sizeSelect) {
        if (currencySelect) currencySelect.addEventListener('change', updatePrice);
        if (portraitTypeSelect) portraitTypeSelect.addEventListener('change', updatePrice);
        serviceSelect.addEventListener('change', updatePrice);
        sizeSelect.addEventListener('change', updatePrice);
        updatePrice(); // initial calculation
    }

    // 6. Lightbox Modal Inspector
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-img');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');

            if (modal && modalImg && modalTitle && modalDesc) {
                modalImg.src = imgSrc;
                modalTitle.textContent = title || 'Artwork Showcase';
                modalDesc.textContent = desc || 'Custom handcrafted masterpiece made by ArtKid Studio.';
                modal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // 7. Interactive Reel Play Button Simulation
    const playReelBtn = document.getElementById('play-reel-btn');
    if (playReelBtn) {
        playReelBtn.addEventListener('click', () => {
            const playOverlay = playReelBtn.parentElement;
            playOverlay.style.opacity = '0';
            playOverlay.style.pointerEvents = 'none';

            // Pulse effect & message
            const bottomText = document.querySelector('.reel-caption');
            if (bottomText) {
                bottomText.innerHTML = "▶️ <strong>Playing Reel Preview...</strong> (Speed painting Ghibli anime landscape)";
            }
        });
    }
});
