/* =========================
GLOBAL DATA
========================= */

let weddingData = null;


/* =========================
LOAD JSON
========================= */

fetch("assets/data/lichth.json")
.then(res => res.json())
.then(data => {

  weddingData = data;
  renderHero();
  renderFamily();
  setupTabs();
  autoOpenTabFromURL();

  /*renderHero();
  renderFamily();
  loadSchedule("groom_side");
  setupTabs();*/

})
.catch(err=>{
  console.log("Lỗi load JSON:", err);
});


/* =========================
HERO
========================= */

function renderHero(){

  if(!weddingData) return;

  const names = document.querySelectorAll(".names");
  const and = document.querySelector(".and");
  const date = document.querySelector(".wedding-date");
  const sub = document.querySelector(".wedding-sub");

  if(names[0]) names[0].innerText = weddingData.hero.groom_name;
  if(names[1]) names[1].innerText = weddingData.hero.bride_name;

  if(and) and.innerText = weddingData.hero.and_symbol;
  if(date) date.innerText = weddingData.hero.wedding_date;
  if(sub) sub.innerText = weddingData.hero.subtitle;

}


/* =========================
FAMILY
========================= */

function renderFamily(){

  if(!weddingData) return;

  const names = document.querySelectorAll(".name");
  const labels = document.querySelectorAll(".label");
  const fathers = document.querySelectorAll(".father");
  const mothers = document.querySelectorAll(".mother");
  const address = document.querySelectorAll(".address");

  if(names[0]) names[0].innerText = weddingData.family.groom.name;
  if(names[1]) names[1].innerText = weddingData.family.bride.name;

  if(labels[0]) labels[0].innerText = weddingData.family.groom.parents_label;
  if(labels[1]) labels[1].innerText = weddingData.family.bride.parents_label;

  if(fathers[0]) fathers[0].innerText = weddingData.family.groom.father;
  if(fathers[1]) fathers[1].innerText = weddingData.family.bride.father;

  if(mothers[0]) mothers[0].innerText = weddingData.family.groom.mother;
  if(mothers[1]) mothers[1].innerText = weddingData.family.bride.mother;

  if(address[0]) address[0].innerText = weddingData.family.groom.address;
  if(address[1]) address[1].innerText = weddingData.family.bride.address;

}


/* =========================
LOAD SCHEDULE
========================= */

function loadSchedule(type){

  if(!weddingData) return;

  const s = weddingData.wedding_info[type];
  if(!s) return;

  const title = document.querySelector(".invite-title-wedding");
  //.buoile
  const timeLabel = document.querySelector(".invite-time");
  const hour = document.querySelector(".time-hour");
  const weekday = document.querySelector(".time-week");
  const day = document.querySelector(".time-day");
  const month = document.querySelector(".time-month");
  const year = document.querySelector(".time-year");
  const lunar = document.querySelector(".lunar-date");
  const placeTitle = document.querySelector(".place-title");
  const placeName = document.querySelector(".location-name");
  const placeAddress = document.querySelector(".location-address");
  const mapBtn = document.querySelector(".map-btn");
  const buoile = document.querySelectorAll(".buoile");
  
  buoile.forEach(el=>{
    el.textContent =
      type === "bride_side"
      ? "LỄ VU QUY CỦA"
      : "LỄ THÀNH HÔN CỦA";
  });
  
  if(title) title.innerText = s.title;
  if(timeLabel) timeLabel.innerText = s.time_label;
  if(hour) hour.innerText = s.time.hour;
  if(weekday) weekday.innerText = s.time.weekday;
  if(day) day.innerText = s.time.day;
  if(month) month.innerText = s.time.month;
  if(year) year.innerText = s.time.year;
  if(lunar) lunar.innerText = s.lunar_date;
  if(placeTitle) placeTitle.innerText = s.place.title;
  if(placeName) placeName.innerText = s.place.name;
  if(placeAddress) placeAddress.innerText = s.place.address;
  if(mapBtn){
    mapBtn.innerText = s.place.map_button;
    mapBtn.href = s.place.map_link;
  }

}

/* =========================
ĐỔI TAB NHÀ TRAI / NHÀ GÁI
========================= */
function autoOpenTabFromURL(){
  const params = new URLSearchParams(window.location.search);
  const nha = params.get("nha");
  if(!nha) {
    loadSchedule("groom_side");
    return;
  }
  const tabs = document.querySelectorAll(".schedule-tabs .tab");
  if(nha === "gai"){
    tabs.forEach(t => t.classList.remove("active"));
    const brideTab = document.querySelector('.tab[data-tab="bride"]');
    if(brideTab) brideTab.classList.add("active");
    loadSchedule("bride_side");
  } else {
    loadSchedule("groom_side");
  }
}

/* =========================
TAB NHÀ TRAI / NHÀ GÁI
========================= */
function setupTabs(){
  const tabs = document.querySelectorAll(".schedule-tabs .tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", ()=>{
      if(!weddingData) return;
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const type = tab.dataset.tab;
      if(type === "groom"){
        loadSchedule("groom_side");
      }
      if(type === "bride"){
        loadSchedule("bride_side");
      }
    });
  });
}