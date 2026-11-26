// 车库养成系统：改用幼儿园小朋友一眼看懂的「金钥匙 🔑」直观解锁机制
// 保持同等收集难度（每攒满 10 格能量灯 = 1 把金钥匙），拒绝看不懂的几百上千大数字！

export const GARAGE_CARS = [
  { id: 'wuling', name: '五菱宏光萌萌车', costKeys: 0, desc: '方方正正双门小电车，送给小小车手的第一辆车！' },
  { id: 'xiaomi', name: '小米 SU7 疾风号', costKeys: 4, desc: '流线型轿跑，标志性水滴大灯和运动溜背！' },
  { id: 'byd', name: '比亚迪 汉 龙颜轿跑', costKeys: 6, desc: '低趴运动轿跑，帅气龙颜前脸和贯穿尾灯！' },
  { id: 'tank', name: '坦克 300 越野王', costKeys: 8, desc: '复古圆眼大灯、方盒子车身和背挂小书包备胎！' },
  { id: 'bmw', name: '宝马 运动轿跑', costKeys: 10, desc: '经典双肾格栅、天使眼大灯和霍氏拐角车窗！' },
  { id: 'hongqi', name: '红旗 H9 礼宾车', costKeys: 12, desc: '大气直瀑前脸、红色中轴旗标和双色豪华车身！' },
  { id: 'tesla', name: '特斯拉 未来电车', costKeys: 15, desc: '极简无格栅封闭前脸、大玻璃全景天幕！' },
  { id: 'mercedes', name: '奔驰 大G 越野王', costKeys: 18, desc: '经典方盒子硬派越野、圆形大灯和外挂圆备胎！' },
  { id: 'yangwang', name: '仰望 U8 超级越野', costKeys: 22, desc: '霸气大尺寸硬派方盒、八边形书包备胎和梯形轮眉！' },
  { id: 'porsche', name: '保时捷 911 蛙眼跑车', costKeys: 26, desc: '标志性青蛙圆眼睛、大溜背曲线和动感尾翼！' },
  { id: 'ferrari', name: '法拉利 红色闪电', costKeys: 32, desc: '超低趴楔形超跑车身、侧进气风道和碳纤扩散器！' }
];

export const GARAGE_THEMES = [
  {
    id: 'sunny', name: '阳光小镇展厅', costKeys: 0, tag: 'DAYLIGHT',
    bg: 'linear-gradient(180deg, #D9E8F5 0%, #F2F5F8 66%, #333B4A 66%, #1E2430 100%)'
  },
  {
    id: 'racing', name: '冠军赛道维修站', costKeys: 5, tag: 'PIT STOP',
    bg: 'linear-gradient(180deg, #272D3B 0%, #1B202A 66%, #3B4252 66%, #151922 100%)'
  },
  {
    id: 'forest', name: '山野露营基地', costKeys: 8, tag: 'OUTDOOR',
    bg: 'linear-gradient(180deg, #BAE6FD 0%, #DCFCE7 66%, #4B5563 66%, #374151 100%)'
  },
  {
    id: 'space', name: '星际未来车房', costKeys: 12, tag: 'COSMOS',
    bg: 'linear-gradient(180deg, #111827 0%, #1E1B4B 66%, #312E81 66%, #0F172A 100%)'
  }
];

export const GARAGE_DECORS = [
  { id: 'flags', name: '黑白格子旗', badge: 'FLAG', costKeys: 3 },
  { id: 'cone', name: '赛道桩桶', badge: 'CONE', costKeys: 4 },
  { id: 'trophy', name: '冠军奖杯', badge: 'CUP', costKeys: 5 },
  { id: 'wash', name: '泡泡洗车架', badge: 'WASH', costKeys: 6 },
  { id: 'lift', name: '升降举升机', badge: 'LIFT', costKeys: 7 },
  { id: 'podium', name: '领奖台聚光灯', badge: 'SPOT', costKeys: 9 }
];
