// 关卡系统：12 个趣味大关，覆盖全部 50 个车标（先易后难、国产优先），融合 6 种互动玩法
// 玩法类型：
// - listen: 听名字选车标（带先学后考）
// - car2logo: 看真车照片/实车造型选车标，或看车标找真车
// - color: 找出正确颜色的车标（呼应颜色变化与新旧标）
// - memory: 车标翻牌配对
// - puzzle: 车标四宫格拼图
// - boss: Boss 关限时快答

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
    id: 4, title: '第4关 · 比亚迪战队', desc: '颜色侦探：仰望、腾势、方程豹、比亚迪',
    mode: 'color', emoji: '🎨', color: '#FF9F1C',
    brandIds: ['yangwang', 'denza', 'fangchengbao', 'byd'],
    learnFirst: true, rewardCoins: 40
  },
  {
    id: 5, title: '第5关 · 越野小勇士', desc: '长城、哈弗、坦克、魏牌、欧拉拼图！',
    mode: 'puzzle', emoji: '🏔️', color: '#E85D04',
    brandIds: ['gwm', 'haval', 'tank', 'wey', 'ora'],
    learnFirst: true, rewardCoins: 45
  },
  {
    id: 6, title: '第6关 · 国产小达人 Boss', desc: '限时快答！挑战前面学过的国产车标',
    mode: 'boss', emoji: '👑', color: '#EF476F', isBoss: true,
    brandIds: ['byd', 'wuling', 'xiaomi', 'hongqi', 'nio', 'geely', 'tank', 'haval'],
    learnFirst: false, timeLimit: 45, rewardCoins: 70
  },
  {
    id: 7, title: '第7关 · 长安与奇瑞', desc: '长安、深蓝、阿维塔、奇瑞、星途、捷途',
    mode: 'listen', emoji: '🚀', color: '#3A86FF',
    brandIds: ['changan', 'deepal', 'avatr', 'chery', 'exeed', 'jetour'],
    learnFirst: true, rewardCoins: 45
  },
  {
    id: 8, title: '第8关 · 上汽与广汽', desc: '真车大挑战：荣威、名爵、智己、宝骏、传祺、埃安',
    mode: 'car2logo', emoji: '🏙️', color: '#0096C7',
    brandIds: ['roewe', 'mg', 'im', 'baojun', 'gac', 'aion'],
    learnFirst: true, rewardCoins: 50
  },
  {
    id: 9, title: '第9关 · 路上常见国际车', desc: '大众、丰田、本田、日产、现代、马自达',
    mode: 'listen', emoji: '🌍', color: '#2A9D8F',
    brandIds: ['vw', 'toyota', 'honda', 'nissan', 'hyundai', 'mazda'],
    learnFirst: true, rewardCoins: 50
  },
  {
    id: 10, title: '第10关 · 豪车翻牌派对', desc: '奔驰、宝马、奥迪、雷克萨斯、沃尔沃、凯迪拉克',
    mode: 'memory', emoji: '✨', color: '#6D597A',
    brandIds: ['mercedes', 'bmw', 'audi', 'lexus', 'volvo', 'cadillac'],
    learnFirst: true, rewardCoins: 55
  },
  {
    id: 11, title: '第11关 · 超跑与色彩侦探', desc: '保时捷、法拉利、特斯拉、福特、别克、路虎',
    mode: 'color', emoji: '🏎️', color: '#D90429',
    brandIds: ['porsche', 'ferrari', 'tesla', 'ford', 'buick', 'landrover'],
    learnFirst: true, rewardCoins: 60
  },
  {
    id: 12, title: '第12关 · 终极车标大师 Boss', desc: '50个车标终极限时大挑战，赢取金色奖杯！',
    mode: 'boss', emoji: '🏆', color: '#FF5733', isBoss: true,
    brandIds: ['byd', 'hongqi', 'xiaomi', 'nio', 'vw', 'bmw', 'mercedes', 'audi', 'tesla', 'ferrari', 'porsche', 'toyota'],
    learnFirst: false, timeLimit: 50, rewardCoins: 100
  }
];
