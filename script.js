"use strict";
const $ = s => document.querySelector(s);
const img = seed => `https://picsum.photos/seed/${seed}/600/400`;
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#cfdcdd"/><path d="M200 230l100-80 100 80v70H200z" fill="#0e5a5c"/><rect x="278" y="250" width="44" height="50" fill="#ff6b4a"/></svg>');

/* ---------- Data (array of objects) + LocalStorage ---------- */
const SEED = [
  {id:1,name:"Skyline 3BHK Apartment",location:"Hyderabad",price:8500000,type:"Apartment",image:img("home1"),description:"Spacious 3BHK on the 12th floor with city views, clubhouse and covered parking."},
  {id:2,name:"Green Acres Villa",location:"Bengaluru",price:24500000,type:"Villa",image:img("home2"),description:"Four-bedroom villa with a private garden in a gated community."},
  {id:3,name:"Lakeside Family House",location:"Pune",price:11200000,type:"House",image:img("home3"),description:"Two-storey home near the lake, ideal for families, with a terrace and study."},
  {id:4,name:"Business Bay Office Space",location:"Mumbai",price:32000000,type:"Commercial",image:img("home4"),description:"2,000 sq ft office with a reception area, meeting rooms and 24/7 power backup."},
  {id:5,name:"Sunrise Residential Plot",location:"Hyderabad",price:4200000,type:"Plot",image:img("home5"),description:"East-facing 200 sq yd plot with clear title, close to the outer ring road."},
  {id:6,name:"Harbour View Apartment",location:"Chennai",price:6700000,type:"Apartment",image:img("home6"),description:"2BHK a short walk from the beach with modern fittings and a gym."}
];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const store = (k, v) => localStorage.setItem(k, JSON.stringify(v));
let properties = load("re_properties", SEED);
let favourites = load("re_favourites", []);
let enquiries  = load("re_enquiries", []);

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2600); }

/* ---------- Render + filter ---------- */
function getFiltered(){
  const loc = $("#fLoc").value.trim().toLowerCase();
  const max = Number($("#fPrice").value);
  const type = $("#fType").value;
  const favOnly = $("#fFav").checked;
  return properties.filter(p =>
    (!loc || p.location.toLowerCase().includes(loc)) &&
    (!max || p.price <= max) &&
    (!type || p.type === type) &&
    (!favOnly || favourites.includes(p.id)));
}
function render(){
  const grid = $("#grid"), list = getFiltered();
  grid.innerHTML = "";
  $("#count").textContent = `${list.length} of ${properties.length} shown`;
  if(!list.length) grid.innerHTML = '<div class="empty">No properties match your filters. Try clearing them or add a new property.</div>';
  list.forEach(p => {
    const fav = favourites.includes(p.id);
    grid.insertAdjacentHTML("beforeend", `
      <article class="card">
        <div class="thumb">
          <img src="${esc(p.image || img("p"+p.id))}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
          <span class="tag">${esc(p.type)}</span>
          <button class="icon ${fav?"on":""}" data-act="fav" data-id="${p.id}" aria-label="${fav?"Remove from":"Add to"} favourites" aria-pressed="${fav}">${fav?"♥":"♡"}</button>
        </div>
        <div class="body">
          <div class="price">${inr(p.price)}</div>
          <h3>${esc(p.name)}</h3>
          <div class="loc">📍 ${esc(p.location)}</div>
          <p>${esc(p.description || "")}</p>
          <div class="btns">
            <button class="btn sm" data-act="enq" data-id="${p.id}">Enquire</button>
            <button class="btn sm ghost" data-act="edit" data-id="${p.id}">Edit</button>
            <button class="btn sm ghost del" data-act="del" data-id="${p.id}">Delete</button>
          </div>
        </div>
      </article>`);
  });
  renderEnquiries();
}
function renderEnquiries(){
  $("#enqCount").textContent = enquiries.length;
  const ul = $("#enqList"); ul.innerHTML = "";
  if(!enquiries.length) ul.innerHTML = "<li>No enquiries yet.</li>";
  enquiries.forEach(e => ul.insertAdjacentHTML("beforeend",
    `<li><b>${esc(e.name)}</b> (${esc(e.email)}, ${esc(e.phone)}) asked about <b>${esc(e.propertyName)}</b>: ${esc(e.message)}</li>`));
}

/* ---------- Validation helpers ---------- */
function showErrors(errors){
  document.querySelectorAll(".err").forEach(el => el.textContent = "");
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  Object.entries(errors).forEach(([id,msg]) => {
    document.querySelector(`.err[data-for="${id}"]`).textContent = msg;
    $("#"+id).classList.add("invalid");
  });
  return Object.keys(errors).length === 0;
}

/* ---------- Property CRUD ---------- */
function openProp(p){
  $("#propTitle").textContent = p ? "Edit property" : "Add property";
  $("#pId").value = p ? p.id : "";
  $("#pName").value = p?.name || ""; $("#pLoc").value = p?.location || "";
  $("#pPrice").value = p?.price || ""; $("#pType").value = p?.type || "";
  $("#pImg").value = p?.image || ""; $("#pDesc").value = p?.description || "";
  showErrors({}); $("#propDialog").showModal();
}
$("#propForm").addEventListener("submit", e => {
  e.preventDefault();
  const d = {name:$("#pName").value.trim(), location:$("#pLoc").value.trim(), price:Number($("#pPrice").value),
             type:$("#pType").value, image:$("#pImg").value.trim(), description:$("#pDesc").value.trim()};
  const err = {};
  if(d.name.length < 3) err.pName = "Enter a name with at least 3 characters.";
  if(d.location.length < 2) err.pLoc = "Enter a location.";
  if(!(d.price > 0)) err.pPrice = "Enter a price greater than 0.";
  if(!d.type) err.pType = "Choose a property type.";
  if(d.image && !/^https?:\/\//i.test(d.image)) err.pImg = "Image URL must start with http:// or https://";
  if(d.description.length > 300) err.pDesc = "Keep the description under 300 characters.";
  if(!showErrors(err)) return;
  const id = Number($("#pId").value);
  if(id){ properties = properties.map(p => p.id === id ? {...p, ...d} : p); toast("Property updated"); }              // UPDATE
  else { properties.push({id: Date.now(), ...d}); toast("Property added"); }                                       // CREATE
  store("re_properties", properties); $("#propDialog").close(); render();
});

/* ---------- Card actions (favourite / enquire / edit / delete) ---------- */
$("#grid").addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if(!b) return;
  const id = Number(b.dataset.id), p = properties.find(x => x.id === id);
  if(b.dataset.act === "fav"){
    favourites = favourites.includes(id) ? favourites.filter(f => f !== id) : [...favourites, id];
    store("re_favourites", favourites); render();
    toast(favourites.includes(id) ? "Added to favourites" : "Removed from favourites");
  }
  if(b.dataset.act === "enq") openEnquiry(id);
  if(b.dataset.act === "edit") openProp(p);
  if(b.dataset.act === "del" && confirm(`Delete "${p.name}"?`)){                                                    // DELETE
    properties = properties.filter(x => x.id !== id); favourites = favourites.filter(f => f !== id);
    store("re_properties", properties); store("re_favourites", favourites); render(); toast("Property deleted");
  }
});

/* ---------- Enquiry form ---------- */
function openEnquiry(id){
  const sel = $("#eProp"); sel.innerHTML = '<option value="">Select a property</option>';
  properties.forEach(p => sel.insertAdjacentHTML("beforeend", `<option value="${p.id}">${esc(p.name)} – ${esc(p.location)}</option>`));
  if(id) sel.value = id;
  $("#enqForm").reset(); if(id) sel.value = id; showErrors({}); $("#enqDialog").showModal();
}
$("#enqForm").addEventListener("submit", e => {
  e.preventDefault();
  const d = {propId:Number($("#eProp").value), name:$("#eName").value.trim(), email:$("#eEmail").value.trim(),
             phone:$("#ePhone").value.trim(), message:$("#eMsg").value.trim()};
  const err = {};
  if(!d.propId) err.eProp = "Select a property.";
  if(!/^[A-Za-z ]{3,}$/.test(d.name)) err.eName = "Use letters only, at least 3 characters.";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) err.eEmail = "Enter a valid email address.";
  if(!/^[6-9]\d{9}$/.test(d.phone)) err.ePhone = "Enter a valid 10-digit mobile number.";
  if(d.message.length < 10) err.eMsg = "Message must be at least 10 characters.";
  if(!showErrors(err)) return;
  const prop = properties.find(p => p.id === d.propId);
  enquiries.unshift({...d, propertyName: prop.name, date: new Date().toISOString()});
  store("re_enquiries", enquiries); $("#enqDialog").close(); renderEnquiries(); toast("Enquiry sent. We will contact you soon.");
});

/* ---------- Async location search (Open-Meteo Geocoding API) ---------- */
const setStatus = (msg, cls="") => { const s=$("#locStatus"); s.className="status "+cls; s.innerHTML = cls==="loading" ? '<span class="spin"></span>'+msg : msg; };
async function searchLocation(q){
  $("#locResults").innerHTML = ""; setStatus("Searching locations…", "loading");
  try{
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`);
    if(!res.ok) throw new Error("Server responded with status " + res.status);
    const data = await res.json();
    if(!data.results?.length){ setStatus(`No places found for "${esc(q)}". Check the spelling and try again.`, "error"); return; }
    setStatus(`${data.results.length} places found.`);
    data.results.forEach(r => $("#locResults").insertAdjacentHTML("beforeend", `
      <div class="place">
        <b>${esc(r.name)}</b><br>${esc([r.admin1, r.country].filter(Boolean).join(", "))}<br>
        <span class="muted">Lat ${r.latitude.toFixed(3)}, Lon ${r.longitude.toFixed(3)}${r.population ? " · Pop. " + r.population.toLocaleString("en-IN") : ""}</span><br>
        <a href="https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=11/${r.latitude}/${r.longitude}" target="_blank" rel="noopener">View on map</a>
        <div class="btns"><button class="btn sm" data-use="filter" data-name="${esc(r.name)}">Filter listings</button>
        <button class="btn sm ghost" data-use="form" data-name="${esc(r.name)}">Use in new listing</button></div>
      </div>`));
  }catch(err){
    setStatus("Could not load locations. Check your internet connection and try again. (" + esc(err.message) + ")", "error");
  }
}
$("#locForm").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("#locQuery").value.trim();
  if(q.length < 2) return setStatus("Type at least 2 characters to search.", "error");
  searchLocation(q);
});
$("#locResults").addEventListener("click", e => {
  const b = e.target.closest("[data-use]"); if(!b) return;
  if(b.dataset.use === "filter"){ $("#fLoc").value = b.dataset.name; render(); location.hash = "#listings"; }
  else { openProp(); $("#pLoc").value = b.dataset.name; }
});

/* ---------- Wiring ---------- */
["fLoc","fPrice","fType","fFav"].forEach(id => $("#"+id).addEventListener("input", render));
$("#fReset").addEventListener("click", () => { ["fLoc","fPrice","fType"].forEach(i => $("#"+i).value=""); $("#fFav").checked=false; render(); });
$("#openAdd").addEventListener("click", () => openProp());
$("#openEnquiry").addEventListener("click", () => openEnquiry());
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));
render();
