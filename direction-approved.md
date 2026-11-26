# Direction Approved — 小小车标大冒险

- **Approved Direction**: 方向 A · 迷你驾驶舱（Mini Cockpit）
- **User Decision**: "这种初稿没必要部署，我已经了解了。选择方向 A 来进行修改。但是车库里可以换颜色的小汽车画的过于抽象了，画的好一点，最好能对应上真实解锁的车辆，抓住重点进行描绘。点画面放大车标的功能，其实只是放大了画面，并没有放大车标所在的画面，甚至放大后，看不到车标了。这也是非常大的问题需要修改。目前的奖惩机制，车币的数字太大，幼儿园的小朋友看不懂大数字，也不知道如何在车库里买车需要花多少钱。请换成一种更直观的方法，但又不能降低获取的难度。接下来，我们进一步扩大车标库，扩充到 88 个。"
- **Core Redesign Scope**:
  1. Remove `design-demos/` temporary previews.
  2. Apply **Direction A (Mini Cockpit)** across the entire app (matte warm-gray chassis `#ECEEF2`, dark carbon instrument deck `#1A1F29`, signal orange-red `#FF4F17`, telemetry green `#16A34A`, zero Emoji UI icons, odometer gauge ticks, physical `ENGINE START` button, automotive viewfinder HUD).
  3. Individually draw high-detail, model-accurate, recolorable SVG vehicles for all 11 unlockable garage cars (`wuling, xiaomi, byd, tank, bmw, hongqi, tesla, mercedes, yangwang, porsche, ferrari`).
  4. Fix real-car emblem zoom: use full-frame `object-fit: contain` inside dark viewfinder so nothing is pre-cropped, add calibrated focal points + true interactive magnifying loupe / pan-and-zoom directly on the car's emblem.
  5. Replace large coin numbers (100–1000) with a kindergarten-intuitive **10-Slot Energy Bar + Gold Key (`金钥匙`)** reward system preserving exact unlock difficulty, with visual key-slot progress & instant green "可以领新车啦" cues in Garage.
  6. Expand brand library from 50 → 88 real car brands with official logos and real car photos.
