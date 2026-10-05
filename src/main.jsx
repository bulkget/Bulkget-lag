import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BedDouble, ChefHat, Sofa, Bath, Flower2, Volume2, VolumeX, X,
  Star, LockKeyhole, Sparkles, Trophy, UserRound, Home, Search,
  BookOpen, ChevronRight, Check, RotateCcw
} from "lucide-react";
import "./styles.css";

const rooms = [
  { id:"bedroom", title:"ห้องนอน", en:"Bedroom", color:"cyan", icon:BedDouble, count:8, total:15, words:["bed","pillow","blanket","wardrobe","lamp"] },
  { id:"kitchen", title:"ห้องครัว", en:"Kitchen", color:"orange", icon:ChefHat, count:5, total:12, words:["stove","kettle","pan","plate","spoon"] },
  { id:"living", title:"ห้องนั่งเล่น", en:"Living Room", color:"purple", icon:Sofa, count:0, total:14, words:["sofa","bookshelf","remote","carpet","lamp"] },
  { id:"bathroom", title:"ห้องน้ำ", en:"Bathroom", color:"blue", icon:Bath, count:0, total:10, locked:true, words:["sink","mirror","towel","soap"] },
  { id:"garden", title:"สวนหลังบ้าน", en:"Garden", color:"green", icon:Flower2, count:0, total:12, locked:true, words:["flower","tree","grass","slide"] }
];

const vocabulary = {
  bed: { th:"เตียง", pron:"เบด", sentence:"The bed is soft.", sentenceTh:"เตียงนุ่ม", room:"Bedroom", emoji:"🛏️" },
  pillow: { th:"หมอน", pron:"พิล-โลว์", sentence:"My pillow is comfortable.", sentenceTh:"หมอนของฉันนุ่มสบาย", room:"Bedroom", emoji:"🛏️" },
  blanket: { th:"ผ้าห่ม", pron:"แบลง-คิท", sentence:"The blanket is warm.", sentenceTh:"ผ้าห่มอุ่น", room:"Bedroom", emoji:"🧺" },
  wardrobe: { th:"ตู้เสื้อผ้า", pron:"วอร์-ดร็อบ", sentence:"My clothes are in the wardrobe.", sentenceTh:"เสื้อผ้าของฉันอยู่ในตู้", room:"Bedroom", emoji:"🚪" },
  lamp: { th:"โคมไฟ", pron:"แลมพ์", sentence:"Turn on the lamp.", sentenceTh:"เปิดโคมไฟ", room:"Bedroom", emoji:"💡" },
  stove: { th:"เตา", pron:"สโตฟ", sentence:"The soup is on the stove.", sentenceTh:"ซุปอยู่บนเตา", room:"Kitchen", emoji:"🔥" },
  kettle: { th:"กาต้มน้ำ", pron:"เคท-เทิล", sentence:"The kettle is boiling.", sentenceTh:"กาต้มน้ำกำลังเดือด", room:"Kitchen", emoji:"🫖" },
  pan: { th:"กระทะ", pron:"แพน", sentence:"Put the egg in the pan.", sentenceTh:"ใส่ไข่ลงในกระทะ", room:"Kitchen", emoji:"🍳" },
  plate: { th:"จาน", pron:"เพลท", sentence:"The plate is clean.", sentenceTh:"จานสะอาด", room:"Kitchen", emoji:"🍽️" },
  spoon: { th:"ช้อน", pron:"สพูน", sentence:"I need a spoon.", sentenceTh:"ฉันต้องการช้อน", room:"Kitchen", emoji:"🥄" },
  sofa: { th:"โซฟา", pron:"โซ-ฟะ", sentence:"Sit on the sofa.", sentenceTh:"นั่งบนโซฟา", room:"Living Room", emoji:"🛋️" },
  bookshelf: { th:"ชั้นหนังสือ", pron:"บุ๊ค-เชลฟ์", sentence:"The books are on the bookshelf.", sentenceTh:"หนังสืออยู่บนชั้นหนังสือ", room:"Living Room", emoji:"📚" },
  remote: { th:"รีโมต", pron:"รี-โมท", sentence:"Where is the remote?", sentenceTh:"รีโมตอยู่ไหน", room:"Living Room", emoji:"🎮" },
  carpet: { th:"พรม", pron:"คาร์-เพท", sentence:"The carpet is clean.", sentenceTh:"พรมสะอาด", room:"Living Room", emoji:"🟫" }
};

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = .82;
  window.speechSynthesis.speak(u);
}

function App() {
  const [tab, setTab] = useState("home");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [word, setWord] = useState(null);
  const [stars, setStars] = useState(340);
  const [learned, setLearned] = useState(28);
  const [sound, setSound] = useState(true);
  const [search, setSearch] = useState("");
  const [dailyDone, setDailyDone] = useState(3);

  const allWords = useMemo(() => Object.keys(vocabulary), []);
  const filtered = allWords.filter(w => {
    const q = search.toLowerCase().trim();
    return !q || w.includes(q) || vocabulary[w].th.includes(q);
  });

  useEffect(() => {
    if (sound && word) speak(word);
  }, [word, sound]);

  const openWord = (w) => setWord(w);
  const markLearned = () => {
    if (!word) return;
    setStars(s => s + 10);
    setLearned(n => Math.min(53, n + 1));
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark">🏠</div>
          <div>
            <b>VocabRoom</b>
            <span>Explorer</span>
          </div>
        </div>
        <div className="topStats">
          <span className="pill stars"><Star size={15} fill="currentColor"/> {stars}</span>
          <span className="pill progress">{learned}/60 คำ</span>
          <button className="roundBtn" onClick={() => setSound(v => !v)}>{sound ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
          <button className="roundBtn profile"><UserRound size={17}/></button>
        </div>
      </header>

      <main>
        <section className="heroGrid">
          <div className="profileCard card">
            <div className="avatar">😎</div>
            <div className="profileText">
              <div className="tag">นักสำรวจคำศัพท์</div>
              <h2>น้องพอใจ สายลุย</h2>
              <p>อังกฤษพื้นฐาน • ระดับ 3</p>
            </div>
            <div className="level">Lv. 3</div>
          </div>

          <div className="mission card">
            <div className="missionIcon"><Sparkles size={19}/></div>
            <div className="missionText">
              <b>ภารกิจประจำวัน</b>
              <span>ค้นหาและฟังเสียงศัพท์ในห้องนอน 5 คำ</span>
              <div className="bar"><i style={{width:`${dailyDone/5*100}%`}}/></div>
              <small>ก้าวหน้า {dailyDone}/5 • +20 ดาว ⭐</small>
            </div>
            <button className="goBtn" onClick={() => {setTab("rooms"); setSelectedRoom("bedroom")}}>ไปต่อ <ChevronRight size={17}/></button>
          </div>
        </section>

        {tab === "home" && (
          <>
            <section className="explorer card">
              <div className="sectionHead">
                <div>
                  <h1><Home size={22}/> บ้านแสนอบอุ่นแห่งคำศัพท์</h1>
                  <p>เลือกห้องเพื่อเรียนคำศัพท์และออกเสียง</p>
                </div>
                <div className="filters">
                  <button className="active">ทั้งหมด (6)</button>
                  <button>ที่ปลดล็อกแล้ว (3)</button>
                  <button>หมวดส่วนตัว (1)</button>
                </div>
              </div>

              <DetailedHouseMap onSelectWord={(w) => setWord(w)} onSelectRoom={setSelectedRoom} />
            </section>

            <section className="roomGrid">
              {rooms.map(r => <RoomCard key={r.id} room={r} onOpen={setSelectedRoom} />)}
              <div className="createCard">
                <Sparkles size={27}/>
                <b>เพิ่มห้องและหมวดใหม่</b>
                <span>สร้างคลังคำศัพท์เฉพาะของคุณ</span>
                <button onClick={() => alert("เพิ่มห้องใหม่: ฟีเจอร์พร้อมต่อยอด")}>＋ สร้างหมวดคำศัพท์ของคุณเอง</button>
              </div>
            </section>

            <section className="reward card">
              <div className="trophy"><Trophy size={27}/></div>
              <div><b>รางวัลนักสำรวจถัดไป: กล่องของขวัญโต๊ะ</b><span>สะสมคำศัพท์ในบ้านอีก 12 คำ เพื่อปลดล็อกสติกเกอร์และเสียงเอฟเฟกต์พิเศษ!</span></div>
              <strong>28 / 40 คำ</strong>
              <button>ดูของรางวัลทั้งหมด</button>
            </section>
          </>
        )}

        {tab === "rooms" && (
          <section className="studyPage">
            <div className="studyHeader">
              <button className="backBtn" onClick={() => setTab("home")}>← บ้าน</button>
              <div>
                <h1>{selectedRoom ? rooms.find(r=>r.id===selectedRoom)?.title : "คลังคำศัพท์"}</h1>
                <p>แตะคำศัพท์เพื่อฟังเสียงและดูตัวอย่าง</p>
              </div>
              <div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาคำ..." /></div>
            </div>
            <div className="wordGrid">
              {filtered.map(w => <WordCard key={w} word={w} onOpen={openWord}/>)}
            </div>
          </section>
        )}

        {tab === "quiz" && <Quiz onEarn={() => {setStars(s=>s+20); setDailyDone(d=>Math.min(5,d+1));}}/>}
      </main>

      <nav className="bottomNav">
        <button className={tab==="home" ? "selected":""} onClick={() => setTab("home")}><Home size={20}/><span>แผนที่บ้าน</span></button>
        <button className={tab==="rooms" ? "selected":""} onClick={() => {setTab("rooms"); setSelectedRoom(null)}}><BookOpen size={20}/><span>ห้องเรียน</span></button>
        <button className={tab==="quiz" ? "selected":""} onClick={() => setTab("quiz")}><Sparkles size={20}/><span>เกมคำศัพท์</span></button>
        <button><Trophy size={20}/><span>รางวัล</span></button>
      </nav>

      {selectedRoom && tab === "home" && (
        <div className="toastRoom" onClick={() => {setTab("rooms")}}>
          เปิด <b>{rooms.find(r=>r.id===selectedRoom)?.title}</b> แล้ว → แตะเพื่อเริ่มเรียน
        </div>
      )}

      {word && <WordModal w={word} onClose={() => setWord(null)} onLearn={markLearned}/>}
    </div>
  );
}

function DetailedHouseMap({onSelectWord,onSelectRoom}) {
  const [scale,setScale]=useState(1), [pan,setPan]=useState({x:0,y:0}), [drag,setDrag]=useState(null), [active,setActive]=useState(null);
  const objects=[
    {id:"bed",label:"Bed",x:15,y:17,e:"🛏️",c:"#64d8d0"},{id:"pillow",label:"Pillow",x:28,y:12,e:"🛏️",c:"#64d8d0"},{id:"wardrobe",label:"Wardrobe",x:45,y:14,e:"🚪",c:"#64d8d0"},{id:"lamp",label:"Lamp",x:34,y:29,e:"💡",c:"#64d8d0"},{id:"desk",label:"Desk",x:54,y:29,e:"🪑",c:"#64d8d0"},
    {id:"stove",label:"Stove",x:12,y:67,e:"🔥",c:"#ffae39"},{id:"kettle",label:"Kettle",x:27,y:64,e:"🫖",c:"#ffae39"},{id:"pan",label:"Pan",x:42,y:67,e:"🍳",c:"#ffae39"},{id:"plate",label:"Plate",x:52,y:58,e:"🍽️",c:"#ffae39"},{id:"spoon",label:"Spoon",x:62,y:67,e:"🥄",c:"#ffae39"},
    {id:"sofa",label:"Sofa",x:70,y:25,e:"🛋️",c:"#a35be8"},{id:"bookshelf",label:"Bookshelf",x:88,y:20,e:"📚",c:"#a35be8"},{id:"remote",label:"Remote",x:75,y:42,e:"🎮",c:"#a35be8"},{id:"carpet",label:"Carpet",x:78,y:52,e:"🟫",c:"#a35be8"},{id:"plant",label:"Plant",x:94,y:51,e:"🪴",c:"#67a45c"}
  ];
  const clamp=(x,y,s=scale)=>{const l=90+(s-1)*170;return{x:Math.max(-l,Math.min(l,x)),y:Math.max(-l*.62,Math.min(l*.62,y))}};
  const zoom=(next,cx=0,cy=0)=>{const s=Math.max(.85,Math.min(2.8,next)),r=s/scale;setScale(s);setPan(clamp(cx-(cx-pan.x)*r,cy-(cy-pan.y)*r,s));};
  const down=e=>{e.currentTarget.setPointerCapture(e.pointerId);setDrag({sx:e.clientX,sy:e.clientY,px:pan.x,py:pan.y})};
  const move=e=>{if(!drag)return;setPan(clamp(drag.px+e.clientX-drag.sx,drag.py+e.clientY-drag.sy))};
  return <div className="detailMapWrap">
    <div className="mapToolbar"><div><b>บ้านแสนอบอุ่น • Interactive Map</b><span>แตะสิ่งของเพื่อเรียนคำศัพท์ • ปัดเพื่อเลื่อน • Pinch / ล้อเมาส์เพื่อซูม</span></div><div className="mapControls"><button onClick={()=>zoom(scale-.2)}>−</button><span>{Math.round(scale*100)}%</span><button onClick={()=>zoom(scale+.2)}>+</button><button onClick={()=>{setScale(1);setPan({x:0,y:0})}}><RotateCcw size={15}/></button></div></div>
    <div className="detailMap" onPointerDown={down} onPointerMove={move} onPointerUp={()=>setDrag(null)} onPointerCancel={()=>setDrag(null)} onWheel={e=>{e.preventDefault();zoom(scale+(e.deltaY<0?.12:-.12),e.nativeEvent.offsetX-180,e.nativeEvent.offsetY-100)}} style={{touchAction:"none"}}>
      <div className="mapCanvas" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`}}>
        <div className="roomZone bedroomZone"><strong>BEDROOM</strong><small>15 words</small><div className="wallFurniture bedFurniture">🛏️</div><div className="wallFurniture wardrobeFurniture">🚪</div><div className="wallFurniture deskFurniture">🪑</div><div className="rug bedroomRug">• • • • •</div></div>
        <div className="roomZone kitchenZone"><strong>KITCHEN</strong><small>12 words</small><div className="counter">🍳 🫖 🍽️ 🥄</div><div className="sink">🚰</div><div className="kitchenTable">🍎</div></div>
        <div className="roomZone livingZone"><strong>LIVING ROOM</strong><small>14 words</small><div className="sofaFurniture">🛋️</div><div className="bookFurniture">📚</div><div className="tvFurniture">📺</div><div className="livingRug">▦ ▦ ▦</div></div>
        <div className="roomZone gardenZone"><strong>BACKYARD</strong><small>12 words</small><div className="gardenItems">🌳 🪴 🌷</div><div className="slideFurniture">🛝</div></div>
        {objects.map(o=><button key={o.id} className={`mapObject ${active===o.id?"active":""}`} style={{left:`${o.x}%`,top:`${o.y}%`,"--obj":o.c}} onClick={e=>{e.stopPropagation();setActive(o.id);if(vocabulary[o.id])onSelectWord(o.id)}}><span>{o.e}</span><small>{o.label}</small></button>)}
        <button className="roomBadge bedroomBadge" onClick={()=>onSelectRoom("bedroom")}>🛏️ ห้องนอน</button><button className="roomBadge kitchenBadge" onClick={()=>onSelectRoom("kitchen")}>🍳 ห้องครัว</button><button className="roomBadge livingBadge" onClick={()=>onSelectRoom("living")}>🛋️ ห้องนั่งเล่น</button><div className="lockedBadge">🔒 ห้องน้ำ • 50 ⭐</div>
      </div>
    </div>
    <div className="mapHint">💡 ห้องหนึ่งมีของใช้หลายชนิด — แตะของแต่ละชิ้นเพื่อเรียนคำศัพท์เฉพาะของห้องนั้น</div>
  </div>;
}

function RoomCard({room,onOpen}) {
  const Icon = room.icon;
  return <div className={`roomCard ${room.color} ${room.locked ? "locked":""}`}>
    <div className="roomIcon"><Icon size={25}/></div>
    {room.locked && <LockKeyhole className="lock" size={18}/>}
    <div className="roomInfo">
      <span className="tiny">{room.locked ? "ล็อกอยู่" : "หมวดหลัก"}</span>
      <h3>{room.title} <em>({room.en})</em></h3>
      <p>{room.words.slice(0,3).join(", ")}...</p>
    </div>
    <div className="roomStars">{room.locked ? "🔒" : "☆ ☆ ☆"}<small>{room.count} / {room.total} คำ</small></div>
    {!room.locked && <button onClick={()=>onOpen(room.id)}>เข้าสำรวจ</button>}
  </div>
}

function WordCard({word,onOpen}) {
  const d=vocabulary[word];
  return <button className="wordCard" onClick={()=>onOpen(word)}>
    <div className="wordEmoji">{d.emoji}</div>
    <div><b>{word}</b><span>{d.th}</span><small>/{d.pron}/</small></div>
    <Volume2 size={18}/>
  </button>
}

function WordModal({w,onClose,onLearn}) {
  const d=vocabulary[w];
  const [saved,setSaved]=useState(false);
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal">
      <div className="modalTop">
        <span className="tag">⭐ หมวด{d.room} • ระดับใกล้ตัว</span>
        <button onClick={onClose}><X size={21}/></button>
      </div>
      <div className="wordHero">
        <div>
          <h1>{w}</h1>
          <div className="pron">/{d.pron}/ <span>•</span> {d.th}</div>
        </div>
        <button className="speakBig" onClick={()=>speak(w)}><Volume2 size={27}/></button>
      </div>
      <div className="meaning"><span>ความหมาย:</span><b>{d.th}</b></div>
      <div className="sentence"><small>▣ ตัวอย่างประโยค</small><strong>"{d.sentence}"</strong><span>({d.sentenceTh})</span></div>
      <div className="tip"><Sparkles size={19}/> เกร็ดความรู้สำหรับหนู: ฝึกพูดคำนี้ช้า ๆ 2 รอบ แล้วลองใช้ในประโยคของตัวเองนะ!</div>
      <div className="modalActions">
        <button className={`learnBtn ${saved ? "done":""}`} onClick={()=>{setSaved(true);onLearn()}}>{saved ? <><Check size={18}/> จำได้แล้ว!</> : <><Star size={18}/> จำได้แล้ว! (+10 ดาว)</>}</button>
        <button className="saveBtn" onClick={()=>setSaved(v=>!v)}>{saved ? "★ บันทึกแล้ว" : "☆ บันทึกสมุดคำศัพท์"}</button>
      </div>
    </div>
  </div>
}

function Quiz({onEarn}) {
  const [idx,setIdx]=useState(0), [chosen,setChosen]=useState(null);
  const qs=[
    {w:"Alarm Clock", answer:"นาฬิกาปลุก", options:["นาฬิกาปลุก","ตู้เสื้อผ้า","โคมไฟ","หมอน"]},
    {w:"Sofa", answer:"โซฟา", options:["ช้อน","โซฟา","เตา","พรม"]},
    {w:"Kettle", answer:"กาต้มน้ำ", options:["จาน","กาต้มน้ำ","เตียง","ประตู"]}
  ];
  const q=qs[idx];
  const choose=(x)=>{setChosen(x); if(x===q.answer) onEarn();};
  return <section className="quiz card">
    <div className="quizBadge">⚡ เกมทบทวน</div>
    <h1>คำนี้แปลว่าอะไร?</h1>
    <div className="quizWord">{q.w}<button onClick={()=>speak(q.w)}><Volume2 size={21}/></button></div>
    <div className="answers">{q.options.map(x=><button className={chosen ? (x===q.answer?"correct":x===chosen?"wrong":""):""} onClick={()=>choose(x)} key={x}>{x}</button>)}</div>
    {chosen && <div className="quizNext"><b>{chosen===q.answer?"เก่งมาก! 🎉":"ลองใหม่อีกครั้งนะ"}</b><button onClick={()=>{setChosen(null);setIdx((idx+1)%qs.length)}}>ข้อถัดไป <ChevronRight size={17}/></button></div>}
  </section>
}

createRoot(document.getElementById("root")).render(<App />);
