/* =========================================================
   CATMAS — site config
   Edit this file to update the site. No code changes needed.
   ========================================================= */
window.CATMAS_CONFIG = {
  siteUrl: "",                              // leave "" to use the current domain automatically
  xHandle: "",                              // your X handle without @, e.g. "catmascoin"
  tiktok: "",                               // full URL, optional
  instagram: "",                            // full URL, optional

  // ---- Token (fill in at launch) ----
  ca: "",                                   // contract address — keep "" until launch
  pumpUrl: "",                              // https://pump.fun/coin/<CA>
  launchAt: "2026-12-01T13:00:00Z",         // Dec 1, 8:00 AM New York
  catmasYear: 2026,

  // ---- Catmas Meter (update weekly) ----
  meter: { meals: 0, catsFed: 0, solToShelters: 0 },
  split: { mission: 70, shelter: 30 },
  mealsPerDollar: 6,

  // ---- Hero cat ("the face of Catmas") ----
  // photo: put the file in /public/media/ and write "/media/biscuit.jpg"
  hero: { name: "Biscuit", id: "CATMAS-0001", city: "The Fish Market", photo: "" },

  // ---- Cats you fed (Catdex) ----  photo: "" shows an illustrated placeholder
  fedCats: [
    { no:"CATMAS-0001", name:"Biscuit",  city:"The Fish Market",  tag:"Face of Catmas",   color:"#f08a3c", photo:"" },
    { no:"CATMAS-0002", name:"The Boss", city:"Fish Market Row",  tag:"Fish market boss", color:"#7b6a58", photo:"" },
    { no:"CATMAS-0003", name:"Espresso", city:"Night Market",     tag:"Night shift",      color:"#2a2522", photo:"" },
    { no:"CATMAS-0004", name:"Pineapple",city:"The Beach",        tag:"Beach patrol",     color:"#e9c27a", photo:"" },
    { no:"CATMAS-0005", name:"Sugar",    city:"Bakery Alley",     tag:"Shy one",          color:"#f4efe6", photo:"" },
    { no:"CATMAS-0006", name:"Captain",  city:"The Harbor",       tag:"One-eyed legend",  color:"#9aa3ab", photo:"" },
    { no:"CATMAS-0007", name:"Mochi",    city:"Old Train Station",tag:"Named by @you",    color:"#d9d2c7", photo:"" },
    { no:"CATMAS-0008", name:"Sergeant", city:"The Parking Lot",  tag:"Guards the gang",  color:"#c96a2b", photo:"" }
  ],

  // ---- ASMR videos ----  src: "/media/asmr-01.mp4" (vertical 9:16, keep under ~20 MB)
  videos: [
    { title:"First Christmas dinner",      cat:"Biscuit",  city:"The Fish Market", src:"", poster:"", color:"#f08a3c" },
    { title:"Crunchy kibble, rainy night", cat:"The Boss", city:"Fish Market Row", src:"", poster:"", color:"#7b6a58" },
    { title:"Tiny licks, tiny purrs",      cat:"Sugar",    city:"Bakery Alley",    src:"", poster:"", color:"#f4efe6" }
  ],

  // ---- 25 Days of Catmas ----  one entry per day (1–25); photo optional
  advent: {
    1:{ cat:"Biscuit",  note:"Our first cat, our first hat.",          color:"#f08a3c" },
    2:{ cat:"The Boss", note:"Runs the fish market. Has opinions.",    color:"#7b6a58" },
    3:{ cat:"Espresso", note:"Only comes out after 9 pm.",             color:"#2a2522" }
  },

  // ---- Weekly receipts ----
  receipts: [
    // { date:"2026-12-07", title:"Week 1", detail:"2.4 SOL withdrawn · 3,900 meals", tx:"https://solscan.io/tx/..." }
  ],

  roadmap: [
    { t:"Pre-launch",       d:"Feeding daily, building the Catdex", done:true },
    { t:"Dec 1 · Launch",   d:"$CATMAS live, Catmas door #1" },
    { t:"1,000 meals",      d:"Live feeding cam unlocked" },
    { t:"Dec 24 · Feast",   d:"Christmas Eve dinner for the strays" },
    { t:"TNR round",        d:"Sterilization with a local vet" }
  ]
};
