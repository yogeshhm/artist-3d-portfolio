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

    // 5. Multi-Currency Custom Art Price Calculator Engine
    const currencySelect = document.getElementById('currency-type');
    const serviceSelect = document.getElementById('service-type');
    const portraitTypeSelect = document.getElementById('portrait-type');
    const sizeSelect = document.getElementById('art-size');
    const priceDisplay = document.getElementById('calc-price');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');

    // Multi-Currency Rates & Formats (Accurate Fixed Pricing)
    const currencyConfig = {
        INR: {
            symbol: '₹',
            code: 'INR',
            baseRates: {
                pencil: 2499,
                color_pencil: 3499,
                watercolor: 4999,
                acrylic: 8999,
                ghibli: 3999,
                thread: 9999,
                wall: 14999,
                gifts_comics: 3999,
                video: 4499
            },
            subjectRate: 999,
            format: (val) => '₹' + val.toLocaleString('en-IN')
        },
        USD: {
            symbol: '$',
            code: 'USD',
            baseRates: {
                pencil: 65,
                color_pencil: 90,
                watercolor: 120,
                acrylic: 220,
                ghibli: 95,
                thread: 250,
                wall: 380,
                gifts_comics: 95,
                video: 125
            },
            subjectRate: 25,
            format: (val) => '$' + val.toLocaleString('en-US')
        }
    };

    const sizeMultipliers = {
        a4: 1.0,
        a3: 1.5,
        canvas: 2.2,
        mural: 3.5,
        reel: 1.2
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
        const curr = currencyConfig[currKey] || currencyConfig.INR;

        const service = serviceSelect.value;
        const size = sizeSelect.value;
        
        let subjectsCount = 1;
        if (portraitTypeSelect) {
            const pVal = portraitTypeSelect.value;
            subjectsCount = (pVal === 'pet') ? 1 : (parseInt(pVal) || 1);
        }

        const isCustom = (service === 'custom_service' || size === 'custom_size' || (portraitTypeSelect && portraitTypeSelect.value === 'custom_portrait'));

        if (isCustom) {
            priceDisplay.textContent = 'Custom Quote';

            const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
            const sizeName = sizeSelect.options[sizeSelect.selectedIndex].text;
            const typeName = portraitTypeSelect ? portraitTypeSelect.options[portraitTypeSelect.selectedIndex].text : `${subjectsCount} Subject(s)`;

            const customMsg = encodeURIComponent(
                `Hi ArtKid Studio! I have a custom artwork project requirement:\n` +
                `• Service: ${serviceName}\n` +
                `• Type: ${typeName}\n` +
                `• Size: ${sizeName}\n\n` +
                `Can you provide a custom quote and discuss details?`
            );

            if (whatsappBtn) {
                whatsappBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Get Custom Quote on WhatsApp`;
                whatsappBtn.href = `https://wa.me/?text=${customMsg}`;
            }
            return;
        }

        const basePrice = curr.baseRates[service] || (currKey === 'INR' ? 4999 : 120);
        const multiplier = sizeMultipliers[size] || 1.0;
        const subjectExtra = Math.max(0, subjectsCount - 1) * curr.subjectRate;

        const totalPrice = Math.round((basePrice * multiplier) + subjectExtra);

        priceDisplay.textContent = curr.format(totalPrice);

        if (whatsappBtn) {
            whatsappBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Book Order on WhatsApp`;
        }

        // Update WhatsApp pre-filled order text
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        const sizeName = sizeSelect.options[sizeSelect.selectedIndex].text;
        const typeName = portraitTypeSelect ? portraitTypeSelect.options[portraitTypeSelect.selectedIndex].text : `${subjectsCount} Subject(s)`;
        
        const message = encodeURIComponent(
            `Hi ArtKid Studio! I would like to order a custom artwork:\n` +
            `• Service: ${serviceName}\n` +
            `• Type: ${typeName}\n` +
            `• Size: ${sizeName}\n` +
            `• Total Price: ${curr.format(totalPrice)}\n` +
            `• Free Insured Delivery Included\n\n` +
            `Can we discuss details and reference photos?`
        );

        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/?text=${message}`;
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
