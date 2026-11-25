// 关卡系统：14 个精选大关，每关 3～4 个品牌，完整覆盖全部 50 个车标（无遗漏、国产优先）
// 颜色侦探关卡精选具有鲜明标志色的车标，保证公平好玩！

export const MODE_META = {
  listen: { label: '听音选标', emoji: '🔊', color: '#3A86FF' },
  car2logo: { label: '真车配对', emoji: '🚘', color: '#2EC4B6' },
  color: { label: '颜色侦探', emoji: '🎨', color: '#FF9F1C' },
  memory: { label: '翻牌记忆', emoji: '🃏', color: '#8338EC' },
  puzzle: { label: '车标拼图', emoji: '🧩', color: '#FF6B35' },
  boss: { label: 'Boss 快答', emoji: '👑', color: '#EF476F' }
};

export const LEVELS = [
  {
    id: 1, title: '第1关 · 国产明星车', desc: '先认识比亚迪、五菱、小米和红旗！',
    mode: 'listen', emoji: '🌟', color: '#FF6B35',
    brandIds: ['byd', 'wuling', 'xiaomi', 'hongqi'],
    learnFirst: true, rewardCoins: 30
  },
  {
    id: 2, title: '第2关 · 新能源小伙伴', desc: '看真车找车标：蔚来、小鹏、理想、问界',
    mode: 'car2logo', emoji: '⚡', color: '#2EC4B6',
    brandIds: ['nio', 'xpeng', 'lixiang', 'aito'],
    learnFirst: true, rewardCoins: 35
  },
  {
    id: 3, title: '第3关 · 吉利大家族', desc: '吉利、领克、极氪、零跑翻牌配对！',
    mode: 'memory', emoji: '🃏', color: '#8338EC',
    brandIds: ['geely', 'lynkco', 'zeekr', 'leapmotor'],
    learnFirst: true, rewardCoins: 40
  },
  {
    id: 4, title: '第4关 · 国产颜色侦探', desc: '找出正确颜色的车标：小米、红旗、五菱、哈弗',
    mode: 'color', emoji: '🎨', color: '#FF9F1C',
    brandIds: ['xiaomi', 'hongqi', 'wuling', 'haval'],
    learnFirst: false, rewardCoins: 40
  },
  {
    id: 5, title: '第5关 · 比亚迪高端战队', desc: '认识仰望、腾势、方程豹、欧拉！',
    mode: 'listen', emoji: '🔋', color: '#0077B6',
    brandIds: ['yangwang', 'denza', 'fangchengbao', 'ora'],
    learnFirst: true, rewardCoins: 40
  },
  {
    id: 6, title: '第6关 · 越野拼图小勇士', desc: '长城、哈弗、坦克、魏牌四宫格拼图！',
    mode: 'puzzle', emoji: '🏔️', color: '#E85D04',
    brandIds: ['gwm', 'haval', 'tank', 'wey'],
    learnFirst: true, rewardCoins: 45
  },
  {
    id: 7, title: '第7关 · 长安与奇瑞', desc: '看真车认车标：长安、深蓝、阿维塔、奇瑞',
    mode: 'car2logo', emoji: '🚀', color: '#3A86FF',
    brandIds: ['changan', 'deepal', 'avatr', 'chery'],
    learnFirst: true, rewardCoins: 45
  },
  {
    id: 8, title: '第8关 · 国产小达人 Boss', desc: '限时快答！挑战前面学过的国产车标',
    mode: 'boss', emoji: '👑', color: '#EF476F', isBoss: true,
    brandIds: ['byd', 'wuling', 'xiaomi', 'hongqi', 'nio', 'geely', 'tank', 'changan'],
    learnFirst: false, timeLimit: 45, rewardCoins: 70
  },
  {
    id: 9, title: '第9关 · 星途捷途与上汽', desc: '星途、捷途、荣威、名爵、智己大冒险！',
    mode: 'listen', emoji: '🏙️', color: '#0096C7',
    brandIds: ['exeed', 'jetour', 'roewe', 'mg', 'im'],
    learnFirst: true, rewardCoins: 50
  },
  {
    id: 10, title: '第10关 · 广汽与宝骏拼图', desc: '宝骏、传祺、埃安车标拼图挑战！',
    mode: 'puzzle', emoji: '🧩', color: '#2EC4B6',
    brandIds: ['baojun', 'gac', 'aion'],
    learnFirst: true, rewardCoins: 50
  },
  {
    id: 11, title: '第11关 · 路上常见国际车', desc: '大众、丰田、本田、日产、现代、马自达',
    mode: 'car2logo', emoji: '🌍', color: '#2A9D8F',
    brandIds: ['vw', 'toyota', 'honda', 'nissan', 'hyundai', 'mazda'],
    learnFirst: true, rewardCoins: 55
  },
  {
    id: 12, title: '第12关 · 豪车翻牌派对', desc: '奔驰、宝马、奥迪、雷克萨斯、沃尔沃、凯迪拉克',
    mode: 'memory', emoji: '✨', color: '#6D597A',
    brandIds: ['mercedes', 'bmw', 'audi', 'lexus', 'volvo', 'cadillac'],
    learnFirst: true, rewardCoins: 55
  },
  {
    id: 13, title: '第13关 · 国际颜色与超跑', desc: '保时捷、法拉利、特斯拉、福特、别克、路虎',
    mode: 'listen', emoji: '🏎️', color: '#D90429',
    brandIds: ['porsche', 'ferrari', 'tesla', 'ford', 'buick', 'landrover'],
    learnFirst: true, rewardCoins: 60
  },
  {
    id: 14, title: '第14关 · 终极车标大师 Boss', desc: '50个车标终极限时大挑战，赢取金色奖杯！',
    mode: 'boss', emoji: '🏆', color: '#FF5733', isBoss: true,
    brandIds: ['byd', 'hongqi', 'xiaomi', 'nio', 'vw', 'bmw', 'mercedes', 'audi', 'tesla', 'ferrari', 'porsche', 'ford'],
    learnFirst: false, timeLimit: 55, rewardCoins: 100
  }
];
