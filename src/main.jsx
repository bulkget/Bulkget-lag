import React, { useMemo, useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BedDouble, ChefHat, Sofa, Bath, Flower2, Search, Volume2, X, ZoomIn, ZoomOut, RotateCcw, Move, House, Maximize2 } from "lucide-react";
import "./styles.css";

const scenes = [
  {id:"bedroom", th:"ห้องนอน", en:"Bedroom", icon:BedDouble, theme:"bedroom", subtitle:"เฟอร์นิเจอร์และของใช้ในห้องนอน"},
  {id:"kitchen", th:"ห้องครัว", en:"Kitchen", icon:ChefHat, theme:"kitchen", subtitle:"อุปกรณ์ทำอาหารและของใช้ในครัว"},
  {id:"living", th:"ห้องนั่งเล่น", en:"Living Room", icon:Sofa, theme:"living", subtitle:"เฟอร์นิเจอร์และอุปกรณ์ในห้องนั่งเล่น"},
  {id:"bathroom", th:"ห้องน้ำ", en:"Bathroom", icon:Bath, theme:"bathroom", subtitle:"ของใช้ส่วนตัวและอุปกรณ์ในห้องน้ำ"},
  {id:"garden", th:"สวน", en:"Garden", icon:Flower2, theme:"garden", subtitle:"ต้นไม้ ของใช้ และสิ่งต่าง ๆ ในสวน"}
];

const rawWords = {
 bedroom: [
  ["bed","เตียง","เบด","🛏️","The bed is comfortable.","เตียงนอนสบาย"],["pillow","หมอน","พิล-โลว์","🛌","My pillow is soft.","หมอนของฉันนุ่ม"],["blanket","ผ้าห่ม","แบลง-คิท","🧺","The blanket is warm.","ผ้าห่มอุ่น"],["bedsheet","ผ้าปูที่นอน","เบด-ชีต","🛏️","The bedsheet is clean.","ผ้าปูที่นอนสะอาด"],["mattress","ที่นอน","แมท-เทรส","🛌","This mattress is thick.","ที่นอนนี้หนา"],["wardrobe","ตู้เสื้อผ้า","วอร์ด-โรบ","🚪","My clothes are in the wardrobe.","เสื้อผ้าอยู่ในตู้เสื้อผ้า"],["hanger","ไม้แขวนเสื้อ","แฮง-เกอร์","🪝","Put your shirt on a hanger.","แขวนเสื้อบนไม้แขวน"],["bedside table","โต๊ะข้างเตียง","เบด-ไซด์ เท-เบิล","🗄️","The book is on the bedside table.","หนังสืออยู่บนโต๊ะข้างเตียง"],["alarm clock","นาฬิกาปลุก","อะ-ลาร์ม คล็อก","⏰","My alarm clock rings at seven.","นาฬิกาปลุกของฉันดังตอนเจ็ดโมง"],["lamp","โคมไฟ","แลมพ์","💡","Turn on the lamp.","เปิดโคมไฟ"],["curtain","ผ้าม่าน","เคอร์-เทิน","🪟","Close the curtain, please.","ช่วยปิดผ้าม่านหน่อย"],["window","หน้าต่าง","วิน-โดว์","🪟","The window is open.","หน้าต่างเปิดอยู่"],["door","ประตู","ดอร์","🚪","Close the door.","ปิดประตู"],["mirror","กระจก","มิ-เรอร์","🪞","I look in the mirror.","ฉันส่องกระจก"],["dresser","โต๊ะเครื่องแป้ง","เดรส-เซอร์","🪞","Her dresser is tidy.","โต๊ะเครื่องแป้งของเธอเป็นระเบียบ"],["drawer","ลิ้นชัก","ดรอ-เออร์","🗄️","The socks are in the drawer.","ถุงเท้าอยู่ในลิ้นชัก"],["desk","โต๊ะเขียนหนังสือ","เดสก์","🪑","I study at my desk.","ฉันอ่านหนังสือที่โต๊ะ"],["chair","เก้าอี้","แชร์","🪑","The chair is by the desk.","เก้าอี้อยู่ข้างโต๊ะ"],["book","หนังสือ","บุ๊ก","📘","I read a book before bed.","ฉันอ่านหนังสือก่อนนอน"],["bookshelf","ชั้นหนังสือ","บุ๊ก-เชลฟ์","📚","The books are on the bookshelf.","หนังสืออยู่บนชั้น"],["rug","พรม","รัก","🟫","The rug is beside the bed.","พรมอยู่ข้างเตียง"],["slippers","รองเท้าแตะใส่ในบ้าน","สลิพ-เพอร์ส","🩴","My slippers are under the bed.","รองเท้าแตะอยู่ใต้เตียง"],["laundry basket","ตะกร้าผ้า","ลอน-ดรี แบส-คิท","🧺","Put the clothes in the laundry basket.","ใส่เสื้อผ้าลงตะกร้า"],["fan","พัดลม","แฟน","🪭","The fan is on.","พัดลมเปิดอยู่"],["air conditioner","เครื่องปรับอากาศ","แอร์ คัน-ดิช-เชอะ-เนอร์","❄️","The air conditioner is cold.","เครื่องปรับอากาศเย็น"],["picture frame","กรอบรูป","พิค-เชอร์ เฟรม","🖼️","There is a picture frame on the wall.","มีกรอบรูปบนผนัง"],["plant","ต้นไม้","แพลนท์","🪴","The plant is near the window.","ต้นไม้อยู่ใกล้หน้าต่าง"],["wastebasket","ถังขยะ","เวสต์-แบส-คิท","🗑️","Throw it in the wastebasket.","ทิ้งมันลงถังขยะ"],["clock","นาฬิกา","คล็อก","🕒","The clock is on the wall.","นาฬิกาอยู่บนผนัง"],["phone charger","ที่ชาร์จโทรศัพท์","โฟน ชาร์จ-เจอร์","🔌","I need my phone charger.","ฉันต้องใช้ที่ชาร์จโทรศัพท์"]
 ],
 kitchen: [
  ["stove","เตา","สโตฟ","🔥","The soup is on the stove.","ซุปอยู่บนเตา"],["oven","เตาอบ","อัฟ-เวิน","♨️","The bread is in the oven.","ขนมปังอยู่ในเตาอบ"],["microwave","ไมโครเวฟ","ไม-โคร-เวฟ","📡","Heat the food in the microwave.","อุ่นอาหารในไมโครเวฟ"],["refrigerator","ตู้เย็น","ริ-ฟริจ-เจอะ-เร-เทอร์","🧊","The milk is in the refrigerator.","นมอยู่ในตู้เย็น"],["freezer","ช่องแช่แข็ง","ฟรี-เซอร์","❄️","Ice cream is in the freezer.","ไอศกรีมอยู่ในช่องแช่แข็ง"],["kettle","กาต้มน้ำ","เคท-เทิล","🫖","The kettle is boiling.","น้ำในกากำลังเดือด"],["frying pan","กระทะ","ฟราย-อิง แพน","🍳","Fry an egg in the frying pan.","ทอดไข่ในกระทะ"],["pot","หม้อ","พ็อต","🍲","The pot is full of soup.","หม้อเต็มไปด้วยซุป"],["lid","ฝาหม้อ","ลิด","🥘","Put the lid on the pot.","ปิดฝาหม้อ"],["spatula","ตะหลิว","สแพช-ชู-ละ","🥄","Use a spatula to flip it.","ใช้ตะหลิวกลับด้าน"],["knife","มีด","ไนฟ์","🔪","The knife is sharp.","มีดคม"],["cutting board","เขียง","คัท-ทิง บอร์ด","🪵","Cut the carrot on the cutting board.","หั่นแครอตบนเขียง"],["spoon","ช้อน","สปูน","🥄","I need a spoon.","ฉันต้องการช้อน"],["fork","ส้อม","ฟอร์ก","🍴","Use a fork to eat pasta.","ใช้ส้อมกินพาสต้า"],["plate","จาน","เพลท","🍽️","The plate is on the table.","จานอยู่บนโต๊ะ"],["bowl","ชาม","โบล","🥣","Put the rice in a bowl.","ใส่ข้าวลงในชาม"],["cup","ถ้วย","คัพ","☕","This cup is clean.","ถ้วยใบนี้สะอาด"],["glass","แก้วน้ำ","กลาส","🥛","A glass of water, please.","ขอน้ำหนึ่งแก้ว"],["mug","แก้วมัค","มัก","☕","Coffee is in my mug.","กาแฟอยู่ในแก้วมัค"],["sink","อ่างล้างจาน","ซิงก์","🚰","Wash the dishes in the sink.","ล้างจานในอ่าง"],["tap","ก๊อกน้ำ","แทพ","🚿","Turn off the tap.","ปิดก๊อกน้ำ"],["dish rack","ที่คว่ำจาน","ดิช แรค","🍽️","The plates are in the dish rack.","จานอยู่ในที่คว่ำจาน"],["sponge","ฟองน้ำ","สพันจ์","🧽","Use a sponge to clean the pan.","ใช้ฟองน้ำล้างกระทะ"],["dish soap","น้ำยาล้างจาน","ดิช โซพ","🧴","We need more dish soap.","เราต้องการน้ำยาล้างจานเพิ่ม"],["trash can","ถังขยะ","แทรช แคน","🗑️","Put the trash in the can.","ทิ้งขยะลงถัง"],["countertop","เคาน์เตอร์ครัว","เคาน์-เทอร์-ท็อป","🪵","The apples are on the countertop.","แอปเปิลอยู่บนเคาน์เตอร์"],["cabinet","ตู้เก็บของ","แคบ-บิ-เน็ต","🗄️","The cups are in the cabinet.","ถ้วยอยู่ในตู้"],["blender","เครื่องปั่น","เบลน-เดอร์","🥤","I use a blender for smoothies.","ฉันใช้เครื่องปั่นทำสมูทที"],["toaster","เครื่องปิ้งขนมปัง","โทส-เทอร์","🍞","The toast is in the toaster.","ขนมปังอยู่ในเครื่องปิ้ง"],["apron","ผ้ากันเปื้อน","เอ-พรอน","👩‍🍳","Wear an apron while cooking.","ใส่ผ้ากันเปื้อนตอนทำอาหาร"]
 ],
 living: [
  ["sofa","โซฟา","โซ-ฟะ","🛋️","Sit on the sofa.","นั่งบนโซฟา"],["armchair","เก้าอี้มีที่วางแขน","อาร์ม-แชร์","🪑","Grandpa sits in the armchair.","คุณตานั่งบนเก้าอี้มีที่วางแขน"],["coffee table","โต๊ะกลาง","คอฟ-ฟี เท-เบิล","🪵","The remote is on the coffee table.","รีโมตอยู่บนโต๊ะกลาง"],["television","โทรทัศน์","เทล-ละ-วิช-เชิน","📺","We watch television at night.","เราดูโทรทัศน์ตอนกลางคืน"],["remote control","รีโมต","ริ-โมต คัน-โทรล","🎛️","Where is the remote control?","รีโมตอยู่ที่ไหน"],["bookshelf","ชั้นหนังสือ","บุ๊ก-เชลฟ์","📚","The bookshelf is tall.","ชั้นหนังสือสูง"],["book","หนังสือ","บุ๊ก","📕","This book is interesting.","หนังสือเล่มนี้น่าสนใจ"],["floor lamp","โคมไฟตั้งพื้น","ฟลอร์ แลมพ์","💡","The floor lamp is beside the sofa.","โคมไฟตั้งพื้นอยู่ข้างโซฟา"],["ceiling light","ไฟเพดาน","ซี-ลิง ไลท์","💡","Turn on the ceiling light.","เปิดไฟเพดาน"],["curtain","ผ้าม่าน","เคอร์-เทิน","🪟","The curtains are blue.","ผ้าม่านสีฟ้า"],["window","หน้าต่าง","วิน-โดว์","🪟","Look out of the window.","มองออกไปนอกหน้าต่าง"],["picture","รูปภาพ","พิค-เชอร์","🖼️","The picture is on the wall.","รูปภาพอยู่บนผนัง"],["photo frame","กรอบรูปถ่าย","โฟ-โท เฟรม","🖼️","That photo frame is lovely.","กรอบรูปนั้นสวย"],["carpet","พรม","คาร์-เพ็ต","🟫","The carpet feels soft.","พรมสัมผัสนุ่ม"],["cushion","หมอนอิง","คุช-เชิน","🟠","Put a cushion on the sofa.","วางหมอนอิงบนโซฟา"],["throw blanket","ผ้าคลุมโซฟา","โธรว์ แบลง-คิท","🧣","The throw blanket is warm.","ผ้าคลุมโซฟาอุ่น"],["plant pot","กระถางต้นไม้","แพลนท์ พ็อต","🪴","The plant pot is beside the window.","กระถางต้นไม้อยู่ข้างหน้าต่าง"],["vase","แจกัน","เวส","🏺","There are flowers in the vase.","มีดอกไม้ในแจกัน"],["flower","ดอกไม้","ฟลาว-เออร์","🌷","The flower is beautiful.","ดอกไม้สวย"],["speaker","ลำโพง","สปีค-เคอร์","🔊","The speaker plays music.","ลำโพงเปิดเพลง"],["game controller","จอยเกม","เกม คัน-โทรล-เลอร์","🎮","The game controller is black.","จอยเกมสีดำ"],["router","เราเตอร์","เรา-เทอร์","📶","The router is near the TV.","เราเตอร์อยู่ใกล้ทีวี"],["air conditioner","เครื่องปรับอากาศ","แอร์ คัน-ดิช-เชอะ-เนอร์","❄️","The air conditioner cools the room.","แอร์ทำให้ห้องเย็น"],["fan","พัดลม","แฟน","🪭","The fan is spinning.","พัดลมกำลังหมุน"],["clock","นาฬิกา","คล็อก","🕒","The clock says three o'clock.","นาฬิกาบอกเวลาสามโมง"],["side table","โต๊ะข้างโซฟา","ไซด์ เท-เบิล","🗄️","Put the cup on the side table.","วางถ้วยบนโต๊ะข้างโซฟา"],["ottoman","สตูลวางเท้า","ออท-ทะ-มัน","🪑","Rest your feet on the ottoman.","วางเท้าบนสตูล"],["magazine","นิตยสาร","แมก-กะ-ซีน","📰","She reads a magazine.","เธออ่านนิตยสาร"],["coaster","ที่รองแก้ว","โคส-เทอร์","⭕","Use a coaster for your drink.","ใช้ที่รองแก้วสำหรับเครื่องดื่ม"],["wastebasket","ถังขยะ","เวสต์-แบส-คิท","🗑️","The wastebasket is by the sofa.","ถังขยะอยู่ข้างโซฟา"]
 ],
 bathroom: [
  ["sink","อ่างล้างหน้า","ซิงก์","🚰","Wash your hands in the sink.","ล้างมือที่อ่าง"],["faucet","ก๊อกน้ำ","ฟอ-เซ็ต","🚿","The faucet is shiny.","ก๊อกน้ำเงาวาว"],["mirror","กระจก","มิ-เรอร์","🪞","Look in the mirror.","มองในกระจก"],["toothbrush","แปรงสีฟัน","ทูธ-บรัช","🪥","My toothbrush is blue.","แปรงสีฟันของฉันสีฟ้า"],["toothpaste","ยาสีฟัน","ทูธ-เพสต์","🧴","Squeeze the toothpaste.","บีบยาสีฟัน"],["soap","สบู่","โซพ","🧼","Use soap to wash your hands.","ใช้สบู่ล้างมือ"],["soap dispenser","ขวดกดสบู่","โซพ ดิส-เพน-เซอร์","🧴","The soap dispenser is full.","ขวดกดสบู่เต็ม"],["shampoo","แชมพู","แชม-พู","🧴","I need more shampoo.","ฉันต้องการแชมพูเพิ่ม"],["conditioner","ครีมนวดผม","คัน-ดิช-เชิน-เนอร์","🧴","Use conditioner after shampoo.","ใช้ครีมนวดหลังสระผม"],["shower","ฝักบัว","เชา-เออร์","🚿","The shower is hot.","ฝักบัวน้ำร้อน"],["showerhead","หัวฝักบัว","เชา-เออร์-เฮด","🚿","Clean the showerhead.","ทำความสะอาดหัวฝักบัว"],["bathtub","อ่างอาบน้ำ","บาธ-ทับ","🛁","The bathtub is full of water.","อ่างอาบน้ำเต็มไปด้วยน้ำ"],["bath mat","พรมเช็ดเท้า","บาธ แมท","🟫","Stand on the bath mat.","ยืนบนพรมเช็ดเท้า"],["towel","ผ้าเช็ดตัว","ทาว-เอิล","🧖","Dry yourself with a towel.","เช็ดตัวด้วยผ้าเช็ดตัว"],["hand towel","ผ้าเช็ดมือ","แฮนด์ ทาว-เอิล","🧻","The hand towel is clean.","ผ้าเช็ดมือสะอาด"],["toilet","โถสุขภัณฑ์","ทอย-เล็ท","🚽","Flush the toilet.","กดชักโครก"],["toilet paper","กระดาษชำระ","ทอย-เล็ท เพ-เพอร์","🧻","There is toilet paper on the holder.","มีกระดาษชำระบนที่แขวน"],["toilet brush","แปรงขัดโถ","ทอย-เล็ท บรัช","🪥","The toilet brush is in the holder.","แปรงขัดโถอยู่ในที่ใส่"],["bathrobe","เสื้อคลุมอาบน้ำ","บาธ-โรบ","🥋","Put on your bathrobe.","สวมเสื้อคลุมอาบน้ำ"],["laundry hamper","ตะกร้าผ้าใช้แล้ว","ลอน-ดรี แฮม-เพอร์","🧺","Put wet towels in the hamper.","ใส่ผ้าเช็ดตัวเปียกในตะกร้า"],["scale","เครื่องชั่งน้ำหนัก","สเคล","⚖️","The scale is on the floor.","เครื่องชั่งอยู่บนพื้น"],["cabinet","ตู้เก็บของ","แคบ-บิ-เน็ต","🗄️","The medicine is in the cabinet.","ของใช้เก็บอยู่ในตู้"],["shelf","ชั้นวาง","เชลฟ์","🪵","The towels are on the shelf.","ผ้าเช็ดตัวอยู่บนชั้น"],["bathroom rug","พรมห้องน้ำ","บาธ-รูค","🟪","The rug is purple.","พรมสีม่วง"],["window","หน้าต่าง","วิน-โดว์","🪟","Open the bathroom window.","เปิดหน้าต่างห้องน้ำ"],["vent","ช่องระบายอากาศ","เวนท์","🌬️","The vent removes steam.","ช่องระบายอากาศช่วยระบายไอน้ำ"],["hair dryer","ไดร์เป่าผม","แฮร์ ดราย-เออร์","💨","Use a hair dryer to dry your hair.","ใช้ไดร์เป่าผมให้ผมแห้ง"],["comb","หวี","โคม","🪮","I need a comb.","ฉันต้องการหวี"],["cotton swabs","คอตตอนบัด","คอท-เทิน สวอบส์","🧴","Cotton swabs are in the drawer.","คอตตอนบัดอยู่ในลิ้นชัก"],["waste bin","ถังขยะ","เวสต์ บิน","🗑️","Throw it into the waste bin.","ทิ้งลงถังขยะ"]
 ],
 garden: [
  ["tree","ต้นไม้","ทรี","🌳","The tree is tall.","ต้นไม้สูง"],["flower","ดอกไม้","ฟลาว-เออร์","🌷","The flower is red.","ดอกไม้สีแดง"],["grass","หญ้า","กราส","🌱","The grass is green.","หญ้าสีเขียว"],["bush","พุ่มไม้","บุช","🌿","A bird sits in the bush.","นกเกาะอยู่บนพุ่มไม้"],["plant pot","กระถางต้นไม้","แพลนท์ พ็อต","🪴","Water the plant in the pot.","รดน้ำต้นไม้ในกระถาง"],["watering can","บัวรดน้ำ","วอ-เทอ-ริง แคน","🚿","Fill the watering can.","เติมน้ำในบัวรดน้ำ"],["garden hose","สายยาง","การ์-เดิน โฮส","🌀","The garden hose is long.","สายยางสวนยาว"],["shovel","พลั่ว","ชัฟ-เวิล","🪏","Use a shovel to dig.","ใช้พลั่วขุดดิน"],["rake","คราด","เรค","🧹","Rake the fallen leaves.","ใช้คราดเก็บใบไม้"],["trowel","พลั่วมือ","เทรา-เอิล","🛠️","The trowel is for planting.","พลั่วมือใช้ปลูกต้นไม้"],["pruning shears","กรรไกรตัดกิ่ง","พรู-นิง เชียร์ส","✂️","Trim the bush with pruning shears.","ตัดแต่งพุ่มไม้ด้วยกรรไกร"],["wheelbarrow","รถเข็นปูน/สวน","วีล-แบ-โร","🛒","Move soil in the wheelbarrow.","ขนดินด้วยรถเข็น"],["fence","รั้ว","เฟนซ์","🪵","The fence is brown.","รั้วสีน้ำตาล"],["gate","ประตูรั้ว","เกท","🚪","Close the garden gate.","ปิดประตูสวน"],["path","ทางเดิน","พาธ","🪨","The path leads to the house.","ทางเดินไปยังบ้าน"],["bench","ม้านั่ง","เบนช์","🪑","Sit on the garden bench.","นั่งบนม้านั่งในสวน"],["birdbath","อ่างน้ำนก","เบิร์ด-บาธ","🐦","Birds drink from the birdbath.","นกดื่มน้ำจากอ่าง"],["birdhouse","บ้านนก","เบิร์ด-เฮาส์","🏠","A bird lives in the birdhouse.","นกอาศัยในบ้านนก"],["butterfly","ผีเสื้อ","บัท-เทอร์-ฟลาย","🦋","A butterfly lands on the flower.","ผีเสื้อเกาะบนดอกไม้"],["bee","ผึ้ง","บี","🐝","A bee visits the flowers.","ผึ้งบินมาที่ดอกไม้"],["watering sprinkler","สปริงเกลอร์","วอ-เทอ-ริง สปริง-เคลอร์","💦","The sprinkler waters the lawn.","สปริงเกลอร์รดน้ำสนาม"],["pond","บ่อน้ำ","พอนด์","🪷","There are fish in the pond.","มีปลาในบ่อน้ำ"],["rock","ก้อนหิน","ร็อก","🪨","The rock is beside the path.","ก้อนหินอยู่ข้างทาง"],["mushroom","เห็ด","มัช-รูม","🍄","A mushroom grows near the tree.","เห็ดขึ้นใกล้ต้นไม้"],["sunflower","ดอกทานตะวัน","ซัน-ฟลาว-เออร์","🌻","The sunflower faces the sun.","ดอกทานตะวันหันเข้าหาดวงอาทิตย์"],["cactus","กระบองเพชร","แคค-ทัส","🌵","The cactus needs little water.","กระบองเพชรใช้น้ำน้อย"],["garden gloves","ถุงมือทำสวน","การ์-เดิน กลัฟส์","🧤","Wear garden gloves.","สวมถุงมือทำสวน"],["compost bin","ถังปุ๋ยหมัก","คอม-โพสต์ บิน","🗑️","Put leaves in the compost bin.","ใส่ใบไม้ในถังปุ๋ยหมัก"],["swing","ชิงช้า","สวิง","🎠","The child is on the swing.","เด็กกำลังเล่นชิงช้า"],["slide","สไลเดอร์","สไลด์","🛝","The slide is in the backyard.","สไลเดอร์อยู่ในสวนหลังบ้าน"]
 ]
};

const palettes = {
 bedroom:{floor:"#e8e4fa",wall:"#d4cff1",side:"#b4addd",accent:"#24bdb1"},
 kitchen:{floor:"#f6e6cb",wall:"#f4d7a5",side:"#d9b77d",accent:"#f5a126"},
 living:{floor:"#eee1f5",wall:"#d9c2ea",side:"#b99bd0",accent:"#9148d2"},
 bathroom:{floor:"#dceff5",wall:"#bfe0eb",side:"#8dbdcb",accent:"#2996b4"},
 garden:{floor:"#d9edcf",wall:"#c6e3b9",side:"#92bd81",accent:"#46995a"}
};

const allWords = Object.fromEntries(Object.entries(rawWords).map(([room, arr]) => [room, arr.map((w,i)=>({
 id:`${room}-${i}`, word:w[0], th:w[1], pron:w[2], emoji:w[3], sentence:w[4], sentenceTh:w[5], room
}))]));

function speak(word) {
 if (!("speechSynthesis" in window)) return;
 window.speechSynthesis.cancel();
 const u = new SpeechSynthesisUtterance(word);
 u.lang = "en-US"; u.rate = 0.82;
 window.speechSynthesis.speak(u);
}

function App() {
 const [sceneId,setSceneId] = useState("bedroom");
 const [selected,setSelected] = useState(null);
 const [search,setSearch] = useState("");
 const [scale,setScale] = useState(1);
 const [pan,setPan] = useState({x:0,y:0});
 const [orientation,setOrientation] = useState("auto");
 const viewportRef = useRef(null);
 const gesture = useRef(null);
 const scene = scenes.find(s=>s.id===sceneId);
 const words = allWords[sceneId];
 const filtered = useMemo(()=>words.filter(w => `${w.word} ${w.th}`.toLowerCase().includes(search.toLowerCase())),[words,search]);
 const palette = palettes[sceneId];

 useEffect(()=>{setScale(1);setPan({x:0,y:0});setSearch("");setSelected(null)},[sceneId]);

 const changeZoom = (next) => setScale(Math.max(.65,Math.min(2.2,next)));
 const resetView = () => {setScale(1);setPan({x:0,y:0})};

 const onPointerDown = e => {
   if (e.target.closest(".vocab-object")) return;
   const el=viewportRef.current;
   if(!el) return;
   el.setPointerCapture?.(e.pointerId);
   gesture.current={type:"pan",id:e.pointerId,x:e.clientX,y:e.clientY,panX:pan.x,panY:pan.y};
 };
 const onPointerMove = e => {
   const g=gesture.current;
   if(!g || g.type!=="pan") return;
   setPan({x:g.panX + e.clientX-g.x,y:g.panY + e.clientY-g.y});
 };
 const onPointerUp = () => {gesture.current=null};
 const onWheel = e => {
   e.preventDefault();
   setScale(s=>Math.max(.65,Math.min(2.2,s+(e.deltaY<0?.08:-.08))));
 };

 // Native two-finger pinch: use pointer distance when two touches are active.
 const activePointers = useRef(new Map());
 const handlePointerDown = e => {
   activePointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(activePointers.current.size===2){
     const pts=[...activePointers.current.values()];
     gesture.current={type:"pinch",distance:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),startScale:scale};
     return;
   }
   onPointerDown(e);
 };
 const handlePointerMove = e => {
   if(activePointers.current.has(e.pointerId)) activePointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(activePointers.current.size>=2 && gesture.current?.type==="pinch"){
     const pts=[...activePointers.current.values()];
     const d=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
     setScale(Math.max(.65,Math.min(2.2,gesture.current.startScale*d/gesture.current.distance)));
     return;
   }
   onPointerMove(e);
 };
 const handlePointerUp = e => {activePointers.current.delete(e.pointerId);onPointerUp()};

 return <div className={`app orientation-${orientation}`}>
   <header className="topbar">
    <div className="brand"><div className="brand-mark"><House size={22}/></div><div><b>VocabRoom Explorer</b><span>3D OBJECT MAP</span></div></div>
    <div className="header-note">แตะสิ่งของเพื่อดูคำศัพท์</div>
   </header>

   <main>
    <section className="intro">
     <div><span className="eyebrow">EXPLORE EVERY ROOM</span><h1>แผนที่คำศัพท์ 3D</h1><p>เลือกห้อง แล้วแตะสิ่งของภายในฉากเพื่อดูความหมายและฟังเสียงภาษาอังกฤษ</p></div>
     <div className="room-count"><strong>{words.length}</strong><span>คำศัพท์ในฉากนี้</span></div>
    </section>

    <nav className="scene-tabs" aria-label="หมวดหมู่ห้อง">
     {scenes.map(s=>{const Icon=s.icon;return <button key={s.id} className={`scene-tab ${sceneId===s.id?"active":""}`} onClick={()=>setSceneId(s.id)}>
       <span className={`tab-icon ${s.theme}`}><Icon size={19}/></span><span className="tab-copy"><b>{s.th}</b><small>{s.en}</small></span><span className="tab-total">30</span>
      </button>})}
    </nav>

    <section className="workspace">
     <div className="map-heading">
      <div><div className="map-title"><span className={`scene-dot ${scene.theme}`}></span><h2>{scene.th} <small>({scene.en})</small></h2></div><p>{scene.subtitle} · 30 จุดให้แตะดูคำศัพท์</p></div>
      <div className="map-actions">
       <button onClick={()=>changeZoom(scale-.15)} aria-label="ซูมออก"><ZoomOut size={17}/></button><span>{Math.round(scale*100)}%</span><button onClick={()=>changeZoom(scale+.15)} aria-label="ซูมเข้า"><ZoomIn size={17}/></button><button onClick={resetView} aria-label="รีเซ็ตแผนที่"><RotateCcw size={16}/></button>
       <button className={`orientation-toggle ${orientation==="landscape"?"chosen":""}`} onClick={()=>setOrientation(o=>o==="landscape"?"auto":"landscape")} title="โหมดแผนที่แนวนอน"><Maximize2 size={16}/><span>แนวนอน</span></button>
      </div>
     </div>

     <div className={`map-viewport theme-${sceneId}`} ref={viewportRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={onWheel}>
      <div className="map-world" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`, "--floor":palette.floor,"--wall":palette.wall,"--side":palette.side}}>
       <div className="room-shell">
        <div className="back-wall"><span className="wall-sign">{scene.en.toUpperCase()}</span><div className="wall-window"><i/><i/><i/><i/></div><div className="wall-picture">🌿</div></div>
        <div className="left-wall"><div className="wall-shelf">▰<br/>▰<br/>▰</div><div className="wall-decor">✦</div></div>
        <div className="room-floor">
         <div className={`floor-rug rug-${sceneId}`}></div>
         <div className={`large-furniture furniture-${sceneId}`}>{sceneId==="bedroom"?"🛏️":sceneId==="kitchen"?"🍳":sceneId==="living"?"🛋️":sceneId==="bathroom"?"🛁":"🌳"}</div>
         {filtered.map((w,i)=>{
           const n=words.findIndex(x=>x.id===w.id);
           const pos=positions[n];
           return <button key={w.id} className={`vocab-object ${selected?.id===w.id?"is-selected":""}`} style={{left:`${pos.x}%`,top:`${pos.y}%`,"--accent":palette.accent,"--delay":`${i%7*25}ms`}} onClick={(e)=>{e.stopPropagation();setSelected(w)}} aria-label={`${w.word}, ${w.th}`}>
             <span className="object-shadow"></span><span className="object-emoji">{w.emoji}</span><span className="object-label">{w.word}</span>
           </button>
         })}
         <div className="floor-marker">TAP AN OBJECT</div>
        </div>
       </div>
      </div>
      <div className="map-overlay top-left"><Move size={14}/><span>ลากเพื่อเลื่อน</span></div>
      <div className="map-overlay bottom-right"><span>แตะสิ่งของเพื่อเปิดคำศัพท์</span></div>
     </div>

     <div className="map-footer"><span><i className="legend-dot" style={{background:palette.accent}}/> แสดง {filtered.length} จาก 30 สิ่งของ</span><span>ใช้นิ้วสองนิ้วเพื่อซูม · รองรับแนวตั้งและแนวนอน</span></div>
    </section>

    <section className="word-browser">
     <div className="browser-heading"><div><h2>สิ่งของใน{scene.th}</h2><p>เลือกจากรายการได้เช่นกัน</p></div><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาคำศัพท์..." /></label></div>
     <div className="word-list">{filtered.map(w=><button key={w.id} className={`word-row ${selected?.id===w.id?"selected":""}`} onClick={()=>setSelected(w)}><span className="word-emoji">{w.emoji}</span><span className="word-row-text"><b>{w.word}</b><small>{w.th}</small></span><Volume2 size={16}/></button>)}</div>
    </section>
   </section>
   </main>

   {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}>
    <section className="word-modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="รายละเอียดคำศัพท์">
     <div className={`modal-top theme-${sceneId}`}><span>{scene.th} · {scene.en}</span><button onClick={()=>setSelected(null)} aria-label="ปิด"><X size={20}/></button></div>
     <div className="modal-body">
      <div className="word-hero"><span className="hero-emoji">{selected.emoji}</span><div className="hero-word"><h2>{selected.word}</h2><p>/{selected.pron}/</p></div><button className="speak-button" onClick={()=>speak(selected.word)} aria-label="ฟังเสียง"><Volume2 size={23}/></button></div>
      <div className="meaning"><small>ความหมาย</small><strong>{selected.th}</strong></div>
      <div className="example"><small>ตัวอย่างประโยค</small><p>“{selected.sentence}”</p><span>{selected.sentenceTh}</span></div>
      <button className="modal-close" onClick={()=>setSelected(null)}>กลับไปที่แผนที่</button>
     </div>
    </section>
   </div>}
   <footer>VocabRoom Explorer · 3D Room Vocabulary Map</footer>
  </div>
}

// Carefully spaced 30 clickable vocabulary points distributed across the floor.
const positions = Array.from({length:30},(_,i)=>({
 x: 9 + (i%6)*16.2 + (Math.floor(i/6)%2)*2.5,
 y: 16 + Math.floor(i/6)*17.2
}));

createRoot(document.getElementById("root")).render(<App />);
