
const gameGrid = document.getElementById('game-grid');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const livesEl = document.getElementById('lives');
const winSound = document.getElementById('win-sound');
const failSound = document.getElementById('fail-sound');
const highScoreEl = document.getElementById('highscore');

let chances = 3;
let timer;
let interval;
let flipped = [], matched = [], symbols = [];

function shuffleSymbols() {
  const base = ['🍤','🥟','🍙','🍣','🍥','🍢','🍘','🍛'];
  symbols = base.concat(base).sort(() => 0.5 - Math.random());
}

function updateLives() {
  livesEl.classList.add('animate');
  livesEl.innerText = '❤️'.repeat(chances);
  setTimeout(() => livesEl.classList.remove('animate'), 300);
}

function getRemainingTime(timestamp) {
  const now = new Date().getTime();
  const distance = timestamp - now;
  if (distance <= 0) return null;
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return `${hours}j ${minutes}m ${seconds}d`;
}

function showCooldown(playedUntil) {
  const countdown = setInterval(() => {
    const remaining = getRemainingTime(playedUntil);
    if (!remaining) {
      clearInterval(countdown);
      location.reload();
    } else {
      resultEl.innerText = `⛔ Kamu sudah bermain hari ini. Coba lagi dalam ${remaining}`;
    }
  }, 1000);
}

function resetGame() {
  flipped = [];
  matched = [];
  timer = 30;
  gameGrid.innerHTML = '';
  shuffleSymbols();
  createGrid();
  updateLives();
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerEl.innerText = `Waktu: ${timer}`;
    if (timer <= 0) {
      clearInterval(interval);
      chances--;
      failSound.play();
      if (chances > 0) {
        updateLives();
        resultEl.innerText = `⏰ Waktu habis! Sisa nyawa: ${chances}. Main lagi!`;
        setTimeout(() => resetGame(), 1500);
      } else {
        const nextTime = new Date().getTime() + 24*60*60*1000;
        localStorage.setItem('playedUntil', nextTime);
        resultEl.innerText = '💀 Kesempatan habis! Coba lagi besok.';
        updateLives();
      }
    }
  }, 1000);
}

function createGrid() {
  symbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card', 'hidden');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerText = symbol;
    card.addEventListener('click', () => flipCard(card));
    gameGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (flipped.length >= 2 || matched.includes(card.dataset.index)) return;
  card.classList.remove('hidden');
  flipped.push(card);
  if (flipped.length === 2) {
    if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
      winSound.play();
      matched.push(flipped[0].dataset.index, flipped[1].dataset.index);
      flipped = [];
      if (matched.length === symbols.length) {
        clearInterval(interval);
        const nextTime = new Date().getTime() + 24*60*60*1000;
        localStorage.setItem('playedUntil', nextTime);
        resultEl.innerText = '🎉 Selamat!';
        showWinPopup();
        const score = 30 - timer;
        const best = localStorage.getItem('highScore') || 99;
        if (score < best) {
          localStorage.setItem('highScore', score);
          highScoreEl.innerText = score;
        }
      }
    } else {
      setTimeout(() => {
        flipped.forEach(card => card.classList.add('hidden'));
        flipped = [];
      }, 700);
    }
  }
}

function startGame() {
  const playedUntil = localStorage.getItem('playedUntil');
  if (playedUntil && new Date().getTime() < parseInt(playedUntil)) {
    showCooldown(parseInt(playedUntil));
    return;
  }
  const high = localStorage.getItem('highScore') || 0;
  highScoreEl.innerText = high;
  resetGame();
}

document.getElementById('playButton').addEventListener('click', () => {
  document.getElementById('playButton').style.display = 'none'; // sembunyikan tombol saat game dimulai
  startGame();
});


function generateDailyUniqueVoucher() {
  const today = new Date().toDateString();
  const saved = localStorage.getItem('todayVoucherCode');

  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) return data.code;
  }

  const randomCode = 'SVARGA-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  localStorage.setItem('todayVoucherCode', JSON.stringify({ date: today, code: randomCode }));
  return randomCode;
}

function showWinPopup() {
  const code = generateDailyUniqueVoucher();
  document.getElementById('voucherCode').innerText = `Kode Voucher: ${code}`;
  document.getElementById('popup').style.display = 'flex';
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function shareWhatsApp() {
  const code = document.getElementById('voucherCode').innerText.replace('Kode Voucher: ', '');
  const url = 'https://wa.me/?text=' + encodeURIComponent(`Saya baru saja menangin voucher ${code} dari game memory Svarga Dimsum! Yuk coba juga!`);
  window.open(url, '_blank');
}

function generateCodeFromDate(dateStr) {
  const salt = "SVARGA2025";
  let hash = 0;
  const str = salt + dateStr;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 'SVARGA-' + Math.abs(hash).toString(36).toUpperCase().substr(0, 6);
}

// Shortcut keyboard: Ctrl + Alt + V
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'v') {
    document.getElementById('adminButton').style.display = 'block';
  }
});

document.getElementById('adminButton').addEventListener('click', function() {
  document.getElementById('adminPopup').style.display = 'flex';
});

function validateCode() {
  const date = new Date(document.getElementById('checkDate').value);
  const code = document.getElementById('userCode').value.trim().toUpperCase();
  const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  const validCode = generateCodeFromDate(dateStr);
  const resultText = (code === validCode)
    ? "✅ Kode valid"
    : "❌ Kode tidak cocok";
  document.getElementById('validationResult').innerText = resultText;
}

