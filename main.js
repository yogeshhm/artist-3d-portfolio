/**
 * AuraArt Studio - Main Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 3D Card Tilt Physics Effect
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12; // deg
            const rotateY = ((x - centerX) / centerX) * 12;  // deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 2. Navbar Scroll Class Toggle
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(7,8,13,0.95)';
                navLinks.style.padding = '1.5rem';
                navLinks.style.backdropFilter = 'blur(20px)';
            }
        });
    }

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

    // 5. Commission Cost Calculator Logic
    const serviceSelect = document.getElementById('service-type');
    const sizeSelect = document.getElementById('art-size');
    const subjectsInput = document.getElementById('subjects-count');
    const priceDisplay = document.getElementById('calc-price');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');

    // Base rates matrix ($ USD equivalent)
    const serviceRates = {
        pencil: 50,
        watercolor: 80,
        acrylic: 150,
        ghibli: 90,
        thread: 180,
        wall: 250,
        video: 120
    };

    const sizeMultipliers = {
        a4: 1.0,
        a3: 1.5,
        canvas: 2.2,
        mural: 3.5,
        reel: 1.2
    };

    function updatePrice() {
        if (!serviceSelect || !sizeSelect || !subjectsInput || !priceDisplay) return;

        const service = serviceSelect.value;
        const size = sizeSelect.value;
        const subjects = parseInt(subjectsInput.value) || 1;

        const basePrice = serviceRates[service] || 80;
        const multiplier = sizeMultipliers[size] || 1.0;
        const subjectExtra = (subjects - 1) * 25;

        const totalPrice = Math.round((basePrice * multiplier) + subjectExtra);

        priceDisplay.textContent = `$${totalPrice}`;

        // Update WhatsApp pre-filled order text
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        const sizeName = sizeSelect.options[sizeSelect.selectedIndex].text;
        
        const message = encodeURIComponent(
            `Hi AuraArt Studio! I would like to commission an artwork:\n` +
            `• Service: ${serviceName}\n` +
            `• Size: ${sizeName}\n` +
            `• Subjects: ${subjects}\n` +
            `• Estimated Price: $${totalPrice}\n\n` +
            `Can we discuss details and reference photos?`
        );

        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/?text=${message}`;
        }
    }

    if (serviceSelect && sizeSelect && subjectsInput) {
        serviceSelect.addEventListener('change', updatePrice);
        sizeSelect.addEventListener('change', updatePrice);
        subjectsInput.addEventListener('input', updatePrice);
        updatePrice(); // initial call
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
                modalDesc.textContent = desc || 'Custom commissioned masterpiece handcrafted by AuraArt Studio.';
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
