  function openPopup(menu) {
    document.getElementById("popupOrder").style.display = "flex";
    document.getElementById("popupTitle").textContent = menu;
  }

  function closePopup() {
    document.getElementById("popupOrder").style.display = "none";
  }

  function kirimPesanWA() {
    const menu = document.getElementById("popupTitle").textContent;
    const jumlah = document.getElementById("jumlah").value;
    const level = document.getElementById("level").value;
    const pesan = `Halo, saya ingin pesan ${menu} (Isi: ${jumlah}, Pedas: ${level})`;
    window.open(`https://wa.me/6285213963005?text=${encodeURIComponent(pesan)}`, '_blank');
  }