document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const nextButtons = document.querySelectorAll('.next-button');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const responseMessage = document.getElementById('responseMessage');
    const backgroundMusic = document.getElementById('backgroundMusic');
    

    let currentCardIndex = 0;
    let currentYesScale = 1.0; // <-- YENİ EKLENECEK SATIR (1.0 = %100 boyut)
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
        yesButton.style.display = 'none';
        noButton.style.display = 'none';
    });

   noButton.addEventListener('click', (event) => {
        event.preventDefault();

        // --- YENİ KOD: 'Evet' BUTONUNU DA ÜST KATMANA TAŞI ---
        
        // 'Evet' butonunun 'position' stilini kontrol et
        if (yesButton.style.position !== 'absolute') {
            // Eğer 'absolute' değilse, bu 'Hayır'a ilk tıklamadır.
            
            // 1. 'Evet' butonunun ekrandaki mevcut konumunu al
            const yesRect = yesButton.getBoundingClientRect();

            // 2. 'Evet' butonunu da body'e taşı
            document.body.appendChild(yesButton);
            
            // 3. Konumunu 'absolute' yap ve z-index ile en üste al
            yesButton.style.position = 'absolute';
            yesButton.style.zIndex = '1000'; // 'Evet' butonu üstte
            
            // 4. Aldığımız konuma sabitle (böylece yerinden oynamaz)
            yesButton.style.top = yesRect.top + 'px';
            yesButton.style.left = yesRect.left + 'px';
            
            // 5. Büyümenin merkezden olmasını garantile
            yesButton.style.transformOrigin = 'center center';
        }
        // --- YENİ KOD BİTTİ ---


        // --- 'HAYIR' BUTONU IŞINLANMA KODU (Bu kısım zaten vardı) ---
        
        // 'Hayır' butonunu body'e taşı
        document.body.appendChild(noButton);
        noButton.style.position = 'absolute';
        noButton.style.zIndex = '1001'; // 'Hayır' butonu 'Evet'in de üstünde

        // ... (viewportWidth, randomX vb. hesaplamalar)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;
        const maxX = viewportWidth - buttonWidth;
        const maxY = viewportHeight - buttonHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // 'Hayır' butonunu ışınla
        noButton.style.left = randomX + 'px';
        noButton.style.top = randomY + 'px';
        
        
        // --- 'EVET' BUTONU BÜYÜTME KODU (Bu kısım da zaten vardı) ---
        
        // 'Evet' butonunun ölçeğini %20 (0.2) büyüt.
        currentYesScale += 0.6; 
        
        // Yeni ölçeği 'Evet' butonuna CSS 'transform' özelliği ile uygula.
        yesButton.style.transform = `scale(${currentYesScale})`;
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