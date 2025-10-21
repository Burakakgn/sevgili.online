document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const nextButtons = document.querySelectorAll('.next-button');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const responseMessage = document.getElementById('responseMessage');
    const backgroundMusic = document.getElementById('backgroundMusic');

    let currentCardIndex = 0;

    // İlk kartı göster (HTML'de hidden class'ı olmadığından zaten görünecek)
    // İlk kartın butonu için olay dinleyicisi ekle
    if (nextButtons.length > 0) {
        nextButtons[0].addEventListener('click', () => {
            showNextCard();
            // Kullanıcı ilk kez etkileşimde bulunduğunda müziği başlat
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.error("Müzik çalma hatası:", e));
            }
        });
    }

    // Diğer "Devam Et" butonları için olay dinleyicileri
    for (let i = 1; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener('click', showNextCard);
    }

    yesButton.addEventListener('click', () => {
        responseMessage.innerHTML = "🎉İyi ki varsın 🎉";
        responseMessage.classList.remove('hidden');
        responseMessage.classList.add('visible');
        hideAllCardsExceptMessage();
        backgroundMusic.volume = 0.5; // Müziğin sesini kıs
    });

   noButton.addEventListener('click', (event) => {
        event.preventDefault();

        // --- YENİ EKLENEN SATIR ---
        // Butonu .container'ın dışına, doğrudan body'e taşıyoruz.
        // Bu, onu 'overflow: hidden' kısıtlamasından kurtarır.
        document.body.appendChild(noButton);
        // --- BİTTİ ---

        // 1. Butonun konumlandırmasını 'absolute' yapıyoruz.
        noButton.style.position = 'absolute';

        // 2. Tarayıcı penceresinin (görünen alanın) genişliğini ve yüksekliğini alıyoruz.
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 3. Butonun kendi genişliğini ve yüksekliğini alıyoruz.
        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;

        // 4. Butonun gidebileceği maksimum X ve Y koordinatlarını hesaplıyoruz.
        const maxX = viewportWidth - buttonWidth;
        const maxY = viewportHeight - buttonHeight;

        // 5. 0 ile maksimum değerler arasında rastgele X (left) ve Y (top) değerleri üretiyoruz.
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // 6. Butonu bu rastgele koordinatlara "ışınlıyoruz".
        noButton.style.left = randomX + 'px';
        noButton.style.top = randomY + 'px';
    });

    function showNextCard() {
        if (currentCardIndex < cards.length) {
            // Mevcut kartı gizle
            cards[currentCardIndex].classList.add('hidden');

            currentCardIndex++;

            // Bir sonraki kartı göster
            if (currentCardIndex < cards.length) {
                cards[currentCardIndex].classList.remove('hidden');
            }
        }
    }

    function hideAllCardsExceptMessage() {
        cards.forEach(card => {
            card.classList.add('hidden');
        });
        document.querySelector('h1').classList.add('hidden'); // Başlığı da gizle
    }
});