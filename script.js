
        const cards = document.querySelectorAll('.card');
        const reflections = document.querySelectorAll('.reflection');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const playBtn = document.getElementById('playBtn');
        
        let currentIndex = 0;
        let autoPlayInterval = null;
        let isAutoPlaying = false;

        const phoneNumbers = [
            '+999 4701 1342',
            '+999 1510 224',
            '+999 6698 0692'
        ];

        function updateCarousel() {
            cards.forEach((card, index) => {
                const cardIndex = parseInt(card.dataset.index);
                const reflection = reflections[index];
                
                // Remove all classes
                card.classList.remove('active', 'prev', 'next');
                reflection.classList.remove('active', 'prev', 'next');
                card.style.display = 'flex';
                reflection.style.display = 'block';
                
                // Calculate positions
                let position = cardIndex - currentIndex;
                if (position < 0) position += cards.length;
                if (position >= cards.length) position -= cards.length;
                
                // Set classes based on position
                if (position === 0) {
                    card.classList.add('active');
                    reflection.classList.add('active');
                } else if (position === 1) {
                    card.classList.add('next');
                    reflection.classList.add('next');
                } else if (position === cards.length - 1) {
                    card.classList.add('prev');
                    reflection.classList.add('prev');
                } else {
                    card.style.display = 'none';
                    reflection.style.display = 'none';
                }
            });

            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function toggleAutoPlay() {
            if (isAutoPlaying) {
                clearInterval(autoPlayInterval);
                isAutoPlaying = false;
                playBtn.classList.remove('playing');
                playBtn.innerHTML = `
                    <svg class="play-icon" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
            } else {
                autoPlayInterval = setInterval(nextSlide, 4000);
                isAutoPlaying = true;
                playBtn.classList.add('playing');
                playBtn.innerHTML = `
                    <svg class="play-icon" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                `;
            }
        }

        // Event Listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        playBtn.addEventListener('click', toggleAutoPlay);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                toggleAutoPlay();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselWrapper = document.querySelector('.carousel-wrapper');
        carouselWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide();
            }
        }

        // Initialize
        updateCarousel();

        // Scroll to Top Functionality
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
   