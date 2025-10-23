// --- Değişkenler ve Ayarlar ---
const PARTICLE_COUNT = 30; // 15 ÇİZGİ = 30 NOKTA
const PARTICLE_SIZE = 3.0;
const PARTICLE_COLOR = "#FFFFFF";
const LINE_COLOR = "#FFFFFF";
const ANIMATION_DURATION = 3.0;

// Kalp iskeletinin (istasyonların) koordinatları (Elle girildi, Hata riski yok)
const heartVertices = [
    { x: 0, y: -45, z: 0 },   { x: -36, y: -10, z: 0 },  { x: -70, y: -25, z: 0 },
    { x: -84, y: -65, z: 0 },  { x: -70, y: -105, z: 0 }, { x: -36, y: -140, z: 0 },
    { x: 0, y: -195, z: 0 },  { x: 36, y: -140, z: 0 },  { x: 70, y: -105, z: 0 },
    { x: 84, y: -65, z: 0 },   { x: 70, y: -25, z: 0 },   { x: 36, y: -10, z: 0 }
]; 

// --- Global Değişkenler (Fonksiyonların erişmesi için) ---
let scene, camera, renderer;
let particleGeometry;
let particleMaterial, lineMaterial;
let particleSystem, lineMesh;
let initialPositions = [];
let targetPositions = [];
let canvas; // Canvas'ı burada tanımla, DOM yüklenince doldur

// ***********************************************
// *** EN ÖNEMLİ DÜZELTME BURADA ***
// Kodun çalışması için sayfanın yüklenmesini bekle
document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM yüklendi, artık canvas'ı güvenle bulabiliriz
    canvas = document.getElementById('scene-canvas');
    
    // Eğer canvas bulunamazsa, hata ver ve dur
    if (!canvas) {
        console.error("KRİTİK HATA: 'scene-canvas' elementi HTML'de bulunamadı.");
        return;
    }

    // 2. Animasyonu kur ve başlat
    initThreeJS();
    createGeometry();
    animate();
});
// *** DÜZELTME BİTTİ ***
// ***********************************************


// --- Ana Fonksiyonlar ---

// 2. Three.js Sahnesini Kur
function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250; 

    // 'canvas' değişkeni artık dolu olmalı (DOMContentLoaded sayesinde)
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 3. Geometriyi Oluştur (15 ÇİZGİYE ÖZEL)
function createGeometry() {
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3); // 30 * 3 = 90

    if (heartVertices.length === 0) {
        console.error("Hedef kalp iskeleti boş.");
        return; 
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) { // Sadece 30 kez döner
        // 1. Rastgele BAŞLANGIÇ pozisyonu
        const ix = (Math.random() - 0.5) * 1000;
        const iy = (Math.random() - 0.5) * 1000;
        const iz = (Math.random() - 0.5) * 1000;
        
        positions[i * 3] = ix;
        positions[i * 3 + 1] = iy;
        positions[i * 3 + 2] = iz;
        initialPositions.push({ x: ix, y: iy, z: iz });

        // 2. Rastgele HEDEF pozisyonu (Elle girilen 12 istasyondan biri)
        const targetIndex = Math.floor(Math.random() * heartVertices.length);
        const target = heartVertices[targetIndex];
        
        targetPositions.push({ x: target.x, y: target.y, z: target.z });
    }

    // Geometriye BAŞLANGIÇ pozisyonlarını yükle
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // --- Materyalleri Oluştur ---
    particleMaterial = new THREE.PointsMaterial({
        color: PARTICLE_COLOR,
        size: PARTICLE_SIZE,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    lineMaterial = new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    // --- Mesh'leri Oluştur ve Sahneye Ekle ---
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    lineMesh = new THREE.LineSegments(particleGeometry, lineMaterial);
    scene.add(lineMesh);
}

// 4. Animasyonu Başlat (GSAP ile) - (Bu fonksiyon script.js tarafından çağrılır)
function startAnimation() {
    // Geometri oluşturulmamışsa (bir hata olduysa) çalışmayı durdur
    if (!particleGeometry) {
        console.error("startAnimation çağrıldı ancak geometri hazır değil.");
        return;
    }
    
    const positions = particleGeometry.attributes.position; 
    let tempPos = {}; 

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        tempPos = {
            x: initialPositions[i].x,
            y: initialPositions[i].y,
            z: initialPositions[i].z
        };
        
        (function(index) {
            gsap.to(tempPos, {
                x: targetPositions[index].x,
                y: targetPositions[index].y,
                z: targetPositions[index].z,
                duration: ANIMATION_DURATION,
                delay: 0.5,
                ease: "power3.out",
                onUpdate: () => {
                    // Pozisyonları guncelle
                    positions.setXYZ(index, tempPos.x, tempPos.y, tempPos.z);
                    positions.needsUpdate = true; 
                }
            });
        })(i); 
    }
}

// 5. Render Döngüsü
function animate() {
    // renderer tanımsızsa (hata olduysa) döngüyü durdur
    if (!renderer) return;

    requestAnimationFrame(animate);

    // Oluşan kalbi yavaşça döndür
    if (particleSystem) {
         particleSystem.rotation.y += 0.003;
         lineMesh.rotation.y += 0.003;
    }

    renderer.render(scene, camera);
}