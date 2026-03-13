/*====================================================
   Một Sản Phẩm Của Chú Rể - Nguyễn Tiến
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   HELPER
===================================================== */
const $ = (id) => document.getElementById(id);
const qs = (s) => document.querySelector(s);

/* =====================================================
   Đóng / Mở Thiệp
===================================================== */
/*window.addEventListener("load",()=>{
  const door = document.querySelector(".intro-door");
  // delay để nhìn thấy cửa trước
  setTimeout(()=>{
    door.classList.add("open");
  },1500);
  setTimeout(()=>{
    door.style.display="none";
  },3200);
});*/

window.addEventListener("load",()=>{
  // hiện trang
  document.body.classList.add("ready");
  // mở cửa
  setTimeout(()=>{
    document.querySelector(".intro-door").classList.add("open");
  },800);
  // sau khi mở xong
  setTimeout(()=>{
    document.querySelector(".intro-door").style.display="none";
    startAutoScroll(); // ⭐ bắt đầu cuộn
  },2600);
});

// khóa scroll
  /*document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");*/
  
/*document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    window.scrollTo(0,0);*/
    
/* ===============================
   LOAD ẢNH TỰ ĐỘNG + RANDOM
================================ */

const folder = "assets/images/anhcuoi/";
let images = [];

/* containers */

const gallery = document.getElementById("gallery");
const inviteBox = document.getElementById("invite-images");

/* kiểm tra ảnh tồn tại */

function checkImage(url) {
  return new Promise(resolve => {

    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

  });
}

/* load toàn bộ ảnh a1 a2 a3 ... */

async function loadImages() {

  let index = 1;

  while (true) {

    let found = false;

    for (let ext of ["jpg","png","jpeg","webp"]) {

      const url = `${folder}a${index}.${ext}`;

      if (await checkImage(url)) {
        images.push(url);
        found = true;
        break;
      }

    }

    if (!found) break;

    index++;

  }

  shuffleArray(images);

  renderGallery();
  renderInviteImages();

}

/* random ảnh */

function shuffleArray(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];

  }

}

/* ===============================
   GALLERY 4 ẢNH
================================ */

function renderGallery() {

  if (!gallery) return;

  gallery.innerHTML = "";

  if (images.length === 0) {

    gallery.innerHTML = "<p style='opacity:.6'>Chưa có ảnh</p>";
    return;

  }

  images.slice(0,4).forEach((src,index)=>{

    const div = document.createElement("div");
    div.className = "gallery-item";

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";

    div.appendChild(img);
    div.addEventListener("click", () => openLightbox(index));
    
    if (index === 3 && images.length > 4) {

      const overlay = document.createElement("div");
      overlay.className = "more-overlay";
      overlay.innerText = "+" + (images.length - 4);

      div.appendChild(overlay);

    }

    gallery.appendChild(div);

  });

}

/* ===============================
   3 ẢNH TRÂN TRỌNG KÍNH MỜI
================================ */

function renderInviteImages(){

  if (!inviteBox) return;

  inviteBox.innerHTML = "";

  if(images.length < 3) return;

  const inviteImages = [...images].sort(() => 0.5 - Math.random()).slice(0,3);

  inviteImages.forEach(src=>{

    const div = document.createElement("div");
    div.className = "invite-img";

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";

    div.appendChild(img);
    inviteBox.appendChild(div);

  });

}

/* =============================== */

loadImages();

/* =====================================================
   LIGHTBOX
===================================================== */
const lightbox = $("lightbox");
const lightboxImg = $("lightboxImg");
const counter = $("counter");

let currentIndex = 0;
let scale = 1;
let startX = 0;
let initialDistance = 0;

function openLightbox(index) {
  if (images.length === 0) return;

  currentIndex = index;
  updateImage();
  lightbox?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox?.classList.remove("active");
  document.body.style.overflow = "auto";
  resetZoom();
}

function updateImage() {
  if (!lightboxImg) return;

  lightboxImg.style.opacity = 0;

  setTimeout(() => {
    lightboxImg.src = images[currentIndex];
    if (counter) counter.innerText = `${currentIndex + 1}/${images.length}`;
    lightboxImg.style.opacity = 1;
  }, 150);
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  resetZoom();
  updateImage();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  resetZoom();
  updateImage();
}

function resetZoom() {
  scale = 1;
  lightboxImg && (lightboxImg.style.transform = "scale(1)");
}

function getDistance(t) {
  const dx = t[0].clientX - t[1].clientX;
  const dy = t[0].clientY - t[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

$("closeBtn")?.addEventListener("click", closeLightbox);
$("next")?.addEventListener("click", showNext);
$("prev")?.addEventListener("click", showPrev);

lightbox?.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches);
  }
});

lightbox?.addEventListener("touchmove", e => {
  if (e.touches.length === 2) {
    scale = getDistance(e.touches) / initialDistance;
    lightboxImg.style.transform = `scale(${scale})`;
  }
});

lightbox?.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (Math.abs(endX - startX) > 50) {
    endX > startX ? showPrev() : showNext();
  }
});

/* =====================================================
   TOAST
===================================================== */
const thankToast = document.createElement("div");
thankToast.className = "thank-toast";
thankToast.innerHTML = "💌 Cảm ơn bạn đã gửi lời chúc!";
document.body.appendChild(thankToast);

function showToast() {
  thankToast.classList.add("show");
  setTimeout(() => thankToast.classList.remove("show"), 2500);
}

/* =====================================================
   GUESTBOOK
===================================================== */
const API_URL = "https://script.google.com/macros/s/AKfycbyTXN6-H0Cv55ERTCijKar9YwB08Tf179wNjtRCcN_TX2fzJ1umpSCzQ-QzkLz8cwXq/exec";

// ===============================
// DOM
// ===============================
const wishList = document.getElementById("wishList");
const wishTotal = document.getElementById("wishTotal");
const nameInput = document.getElementById("guestName");
const sideInput = document.getElementById("guestSide"); // ⭐ nhà trai / nhà gái
const messageInput = document.getElementById("guestMessage");

// Lấy lựa chọn đã lưu
const savedSide = localStorage.getItem("guestSide");
if(savedSide){
  sideInput.value = savedSide;
}

// Lưu khi thay đổi
sideInput.addEventListener("change", () => {
  localStorage.setItem("guestSide", sideInput.value);
});

// ===============================
// LOAD LỜI CHÚC
// ===============================
function loadWishes(){

if(!wishList) return;

wishList.innerHTML = "<div class='loading'>Đang tải lời chúc...</div>";

fetch(API_URL + "?type=wish")
.then(res => res.json())
.then(data => {

if(!Array.isArray(data)) return;

renderWishes(data);

})
.catch(err=>{
console.log("Lỗi load:",err);
});

}

// ===============================
// RENDER
// ===============================
function renderWishes(data){

if(!wishList) return;

wishList.innerHTML = "";

data.slice().reverse().forEach(row=>{

const name = row[0] || "Ẩn danh";
const message = row[1] || "";
const time = formatDate(row[2]);

const card = document.createElement("div");
card.className = "wish-card";

card.innerHTML = `
<div class="wish-header">
<span class="wish-name">${escapeHTML(name)}</span>
<span class="wish-time">${time}</span>
</div>
<div class="wish-message">${escapeHTML(message)}</div>
`;

wishList.appendChild(card);

});

if(wishTotal) wishTotal.innerText = data.length;

}

// ===============================
// GỬI LỜI CHÚC
// ===============================
let isSending = false;

function addWish(){

if(isSending) return;

const name = nameInput?.value.trim();
const side = sideInput?.value || "";
const message = messageInput?.value.trim();

if(!name || !message){
alert("Vui lòng nhập đầy đủ thông tin 💌");
return;
}

// ⭐ ghép tên + nhà trai/gái
const displayName = side ? `${name} (${side})` : name;

isSending = true;

const btn = document.querySelector('[onclick="addWish()"]');

if(btn){
btn.disabled = true;
btn.innerText = "Đang gửi...";
}

fetch(API_URL,{
method:"POST",
body:new URLSearchParams({
type:"wish",
name:displayName,
message:message
})
})
.then(res=>res.text())
.then(()=>{

const now = new Date().toLocaleString("vi-VN");

const card = document.createElement("div");
card.className = "wish-card";

card.innerHTML = `
<div class="wish-header">
<span class="wish-name">${escapeHTML(displayName)}</span>
<span class="wish-time">${now}</span>
</div>
<div class="wish-message">${escapeHTML(message)}</div>
`;

wishList.prepend(card);

if(wishTotal){
wishTotal.innerText = Number(wishTotal.innerText || 0) + 1;
}

nameInput.value = "";
messageInput.value = "";
if(sideInput) sideInput.value = "Nhà Trai";

showToast();

})
.catch(err=>{
console.log("Lỗi gửi:",err);
})
.finally(()=>{

isSending = false;

if(btn){
btn.disabled = false;
btn.innerText = "Gửi lời chúc";
}

});

}

window.addWish = addWish;

// ===============================
// FORMAT DATE
// ===============================
function formatDate(dateStr){

if(!dateStr) return "";

const date = new Date(dateStr);

return date.toLocaleString("vi-VN");

}

// ===============================
// CHỐNG XSS
// ===============================
function escapeHTML(str){

if(!str) return "";

str = String(str); // ⭐ ép về string

return str.replace(/[&<>'"]/g, tag => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[tag]));

}

// ===============================
// LOAD
// ===============================
loadWishes();

/* =====================================================
   MUSIC
===================================================== */
function renderMusicPlayer(name){

  const container = document.getElementById("musicContainer");

  container.innerHTML = `
    <div class="music-wrapper">
      <div class="music-info" id="musicInfo">
        <span class="song-name">${name}</span>
      </div>
      <div class="music-btn" id="musicBtn">
        <div class="music-icon" id="musicIcon">♪</div>
        <div class="bars" id="musicBars">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;

  initMusic(); // 🔥 gọi sau khi HTML tồn tại
}

//let music; // global

function initMusic(){
  music = new Audio("assets/audio/mylove.mp3");
  music.loop = true;
  music.volume = 0.8;
  const musicBtn = document.getElementById("musicBtn");
  const musicIcon = document.getElementById("musicIcon");
  const musicBars = document.getElementById("musicBars");
  const musicInfo = document.getElementById("musicInfo");
  let isPlaying = false;
  function showMusicInfo(){
    musicInfo.classList.add("active");
    setTimeout(()=>{
      musicInfo.classList.remove("active");
    },4000);
  }
  musicBtn.addEventListener("click", (e)=>{

  e.stopPropagation(); // ⭐ thêm dòng này

  if(!isPlaying){
    music.play();
    musicIcon.style.display = "none";
    musicBars.style.display = "flex";
    musicStarted = true;
    showMusicInfo();
  }else{
    music.pause();
    musicIcon.style.display = "block";
    musicBars.style.display = "none";
  }

  isPlaying = !isPlaying;

});
}

renderMusicPlayer("Nguyễn Tiến & Lê Hường");

// ====== NGHE NHẠC CÙNG MÌNH NHÉ ======

let musicStarted = false;

/* tạo popup */

const popup = document.createElement("div");
popup.id = "musicPopup";

popup.innerHTML = `
<div class="music-box">
<div class="icon">🎵</div>
<h3>Cùng nghe nhạc nhé!</h3>
<p>Chạm để bắt đầu nghe nhạc</p>
</div>
`;

popup.style.display="none";

document.body.appendChild(popup);

/* sau 8s */

setTimeout(()=>{

if(!musicStarted){
popup.style.display="flex";
}

},8000);

/* bấm popup */

popup.addEventListener("click", ()=>{

const btn = document.getElementById("musicBtn"); // lấy lại nút

if(btn){
btn.click(); // giả lập bấm nút nhạc
}

popup.style.display="none";

});

// ====== TẠO WISH MODAL NẾU CHƯA CÓ ======
if (!$("wishModal")) {
  const modalHTML = `
    <div class="wish-modal" id="wishModal">
      <div class="wish-box">
        <div class="wish-header">
          <h3>✨ Lời chúc gợi ý cho bạn</h3>
          <span class="close-wish" id="closeWish">✕</span>
        </div>
        <div class="wish-list" id="list-goiy"></div>
        <div class="wish-actions">
          <button id="generateWish">✨ Tạo thêm</button>
          <button id="closeWishBtn">Đóng</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

/* =====================================================
   GỢI Ý LỜI CHÚC
===================================================== */

const wishModal = $("wishModal");
const suggestList = $("list-goiy");
const messageTextarea = $("guestMessage");

const suggestions = [
  "Mong rằng hạnh phúc sẽ luôn hiện hữu trong từng khoảnh khắc của hai bạn.",
  "Hy vọng mỗi ngày của hai bạn đều là một ngày đáng nhớ và hạnh phúc.",
  "Chúc vợ chồng mới cưới luôn gặp may mắn, sức khỏe và thành công.",
  "Chúc hôn nhân của hai bạn là câu chuyện cổ tích đẹp để kéo dài mãi mãi.",
  "Hy vọng hai bạn luôn tìm thấy bình yên và hạnh phúc trong vòng tay của nhau.",
  "Chúc hai bạn trăm năm hạnh phúc và yêu thương bền lâu."
];

function renderSuggestions() {
  if (!suggestList) return;

  suggestList.innerHTML = "";

  const shuffled = [...suggestions].sort(() => 0.5 - Math.random());

  shuffled.slice(0, 5).forEach(text => {
    const div = document.createElement("div");
    div.className = "wish-item";
    div.textContent = text;

    div.addEventListener("click", () => {
      if (messageTextarea) {
        messageTextarea.value = text;
        messageTextarea.focus();
      }
      wishModal?.classList.remove("active");
    });

    suggestList.appendChild(div);
  });
}

$("openSuggest")?.addEventListener("click", () => {
  wishModal?.classList.add("active");
  renderSuggestions();
});

$("closeWish")?.addEventListener("click", () => {
  wishModal?.classList.remove("active");
});

$("closeWishBtn")?.addEventListener("click", () => {
  wishModal?.classList.remove("active");
});

$("generateWish")?.addEventListener("click", renderSuggestions);

});

// ===============================
// TẠO MODAL RSVP BẰNG JS
// ===============================

const rsvpHTML = `
<div class="rsvp-modal" id="rsvpModal">
  <div class="rsvp-box">

    <span class="rsvp-close" id="closeRSVP">✕</span>

    <h2>XÁC NHẬN THAM DỰ</h2>

    <input type="text" id="rsvpName" placeholder="Tên của bạn">

    <select id="rsvpAttend">
      <option value="">Bạn có tham dự không?</option>
      <option value="yes">Mình sẽ tham dự 🎉</option>
      <option value="no">Rất tiếc không tham dự</option>
    </select>

    <input type="number" id="rsvpGuests" placeholder="Số người đi cùng" min="0">

    <button id="submitRSVP">Gửi xác nhận</button>

    <p id="rsvpMessage"></p>

  </div>
</div>
`;

// Chèn vào cuối body
document.body.insertAdjacentHTML("beforeend", rsvpHTML);

// ===============================
// XỬ LÝ SỰ KIỆN
// ===============================

const openBtn = document.getElementById("openRSVP");
const rsvpModal = document.getElementById("rsvpModal");
const closeBtn = document.getElementById("closeRSVP");
const submitBtn = document.getElementById("submitRSVP");

openBtn?.addEventListener("click", () => {
  rsvpModal.classList.add("active");
});

closeBtn?.addEventListener("click", () => {
  rsvpModal.classList.remove("active");
});

const API_URL = "https://script.google.com/macros/s/AKfycbyTXN6-H0Cv55ERTCijKar9YwB08Tf179wNjtRCcN_TX2fzJ1umpSCzQ-QzkLz8cwXq/exec";

// ===============================
// RSVP SUBMIT - FULL CHỐNG SPAM
// ===============================

let isSendingRSVP = false;

submitBtn?.addEventListener("click", () => {

  if (isSendingRSVP) return; // 🔒 chặn spam click liên tục

  const name = document.getElementById("rsvpName").value.trim();
  const attend = document.getElementById("rsvpAttend").value;
  const guests = document.getElementById("rsvpGuests").value || 0;

  if (!name || !attend) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // ===============================
  // LỚP 2: Chặn gửi lại trong 30 giây
  // ===============================
  const lastSubmit = localStorage.getItem("lastRSVPTime");
  const now = Date.now();

  if (lastSubmit && now - lastSubmit < 30000) {
    alert("Bạn vừa gửi rồi, vui lòng đợi 30 giây ⏳");
    return;
  }

  // ===============================
  // LỚP 3: Chặn trùng tên trên cùng thiết bị
  // ===============================
  if (localStorage.getItem("rsvp_" + name)) {
    alert("Bạn đã xác nhận rồi 💖");
    return;
  }

  // ===============================
  // KHÓA NÚT
  // ===============================
  isSendingRSVP = true;
  submitBtn.disabled = true;
  submitBtn.innerText = "Đang gửi...";

  // ===============================
  // GỬI LÊN GOOGLE SHEET
  // ===============================
  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({
      type: "rsvp",
      name: name,
      attend: attend,
      guests: guests
    })
  })
  .then(res => res.text())
  .then(text => {

    console.log("Server:", text);

    // Lưu chống spam
    localStorage.setItem("lastRSVPTime", Date.now());
    localStorage.setItem("rsvp_" + name, "done");

    document.getElementById("rsvpMessage").innerText =
      "Cảm ơn bạn đã xác nhận 💖";

    setTimeout(() => {
      rsvpModal.classList.remove("active");
    }, 1500);

  })
  .catch(err => {
    console.log("Lỗi RSVP:", err);
    alert("Có lỗi xảy ra, vui lòng thử lại.");
  })
  .finally(() => {

    isSendingRSVP = false;
    submitBtn.disabled = false;
    submitBtn.innerText = "Xác nhận";

  });

});

/* Hoa Rơi */
const petalsContainer = document.querySelector(".petals");
function createPetal(){
  const petal = document.createElement("div");
  petal.classList.add("petal");
  const size = Math.random() * 10 + 10;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = (Math.random() * 5 + 5) + "s";
  petal.style.opacity = Math.random();
  petalsContainer.appendChild(petal);
  setTimeout(()=> petal.remove(), 10000);
}
setInterval(createPetal, 500);

/* Hiệu Ứng */
document.addEventListener("DOMContentLoaded", function(){
  const sections = document.querySelectorAll("section");
  sections.forEach(section=>{
    section.classList.add("reveal");
  });
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("active");
     /* }else{
        entry.target.classList.remove("active");*/
      }
    });
  },{
    threshold: 0.15,
    rootMargin:"0px 0px -10% 0px"
  });

  sections.forEach(section=>{
    observer.observe(section);
  });

});

/* Mừng Cưới */
const giftHTML = `
<div class="gift-sheet" id="giftSheet">
  <div class="gift-box">
    <div class="gift-header">
      <span>HỘP MỪNG CƯỚI</span>
    </div>
    <div class="gift-content">
      <div class="bank-item">
        <p class="bank-title">Chú Rể</p>
        <img src="assets/images/qr/nhatrai.png">
        <p>MB Bank</p>
        <p>0356858136</p>
        <strong>Nguyễn Đức Tiến</strong>
      </div>
      <div class="bank-item">
        <p class="bank-title">Cô Dâu</p>
        <img src="assets/images/qr/nhagai.png">
        <p>XXXX</p>
        <p>XXX</p>
        <strong>Lê Thị Hường</strong>
      </div>
    </div>
    <p class="gift-note">
      Cảm ơn bạn đã đồng hành cùng chúng mình trong ngày trọng đại!
    </p>
  </div>
</div>
`;

// thêm vào body
document.body.insertAdjacentHTML("beforeend", giftHTML);
// mở hộp
document.getElementById("openGift").onclick = () => {
  document.getElementById("giftSheet").classList.add("active");
};
// đóng hộp
document.addEventListener("click", function(e){
  if(e.target.id === "closeGift"){
    document.getElementById("giftSheet").classList.remove("active");
  }

  if(e.target.id === "giftSheet"){
    document.getElementById("giftSheet").classList.remove("active");
  }

});

//loadRSVPStats();

function renderCalendar(year, month, heartDays){

const calendar = document.getElementById("calendar");
const title = document.getElementById("calendar-title");

if(!calendar || !title) return;

title.textContent = `THÁNG ${String(month).padStart(2,"0")} - ${year}`;

const daysHeader = ["T2","T3","T4","T5","T6","T7","CN"];

calendar.innerHTML = "";

// header
daysHeader.forEach(d=>{
  const div=document.createElement("div");
  div.textContent=d;
  calendar.appendChild(div);
});

// ngày đầu tháng
const firstDay=new Date(year,month-1,1).getDay();
const start=(firstDay===0?6:firstDay-1);

// số ngày trong tháng
const totalDays=new Date(year,month,0).getDate();

// ô trống đầu
for(let i=0;i<start;i++){
  calendar.appendChild(document.createElement("div"));
}

// render ngày
for(let d=1; d<=totalDays; d++){

  const div=document.createElement("div");

  if(heartDays.includes(d)){
    div.classList.add("heart");
  }

  div.textContent=d;

  calendar.appendChild(div);
}

}

renderCalendar(2026, 4, [10,11]);

/* Nâng Cấp */

/* Đồng Hồ */
function startCountdown(){
  const weddingDate = new Date("2026-04-11T00:00:00");
  const timeEl = document.getElementById("countdown-time");
  const cnEl = document.getElementById("countdown-cn");
  function update(){
    const now = new Date();
    const diff = weddingDate - now;
    if(diff <= 0){
      timeEl.textContent = "Hẹn Gặp Bạn Trong Ngày Đặc Biệt Của Chúng Tôi ❤️";
      //cnEl.textContent = "婚禮開始 ❤️";
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60)) % 24);
    const minutes = Math.floor((diff/(1000*60)) % 60);
    const seconds = Math.floor((diff/1000) % 60);
    timeEl.textContent =
      `${days} ngày ${hours} giờ ${minutes} phút`;
      
    /*timeEl.textContent =
      `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;*/
    /*cnEl.textContent =
      `${days} 天 ${hours} 時 ${minutes} 分 ${seconds} 秒`;*/
  }
  update();
  setInterval(update,1000);
}
startCountdown();

/* Video */
const videoLink = "https://www.youtube.com/watch?v=uQzGdzzDtLA";
// hoặc
// const videoLink = "videos/wedding.mp4";
const videoBox = document.getElementById("videoItem");
if(videoLink.includes("youtube") || videoLink.includes("youtu.be")){
  const id = videoLink.split("v=")[1]?.split("&")[0] || videoLink.split("/").pop();
  videoBox.innerHTML = `
  <iframe
  src="https://www.youtube.com/embed/${id}"
  frameborder="0"
  allowfullscreen>
  </iframe>
  `;
}else if(videoLink.endsWith(".mp4")){
  videoBox.innerHTML = `
  <video controls>
    <source src="${videoLink}" type="video/mp4">
  </video>
  `;
}

/* ===============================
   AUTO SCROLL
================================ */
let scrollBox;
let autoScrolling = true;
let autoScrollTimer;

function startAutoScroll(){
  scrollBox = document.querySelector(".content");
  if(!scrollBox) return;
  autoScrollTimer = setInterval(()=>{
    if(!autoScrolling) return;
    scrollBox.scrollBy({
      top:1
    });
  },20);
}

/* user interaction */
function stopAutoScroll(){
  autoScrolling = false;
  clearTimeout(window.resumeScroll);
  window.resumeScroll = setTimeout(()=>{
    autoScrolling = true;
  },5000);
}

/* detect interaction */
["wheel","touchstart","mousedown","keydown"].forEach(event=>{
  window.addEventListener(event,stopAutoScroll,{passive:true});
});

/* Lịch Trình */
fetch("assets/data/event.json")
.then(res=>res.json())
.then(data=>{

const tabBox = document.getElementById("tabs");
const contentBox = document.getElementById("tabContents");

data.tabs.forEach((tab,i)=>{

/* tạo nút tab */

const btn = document.createElement("button");
btn.className="tab-btn";
btn.textContent=tab.name;
btn.dataset.tab=i;

if(i===0) btn.classList.add("active");

tabBox.appendChild(btn);

/* tạo nội dung */

const div=document.createElement("div");
div.className="tab-content";
div.dataset.date=tab.date;

if(i===0) div.classList.add("active");

tab.events.forEach(ev=>{

div.innerHTML+=`
<div class="timeline-item">
<span class="time">${ev.time}</span>
<span class="event">${ev.title}</span>
</div>
`;

});

contentBox.appendChild(div);

});

/* tab switch */

document.querySelectorAll(".tab-btn").forEach(btn=>{
btn.onclick=()=>{

document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));

btn.classList.add("active");
document.querySelectorAll(".tab-content")[btn.dataset.tab].classList.add("active");

};
});

checkTimeline();
setInterval(checkTimeline,60000);

});


function checkTimeline(){

const tabs=document.querySelectorAll(".tab-content");

tabs.forEach(tab=>{

const items=tab.querySelectorAll(".timeline-item");
const date=tab.dataset.date;

const now=new Date();

let doneCount=0;

items.forEach(item=>{

const time=item.querySelector(".time").textContent;

const [h,m]=time.split(":");

const eventTime=new Date(date);

eventTime.setHours(h);
eventTime.setMinutes(m);

if(now>=eventTime){

const event=item.querySelector(".event");

if(!event.innerHTML.includes("✓")){
event.innerHTML+=" ✓";
}

doneCount++;

}

});

/* nếu hết timeline */
if(doneCount===items.length){
if(!tab.querySelector(".timeline-finish")){
const finish=document.createElement("div");
finish.className="timeline-item timeline-finish";
const d = new Date(date);
const day = String(d.getDate()).padStart(2,"0");
const month = String(d.getMonth()+1).padStart(2,"0");
finish.textContent=`${day}/${month} Sự Kiện Diễn Ra Thành Công Tốt Đẹp`;
tab.appendChild(finish);
}
}

});
}

console.log("JS ĐÃ CHẠY");