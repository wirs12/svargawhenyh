let index = 0;
let isAnimating = false;
let animationFinished = false;

const images = ['img/dimsum_ori.png', 'img/Dumpling.png', 'img/dimsum_mentai.png'];
const productNames = ['Dimsum Ori', 'Dumpling Ayam', 'Dimsum Mentai'];

const mainImage = document.getElementById('main-image');
const thumbnails = document.querySelectorAll('.preview-thumbs img');
const productName = document.getElementById('product-name');
const audio = document.getElementById('intro-audio');
const preloader = document.querySelector('.preloader');

// Start animation after preloader
function startGSAPAnimation() {
  gsap.from("nav", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  gsap.from(".hero-content h1", {
    opacity: 0,
    x: -50,
    duration: 1,
    delay: 0.3,
    ease: "power2.out"
  });

  gsap.from(".hero-content p", {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.6,
    ease: "power2.out"
  });

  gsap.from("#product-name", {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    delay: 1,
    ease: "back.out(1.7)"
  });

  gsap.from(".hero-content .btn", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
    ease: "power2.out"
  });

  gsap.fromTo(mainImage, {
    opacity: 0,
    scale: 0.9,
    y: 20
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.2,
    delay: 1.5,
    ease: "power2.out"
  });

  thumbnails.forEach((thumb, i) => {
    gsap.fromTo(thumb, {
      opacity: 0,
      scale: 0.8,
      y: 15
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      delay: 1.7 + i * 0.2,
      ease: "power2.out"
    });
  });

  gsap.from(".btn-rspnsv", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    delay: 2.4,
    ease: "power2.out",
    onComplete: () => {
      animationFinished = true; // ✅ Flag bahwa animasi awal sudah selesai
    }
  });
}

function removePreloader() {
  document.body.classList.add('loaded');
  if (preloader) preloader.remove();
  startGSAPAnimation();
}

window.addEventListener('load', () => {
  if (audio) {
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }

  const timeout = setTimeout(removePreloader, 5500);
  document.addEventListener('click', () => {
    clearTimeout(timeout);
    removePreloader();
  }, { once: true });
});

// ========== Pergantian gambar ========== //
function changeImage(idx) {
  if (isAnimating || !animationFinished || idx === index) return;
  isAnimating = true;

  const newImg = new Image();
  newImg.src = images[idx];

  newImg.onload = () => {
    gsap.to(mainImage, {
      rotate: 360,
      opacity: 0,
      scale: 0.6,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        mainImage.src = newImg.src;
        productName.textContent = productNames[idx];

        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[idx].classList.add('active');

        gsap.fromTo(mainImage, {
          rotate: -180,
          opacity: 0,
          scale: 0.6
        }, {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            index = idx;
            isAnimating = false;
          }
        });
      }
    });
  };
}

function manualChangeImage(el, idx) {
  changeImage(idx);
}

setInterval(() => {
  if (!animationFinished) return;
  const nextIdx = (index + 1) % images.length;
  changeImage(nextIdx);
}, 6000);
// Gambar dimsum rotate saat scroll
window.addEventListener('scroll', () => {
  const image = document.getElementById('main-image');
  const scrollY = window.scrollY;
  
  // Rotasi berdasarkan posisi scroll (ubah - sesuai kebutuhan)
  const rotateValue = scrollY * 0.15; // bisa dikurangi kalau terlalu cepat
  
  image.style.transform = `rotate(${rotateValue}deg)`;

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});
