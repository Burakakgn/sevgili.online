// Sayfanın tamamen yüklendiğinden emin ol
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. TÜM ELEMENTLERİ SEÇME ---
    const questionText = document.getElementById('question-text');
    const questionOptions = document.getElementById('question-options');
    const originalQuestionText = questionText.innerText; // "Benimle sevgili olur musun?" yazısını sakla
    // Ana elementler
    const mainTitle = document.getElementById('mainTitle');
    const letterContainer = document.getElementById('letter');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Mektup Elementleri (Yeni "X" Yapısı)
    // Prompt'ları sırayla bir diziye alıyoruz
const prompts = [
    document.getElementById('prompt-1'), // 0. element
    document.getElementById('prompt-2'), // 1. element
    document.getElementById('prompt-3'), // 2. element
    document.getElementById('prompt-4')  // 3. element
];
    const flaps = {
        top: document.getElementById('flap-top'),
        right: document.getElementById('flap-right'),
        bottom: document.getElementById('flap-bottom'),
        left: document.getElementById('flap-left')
    };

    // Final elementleri
    const finalQuestion = document.getElementById('finalQuestion');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const responseMessage = document.getElementById('responseMessage');

    // --- 2. DURUM DEĞİŞKENLERİ ---
    let musicPlayed = false; 
    let clickCounter = 0; // Bu, kaçıncı prompt'ta olduğumuzu sayacak
    let currentYesScale = 1.0; 
    // Tıklanan bölümleri takip etmek için yeni obje
    const clickedSections = {
        top: false,
        right: false,
        bottom: false,
        left: false
    };

    
    // --- 3. OLAY DİNLEYİCİLERİ ---

   /// OLAY 1: KAPAKLARA Tıklama (Yeni Sıralı Mantık)
    
    flaps.top.addEventListener('click', () => {
        // Bu kapağa zaten tıklandıysa VEYA 4 yazı da bittiyse, bir şey yapma
        if (clickedSections.top || clickCounter >= 4) return; 
        
        clickedSections.top = true; // Bu kapağı "tıklandı" olarak işaretle
        flaps.top.classList.add('open-top'); // Kapağı aç

        // 1. Sıradaki yazıyı sayaçtan al
        const currentPrompt = prompts[clickCounter];
        // 2. Bu kapağın animasyonunu (slide-up) o yazıya ver
        currentPrompt.classList.add('slide-up');
        // 3. Sayacı bir sonraki yazı için artır
        clickCounter++;
        
        playMusicIfNeeded();
        checkAllClicked();
    });

    flaps.right.addEventListener('click', () => {
        if (clickedSections.right || clickCounter >= 4) return; 
        
        clickedSections.right = true;
        flaps.right.classList.add('open-right'); 

        const currentPrompt = prompts[clickCounter];
        currentPrompt.classList.add('slide-right'); // Animasyon yönü değişti
        clickCounter++;
        
        playMusicIfNeeded();
        checkAllClicked();
    });

    flaps.bottom.addEventListener('click', () => {
        if (clickedSections.bottom || clickCounter >= 4) return; 
        
        clickedSections.bottom = true;
        flaps.bottom.classList.add('open-bottom'); 

        const currentPrompt = prompts[clickCounter];
        currentPrompt.classList.add('slide-bottom'); // Animasyon yönü değişti
        clickCounter++;
        
        playMusicIfNeeded();
        checkAllClicked();
    });

    flaps.left.addEventListener('click', () => {
        if (clickedSections.left || clickCounter >= 4) return; 
        
        clickedSections.left = true;
        flaps.left.classList.add('open-left'); 

        const currentPrompt = prompts[clickCounter];
        currentPrompt.classList.add('slide-left'); // Animasyon yönü değişti
        clickCounter++;
        
        playMusicIfNeeded();
        checkAllClicked();
    });
    // OLAY 2: "EVET" Butonu (3D ANİMASYONLA GÜNCELLENDİ)
    yesButton.addEventListener('click', () => {
        
        // 1. Tüm mevcut elementleri gizle (butonlar, soru, mesaj vb.)
        yesButton.classList.add('hidden');
        noButton.classList.add('hidden');
        finalQuestion.classList.add('hidden');
        responseMessage.classList.add('hidden'); // Eski mesajı da gizlediğimizden emin ol

        // 2. Arka planı siyaha çevir (Animasyonla tam uyumlu olsun)
        document.body.style.background = '#000';

        // 3. 3D Animasyon Canvas'ını bul ve görünür yap
        // (CSS'de display: none idi, şimdi block yapıyoruz)
        const animasyonCanvas = document.getElementById('scene-canvas');
        animasyonCanvas.style.display = 'block';

        // 4. Animasyonu BAŞLAT! 
        // (Bu 'startAnimation' fonksiyonu 'particle-animation.js' dosyasından geliyor)
        startAnimation();

        // 5. Müziğin sesini biraz kıs (Bu satır sende zaten vardı, güzel detay)
        backgroundMusic.volume = 0.5; 
    });

    // OLAY 3: Kullanıcı "HAYIR" butonuna tıklar (Çakışma Engelli)
    // OLAY 3: Kullanıcı "HAYIR" butonuna tıklar (Basit, Döngüsüz, Çalışan Kod)
    noButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        // --- "Evet" Butonunu Üst Katmana Taşıma (Sadece 1 kez yapılır) ---
        if (yesButton.style.position !== 'absolute') {
            const yesRect = yesButton.getBoundingClientRect(); 
            document.body.appendChild(yesButton); 
            yesButton.style.position = 'absolute';
            yesButton.style.zIndex = '1000'; // Evet = Katman 1000
            yesButton.style.top = `${yesRect.top}px`; 
            yesButton.style.left = `${yesRect.left}px`;
            yesButton.style.transformOrigin = 'center center'; 
        }

        // --- "Hayır" Butonunu Üst Katmana Taşıma ---
        document.body.appendChild(noButton); 
        noButton.style.position = 'absolute';
        noButton.style.zIndex = '999'; // Hayır = Katman 1001 (DAİMA ÜSTTE)

        // --- BASİT IŞINLANMA KODU (DÖNGÜSÜZ) ---
        
        // Ekranın sınırlarını öğren
        const noWidth = noButton.offsetWidth;
        const noHeight = noButton.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxX = viewportWidth - noWidth;
        const maxY = viewportHeight - noHeight;

        // Rastgele bir yer seç
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // "Hayır" butonunu ışınla (Çakışmayı KONTROL ETME!)
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
        
        // --- "Evet" Butonunu Büyütme Kodu ---
        currentYesScale += 0.5; 
        yesButton.style.transform = `scale(${currentYesScale})`;
    });

    
    // --- 4. YARDIMCI FONKSİYONLAR ---

    function playMusicIfNeeded() {
        if (!musicPlayed) {
            backgroundMusic.play().catch(e => console.error("Müzik çalma hatası:", e));
            musicPlayed = true;
        }
    }

   function checkAllClicked() {
    // Sadece sayacı kontrol et:
    const allClicked = (clickCounter === 4); 
    
    if (allClicked) {
        setTimeout(() => {
    mainTitle.classList.add('hidden'); // Başlığı (anında) gizle

    // 1. Mektuba "sol" komutunu ver (animasyon başlasın)
    letterContainer.classList.add('mektup-kayboluyor');

    // 2. Final sorusunu göster (mektup solarken bu belirecek)
    finalQuestion.classList.remove('hidden'); 
    startTypewriter();
    // 3. (YENİ) Animasyon bittikten sonra mektubu tamamen yok et
    

}, 1500); // 1.5 saniye bekleme süresi 
    }
}
// YENİ FONKSİYON: Typewriter
function startTypewriter() {
    // Soru metnini anında boşalt
    questionText.textContent = '';

    let i = 0; // Sayaç
    const speed = 100; // Yazma hızı (milisaniye)

    // Belirli aralıklarla çalışacak bir zamanlayıcı başlat
    const typingInterval = setInterval(() => {
        if (i < originalQuestionText.length) {
            // Metne bir sonraki harfi ekle
            questionText.textContent += originalQuestionText.charAt(i);
            i++;
        } else {
            // Yazma bitti, zamanlayıcıyı durdur
            clearInterval(typingInterval);

            // CSS'teki .show sınıfını ekleyerek butonları göster
            questionOptions.classList.add('show');
        }
    }, speed);
}
});
