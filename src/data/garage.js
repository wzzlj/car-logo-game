// 车库养成系统：可解锁的梦幻爱车、车库背景主题、趣味装饰摆件

export const GARAGE_CARS = [
  { id: 'wuling', name: '五菱宏光萌萌车', cost: 0, desc: '送给小小车手的第一辆可爱小车！' },
  { id: 'xiaomi', name: '小米 SU7 疾风号', cost: 40, desc: '海湾蓝流线跑车，按下喇叭超好听！' },
  { id: 'byd', name: '比亚迪 汉 烈焰红', cost: 50, desc: '帅气的中国新能源轿跑！' },
  { id: 'tank', name: '坦克 300 越野王', cost: 70, desc: '方方正正，爬山涉水都不怕！' },
  { id: 'hongqi', name: '红旗 H9 礼宾车', cost: 90, desc: '气派威武的红旗大轿车！' },
  { id: 'yangwang', name: '仰望 U8 超级越野', cost: 120, desc: '会原地转圈圈的超级大车！' },
  { id: 'tesla', name: '特斯拉 闪电红', cost: 100, desc: '静音起飞的未来电动车！' },
  { id: 'porsche', name: '保时捷 911 黄金蛙', cost: 150, desc: '圆眼睛超级跑车！' },
  { id: 'ferrari', name: '法拉利 红色闪电', cost: 200, desc: '梦想中的顶级红色超级跑车！' }
];

export const GARAGE_THEMES = [
  {
    id: 'sunny', name: '阳光小镇车库', cost: 0, emoji: '☀️',
    bg: 'linear-gradient(180deg, #FFE8B6 0%, #FFF6E0 62%, #CBD5E1 62%, #94A3B8 100%)'
  },
  {
    id: 'racing', name: '冠军赛道车房', cost: 60, emoji: '🏁',
    bg: 'linear-gradient(180deg, #FF6B6B 0%, #FFE66D 62%, #334155 62%, #1E293B 100%)'
  },
  {
    id: 'space', name: '星空宇宙基地', cost: 90, emoji: '🚀',
    bg: 'linear-gradient(180deg, #1E1B4B 0%, #4338CA 62%, #312E81 62%, #1E293B 100%)'
  },
  {
    id: 'forest', name: '彩虹森林营地', cost: 80, emoji: '🌈',
    bg: 'linear-gradient(180deg, #A7F3D0 0%, #ECFEFF 62%, #6EE7B7 62%, #34D399 100%)'
  }
];

export const GARAGE_DECORS = [
  { id: 'flags', name: '冠军彩旗', emoji: '🏁', cost: 25 },
  { id: 'trophy', name: '金色奖杯', emoji: '🏆', cost: 35 },
  { id: 'balloons', name: '派对气球', emoji: '🎈', cost: 30 },
  { id: 'dino', name: '恐龙小伙伴', emoji: '🦖', cost: 45 },
  { id: 'bubbles', name: '泡泡洗车机', emoji: '🫧', cost: 40 },
  { id: 'rocket', name: '迷你小火箭', emoji: '🚀', cost: 55 }
];
