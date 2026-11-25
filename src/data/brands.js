// 第一期 50 个汽车品牌（国产 32 个 + 进口 18 个）
// 包含：标准色、颜色变体、新旧车标版本、代表车型与车身视觉配置、儿童语音小知识
// 图片版权说明：内置矢量图形为教学用途原创几何绘制，同时支持通过 scripts/fetch_wikimedia_assets.py 补充 Wikimedia Commons 公开授权真车图。

export const BRANDS = [
  // ==================== 国产品牌 (32) ====================
  {
    id: 'byd', name: '比亚迪', en: 'BYD', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'new', label: '新款金属标', color: '#2B2D42', style: 'new' },
      { id: 'classic', label: '经典红椭圆标', color: '#D62828', style: 'classic' },
      { id: 'blue', label: '新能源蓝标', color: '#0077B6', style: 'new' }
    ],
    carModel: '比亚迪 汉 EV', bodyType: 'sedan', carColor: '#C1121F',
    fact: '比亚迪是中国超厉害的新能源汽车品牌，字母 B Y D 排成一排！'
  },
  {
    id: 'yangwang', name: '仰望', en: 'YANGWANG', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#B08968', bgColor: '#FDF8F3',
    variants: [
      { id: 'gold', label: '流金标准标', color: '#C59B5F', style: 'new' },
      { id: 'silver', label: '亮银标', color: '#6C757D', style: 'new' }
    ],
    carModel: '仰望 U8', bodyType: 'boxy-suv', carColor: '#2D6A4F',
    fact: '仰望的车标像甲骨文里的“电”字，它的车子还会原地掉头呢！'
  },
  {
    id: 'denza', name: '腾势', en: 'DENZA', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#0077B6', bgColor: '#F0F9FF',
    variants: [
      { id: 'blue', label: '经典蓝银标', color: '#0077B6', style: 'new' },
      { id: 'silver', label: '银色标', color: '#495057', style: 'new' }
    ],
    carModel: '腾势 D9', bodyType: 'mpv', carColor: '#1D3557',
    fact: '腾势的车标像两只温柔合拢的手，里面托着一颗蓝色的水滴！'
  },
  {
    id: 'fangchengbao', name: '方程豹', en: 'FANGCHENGBAO', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#E85D04', bgColor: '#FFF4ED',
    variants: [
      { id: 'orange', label: '烈焰橙标', color: '#E85D04', style: 'new' },
      { id: 'black', label: '黑武士标', color: '#212529', style: 'new' }
    ],
    carModel: '方程豹 豹5', bodyType: 'boxy-suv', carColor: '#E85D04',
    fact: '方程豹的车标像一条充满力量的闪电纽带，最喜欢去爬山越野！'
  },
  {
    id: 'geely', name: '吉利', en: 'GEELY', origin: 'cn', group: '吉利集团',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'new', label: '新款银盾标', color: '#495057', style: 'new' },
      { id: 'classic', label: '经典蓝黑六块腹肌标', color: '#1D3557', style: 'classic' },
      { id: 'black', label: '全黑运动标', color: '#111111', style: 'new' }
    ],
    carModel: '吉利 星瑞', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '吉利的车标是一个盾牌，里面整整齐齐排着六个小格子！'
  },
  {
    id: 'lynkco', name: '领克', en: 'LYNK & CO', origin: 'cn', group: '吉利集团',
    primaryColor: '#111111', bgColor: '#F4F4F5',
    variants: [
      { id: 'black', label: '经典黑标', color: '#111111', style: 'new' },
      { id: 'silver', label: '银色标', color: '#6C757D', style: 'new' },
      { id: 'red', label: '赛车红标', color: '#E63946', style: 'new' }
    ],
    carModel: '领克 03', bodyType: 'sport', carColor: '#FFBE0B',
    fact: '领克的车标像两只握在一起的小手，代表把东西方连在一起！'
  },
  {
    id: 'zeekr', name: '极氪', en: 'ZEEKR', origin: 'cn', group: '吉利集团',
    primaryColor: '#2B2D42', bgColor: '#F8F9FA',
    variants: [
      { id: 'silver', label: '曙光银标', color: '#343A40', style: 'new' },
      { id: 'black', label: '暗夜黑标', color: '#111111', style: 'new' },
      { id: 'gold', label: '金色标', color: '#D4A373', style: 'new' }
    ],
    carModel: '极氪 001', bodyType: 'sport', carColor: '#FF6B35',
    fact: '极氪的车标是一个镂空的小方块，里面有一道斜斜的曙光！'
  },
  {
    id: 'gwm', name: '长城', en: 'GWM', origin: 'cn', group: '长城汽车',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'red', label: '红底烽火台标', color: '#C1121F', style: 'new' },
      { id: 'silver', label: '银色标', color: '#495057', style: 'new' }
    ],
    carModel: '长城 炮', bodyType: 'pickup', carColor: '#D62828',
    fact: '长城的车标就像万里长城上的烽火台，笔直冲向天空！'
  },
  {
    id: 'haval', name: '哈弗', en: 'HAVAL', origin: 'cn', group: '长城汽车',
    primaryColor: '#D90429', bgColor: '#FFF0F3',
    variants: [
      { id: 'red', label: '红标哈弗', color: '#D90429', style: 'new' },
      { id: 'black', label: '黑标哈弗', color: '#212529', style: 'new' },
      { id: 'blue', label: '蓝标哈弗', color: '#0077B6', style: 'new' }
    ],
    carModel: '哈弗 大狗', bodyType: 'suv', carColor: '#FB8500',
    fact: '哈弗车标有红标、黑标和蓝标，专门造威武的大越野车！'
  },
  {
    id: 'tank', name: '坦克', en: 'TANK', origin: 'cn', group: '长城汽车',
    primaryColor: '#343A40', bgColor: '#F1F3F5',
    variants: [
      { id: 'silver', label: '机甲银标', color: '#343A40', style: 'new' },
      { id: 'black', label: '黑化标', color: '#111111', style: 'new' }
    ],
    carModel: '坦克 300', bodyType: 'boxy-suv', carColor: '#FF7B00',
    fact: '坦克的车标像一个硬朗的大字母 T，看起来就像变形金刚的盾牌！'
  },
  {
    id: 'wey', name: '魏牌', en: 'WEY', origin: 'cn', group: '长城汽车',
    primaryColor: '#495057', bgColor: '#F8F9FA',
    variants: [
      { id: 'silver', label: '竖旗银标', color: '#495057', style: 'new' },
      { id: 'gold', label: '金色标', color: '#C59B5F', style: 'new' }
    ],
    carModel: '魏牌 蓝山', bodyType: 'suv', carColor: '#457B9D',
    fact: '魏牌的车标像一根高高竖起的旗杆，非常简单又好认！'
  },
  {
    id: 'ora', name: '欧拉', en: 'ORA', origin: 'cn', group: '长城汽车',
    primaryColor: '#FF6B9D', bgColor: '#FFF0F6',
    variants: [
      { id: 'pink', label: '甜心粉标', color: '#FF6B9D', style: 'new' },
      { id: 'silver', label: '经典银标', color: '#495057', style: 'new' }
    ],
    carModel: '欧拉 好猫', bodyType: 'mini', carColor: '#FF8FAB',
    fact: '欧拉的车标是一个圆润的小感叹号，车子圆滚滚的像可爱小猫咪！'
  },
  {
    id: 'changan', name: '长安', en: 'CHANGAN', origin: 'cn', group: '长安汽车',
    primaryColor: '#023E8A', bgColor: '#EDF6FF',
    variants: [
      { id: 'blue', label: '经典蓝V标', color: '#023E8A', style: 'new' },
      { id: 'silver', label: '亮银V标', color: '#495057', style: 'new' }
    ],
    carModel: '长安 UNI-V', bodyType: 'sedan', carColor: '#48CAE4',
    fact: '长安的车标是一个大大的胜利 V 字，像小鸟展开的翅膀！'
  },
  {
    id: 'deepal', name: '深蓝', en: 'DEEPAL', origin: 'cn', group: '长安汽车',
    primaryColor: '#0096C7', bgColor: '#ECFAFF',
    variants: [
      { id: 'blue', label: '星辰蓝标', color: '#0096C7', style: 'new' },
      { id: 'silver', label: '银色标', color: '#495057', style: 'new' }
    ],
    carModel: '深蓝 SL03', bodyType: 'sedan', carColor: '#0096C7',
    fact: '深蓝的车标像三片合在一起的银色花瓣，也像一艘宇宙飞船！'
  },
  {
    id: 'avatr', name: '阿维塔', en: 'AVATR', origin: 'cn', group: '长安汽车',
    primaryColor: '#2B2D42', bgColor: '#F4F5F7',
    variants: [
      { id: 'silver', label: '未来银标', color: '#2B2D42', style: 'new' },
      { id: 'green', label: '荧光绿标', color: '#52B788', style: 'new' }
    ],
    carModel: '阿维塔 11', bodyType: 'suv', carColor: '#52B788',
    fact: '阿维塔的车标由三个小三角组成一个多边形，充满科幻感！'
  },
  {
    id: 'chery', name: '奇瑞', en: 'CHERY', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#2B2D42', bgColor: '#F8F9FA',
    variants: [
      { id: 'silver', label: '经典银标', color: '#495057', style: 'new' },
      { id: 'red', label: '红色标', color: '#D62828', style: 'new' }
    ],
    carModel: '奇瑞 瑞虎8', bodyType: 'suv', carColor: '#2B2D42',
    fact: '奇瑞的车标像两个人手拉手组成一个大写的 A，围在一个椭圆形里！'
  },
  {
    id: 'exeed', name: '星途', en: 'EXEED', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#B5838D', bgColor: '#FDF6F8',
    variants: [
      { id: 'gold', label: '香槟金字标', color: '#B08968', style: 'new' },
      { id: 'black', label: '黑色字标', color: '#212529', style: 'new' }
    ],
    carModel: '星途 瑶光', bodyType: 'suv', carColor: '#6D597A',
    fact: '星途的车标由五个闪亮的英文字母 E X E E D 组成，像夜空的星星！'
  },
  {
    id: 'jetour', name: '捷途', en: 'JETOUR', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#1B4332', bgColor: '#F0FAF4',
    variants: [
      { id: 'green', label: '旅行绿标', color: '#2D6A4F', style: 'new' },
      { id: 'silver', label: '银色字标', color: '#495057', style: 'new' }
    ],
    carModel: '捷途 旅行者', bodyType: 'boxy-suv', carColor: '#40916C',
    fact: '捷途的车标像一个大大的“行”字，最喜欢带小朋友去郊游旅行！'
  },
  {
    id: 'roewe', name: '荣威', en: 'ROEWE', origin: 'cn', group: '上汽集团',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'classic', label: '经典红黑狮标', color: '#C1121F', style: 'classic' },
      { id: 'new', label: '新款银狮标', color: '#495057', style: 'new' }
    ],
    carModel: '荣威 D7', bodyType: 'sedan', carColor: '#1D3557',
    fact: '荣威的盾牌车标里有两只面对面的小狮子，护卫着中间的柱子！'
  },
  {
    id: 'mg', name: '名爵', en: 'MG', origin: 'cn', group: '上汽集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'red', label: '运动红八角标', color: '#D62828', style: 'new' },
      { id: 'silver', label: '银色八角标', color: '#495057', style: 'new' },
      { id: 'black', label: '黑化八角标', color: '#111111', style: 'new' }
    ],
    carModel: '名爵 Cyberster', bodyType: 'sport', carColor: '#E63946',
    fact: '名爵的车标是一个八角形，里面装着大大的字母 M 和 G！'
  },
  {
    id: 'im', name: '智己', en: 'IM', origin: 'cn', group: '上汽集团',
    primaryColor: '#0077B6', bgColor: '#F0F9FF',
    variants: [
      { id: 'blue', label: '极光蓝标', color: '#0077B6', style: 'new' },
      { id: 'black', label: '曜石黑标', color: '#212529', style: 'new' }
    ],
    carModel: '智己 L6', bodyType: 'sedan', carColor: '#9B5DE5',
    fact: '智己的车标像两个圆圆的小圈和两根竖线，像数字 1 和 0！'
  },
  {
    id: 'wuling', name: '五菱', en: 'WULING', origin: 'cn', group: '上汽通用五菱',
    primaryColor: '#E63946', bgColor: '#FFF0F2',
    variants: [
      { id: 'red', label: '经典红标', color: '#E63946', style: 'new' },
      { id: 'silver', label: '全球银标', color: '#6C757D', style: 'new' }
    ],
    carModel: '五菱 宏光 MINI EV', bodyType: 'mini', carColor: '#FFD166',
    fact: '五菱的车标由五个红菱形拼在一起，像一只展翅飞翔的大鹏鸟！'
  },
  {
    id: 'baojun', name: '宝骏', en: 'BAOJUN', origin: 'cn', group: '上汽通用五菱',
    primaryColor: '#3A86FF', bgColor: '#EFF6FF',
    variants: [
      { id: 'new', label: '新款钻石标', color: '#3A86FF', style: 'new' },
      { id: 'classic', label: '经典马头标', color: '#495057', style: 'classic' }
    ],
    carModel: '宝骏 悦也', bodyType: 'mini', carColor: '#4CC9F0',
    fact: '宝骏以前是小马头车标，现在换成了闪亮亮的立体钻石标！'
  },
  {
    id: 'gac', name: '传祺', en: 'GAC', origin: 'cn', group: '广汽集团',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'silver', label: '经典银G标', color: '#495057', style: 'new' },
      { id: 'blue', label: '新能源蓝G标', color: '#0077B6', style: 'new' }
    ],
    carModel: '广汽传祺 M8', bodyType: 'mpv', carColor: '#2B2D42',
    fact: '传祺的车标像一个圆圆的大写字母 G，稳稳地圈在一起！'
  },
  {
    id: 'aion', name: '埃安', en: 'AION', origin: 'cn', group: '广汽集团',
    primaryColor: '#00B4D8', bgColor: '#ECFEFF',
    variants: [
      { id: 'blue', label: '科技蓝G标', color: '#00B4D8', style: 'new' },
      { id: 'silver', label: '银色箭标', color: '#495057', style: 'new' }
    ],
    carModel: '埃安 Y', bodyType: 'suv', carColor: '#00B4D8',
    fact: '埃安的车标带着蓝色的科技光环，路上经常能看到它的电动车！'
  },
  {
    id: 'hongqi', name: '红旗', en: 'HONGQI', origin: 'cn', group: '一汽集团',
    primaryColor: '#D90429', bgColor: '#FFF0F3',
    variants: [
      { id: 'red', label: '经典红酒杯旗标', color: '#D90429', style: 'new' },
      { id: 'gold', label: '金葵花典藏标', color: '#D4A017', style: 'classic' },
      { id: 'silver', label: '银红立标', color: '#6C757D', style: 'new' }
    ],
    carModel: '红旗 H9', bodyType: 'sedan', carColor: '#8D0801',
    fact: '红旗的车标像一面迎风飘扬的红旗，又像一只漂亮的红酒杯！'
  },
  {
    id: 'nio', name: '蔚来', en: 'NIO', origin: 'cn', group: '蔚来汽车',
    primaryColor: '#00A8E8', bgColor: '#F0FAFF',
    variants: [
      { id: 'blue', label: '天空蓝标', color: '#00A8E8', style: 'new' },
      { id: 'silver', label: '金属银标', color: '#495057', style: 'new' }
    ],
    carModel: '蔚来 ES6', bodyType: 'suv', carColor: '#00A8E8',
    fact: '蔚来的车标上面像半个圆圆的天空，下面像通向远方的公路！'
  },
  {
    id: 'xpeng', name: '小鹏', en: 'XPENG', origin: 'cn', group: '小鹏汽车',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'silver', label: '银色X翼标', color: '#343A40', style: 'new' },
      { id: 'black', label: '酷黑标', color: '#111111', style: 'new' }
    ],
    carModel: '小鹏 G6', bodyType: 'suv', carColor: '#FF9F1C',
    fact: '小鹏的车标像一个张开翅膀的大字母 X，随时准备起飞！'
  },
  {
    id: 'lixiang', name: '理想', en: 'LI AUTO', origin: 'cn', group: '理想汽车',
    primaryColor: '#006D77', bgColor: '#EDF8F9',
    variants: [
      { id: 'teal', label: '深绿标准标', color: '#006D77', style: 'new' },
      { id: 'silver', label: '银色标', color: '#495057', style: 'new' }
    ],
    carModel: '理想 L9', bodyType: 'suv', carColor: '#83C5BE',
    fact: '理想的车标像一个圆角方框里藏着汉字“理”的简化线条，车头还有一条长长的星环灯！'
  },
  {
    id: 'aito', name: '问界', en: 'AITO', origin: 'cn', group: '鸿蒙智行',
    primaryColor: '#1D3557', bgColor: '#F2F6FC',
    variants: [
      { id: 'silver', label: '银色环标', color: '#343A40', style: 'new' },
      { id: 'gold', label: '金色标', color: '#C59B5F', style: 'new' }
    ],
    carModel: '问界 M9', bodyType: 'suv', carColor: '#457B9D',
    fact: '问界的车标像一个圆圆的地球仪加上星环，特别聪明会自己停车！'
  },
  {
    id: 'xiaomi', name: '小米', en: 'XIAOMI', origin: 'cn', group: '小米汽车',
    primaryColor: '#FF6900', bgColor: '#FFF4EB',
    variants: [
      { id: 'orange', label: '经典小米橙', color: '#FF6900', style: 'new' },
      { id: 'silver', label: '车头银标', color: '#495057', style: 'new' }
    ],
    carModel: '小米 SU7', bodyType: 'sport', carColor: '#38BDF8',
    fact: '小米的车标是一个圆润的小橙方块，里面写着 M 和 I！'
  },
  {
    id: 'leapmotor', name: '零跑', en: 'LEAPMOTOR', origin: 'cn', group: '零跑汽车',
    primaryColor: '#2A9D8F', bgColor: '#EEFAF8',
    variants: [
      { id: 'teal', label: '青绿标', color: '#2A9D8F', style: 'new' },
      { id: 'silver', label: '银色标', color: '#495057', style: 'new' }
    ],
    carModel: '零跑 C11', bodyType: 'suv', carColor: '#2A9D8F',
    fact: '零跑的车标把字母 L 和 P 巧妙地拼成一个圆圆的跑道！'
  },

  // ==================== 进口 / 国际品牌 (18) ====================
  {
    id: 'vw', name: '大众', en: 'Volkswagen', origin: 'intl', group: '大众集团',
    primaryColor: '#004E98', bgColor: '#EDF4FF',
    variants: [
      { id: 'new', label: '新款扁平蓝标', color: '#004E98', style: 'new' },
      { id: 'classic', label: '经典立体银标', color: '#495057', style: 'classic' },
      { id: 'black', label: '黑化标', color: '#111111', style: 'new' }
    ],
    carModel: '大众 甲壳虫', bodyType: 'mini', carColor: '#FFBE0B',
    fact: '大众的车标是一个圆圈里，上面一个 V，下面一个 W，就像叠罗汉！'
  },
  {
    id: 'toyota', name: '丰田', en: 'TOYOTA', origin: 'intl', group: '丰田集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'silver', label: '经典牛头银标', color: '#495057', style: 'new' },
      { id: 'red', label: '经典红标', color: '#D62828', style: 'new' },
      { id: 'blue', label: '混动蓝晕标', color: '#0077B6', style: 'new' }
    ],
    carModel: '丰田 凯美瑞', bodyType: 'sedan', carColor: '#E63946',
    fact: '丰田的车标由三个椭圆形叠在一起，看起来像一个小牛头，也藏着字母 T！'
  },
  {
    id: 'honda', name: '本田', en: 'HONDA', origin: 'intl', group: '本田汽车',
    primaryColor: '#CC0000', bgColor: '#FFF5F5',
    variants: [
      { id: 'silver', label: '经典银H标', color: '#495057', style: 'new' },
      { id: 'red', label: '赛车红头标', color: '#CC0000', style: 'new' }
    ],
    carModel: '本田 思域', bodyType: 'sedan', carColor: '#EF476F',
    fact: '本田的车标是一个方框里的大写字母 H，就像一扇大大的门！'
  },
  {
    id: 'nissan', name: '日产', en: 'NISSAN', origin: 'intl', group: '日产汽车',
    primaryColor: '#C3002F', bgColor: '#FFF2F5',
    variants: [
      { id: 'new', label: '新款极简标', color: '#212529', style: 'new' },
      { id: 'classic', label: '经典银圈标', color: '#6C757D', style: 'classic' }
    ],
    carModel: '日产 轩逸', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '日产的车标像一轮圆圆的太阳，中间横着写着 NISSAN！'
  },
  {
    id: 'mercedes', name: '奔驰', en: 'Mercedes-Benz', origin: 'intl', group: '梅赛德斯',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'silver', label: '经典三叉星银标', color: '#495057', style: 'new' },
      { id: 'black', label: '黑化三叉星标', color: '#111111', style: 'new' }
    ],
    carModel: '奔驰 大G', bodyType: 'boxy-suv', carColor: '#2B2D42',
    fact: '奔驰的车标是一个圆圈里有三根尖尖的星芒，代表陆地、海洋和天空！'
  },
  {
    id: 'bmw', name: '宝马', en: 'BMW', origin: 'intl', group: '宝马集团',
    primaryColor: '#0066B1', bgColor: '#EDF6FF',
    variants: [
      { id: 'classic', label: '经典黑圈蓝白标', color: '#0066B1', style: 'classic' },
      { id: 'new', label: '新款透明圈标', color: '#0096C7', style: 'new' }
    ],
    carModel: '宝马 3系', bodyType: 'sedan', carColor: '#0066B1',
    fact: '宝马的车标像蓝天白云拼成的小风车，转起来可好看啦！'
  },
  {
    id: 'audi', name: '奥迪', en: 'Audi', origin: 'intl', group: '大众集团',
    primaryColor: '#212529', bgColor: '#F8F9FA',
    variants: [
      { id: 'silver', label: '经典银色四环', color: '#495057', style: 'new' },
      { id: 'black', label: '酷黑四环', color: '#111111', style: 'new' }
    ],
    carModel: '奥迪 A6', bodyType: 'sedan', carColor: '#6C757D',
    fact: '奥迪的车标是四个圆环手拉手排成一排，一二三四数一数！'
  },
  {
    id: 'porsche', name: '保时捷', en: 'PORSCHE', origin: 'intl', group: '大众集团',
    primaryColor: '#D4A017', bgColor: '#FFFBEB',
    variants: [
      { id: 'gold', label: '经典金红盾标', color: '#D4A017', style: 'new' },
      { id: 'silver', label: '黑银纪念标', color: '#343A40', style: 'classic' }
    ],
    carModel: '保时捷 911', bodyType: 'sport', carColor: '#FFB703',
    fact: '保时捷的车标是一个金色的大盾牌，上面有红黑条纹，跑起来像青蛙王子一样快！'
  },
  {
    id: 'tesla', name: '特斯拉', en: 'TESLA', origin: 'intl', group: '特斯拉',
    primaryColor: '#E31937', bgColor: '#FFF0F3',
    variants: [
      { id: 'red', label: '经典红T标', color: '#E31937', style: 'new' },
      { id: 'silver', label: '银色T标', color: '#495057', style: 'new' },
      { id: 'black', label: '黑色T标', color: '#111111', style: 'new' }
    ],
    carModel: '特斯拉 Model 3', bodyType: 'sedan', carColor: '#E31937',
    fact: '特斯拉的车标像一把酷酷的字母 T，还像一只小猫咪的鼻子！'
  },
  {
    id: 'ford', name: '福特', en: 'Ford', origin: 'intl', group: '福特汽车',
    primaryColor: '#003478', bgColor: '#EEF4FF',
    variants: [
      { id: 'blue', label: '经典深蓝椭圆标', color: '#003478', style: 'new' },
      { id: 'black', label: '黑标运动版', color: '#111111', style: 'new' }
    ],
    carModel: '福特 猛禽', bodyType: 'pickup', carColor: '#00509D',
    fact: '福特的车标是一个蓝色的椭圆形，里面用漂亮的花体字写着 Ford！'
  },
  {
    id: 'buick', name: '别克', en: 'BUICK', origin: 'intl', group: '通用汽车',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'new', label: '新款三色平行盾标', color: '#D62828', style: 'new' },
      { id: 'classic', label: '经典圆圈斜三盾', color: '#495057', style: 'classic' }
    ],
    carModel: '别克 GL8', bodyType: 'mpv', carColor: '#457B9D',
    fact: '别克的车标有三颗小盾牌，分别是红色、银色和蓝色，像三个好兄弟！'
  },
  {
    id: 'cadillac', name: '凯迪拉克', en: 'Cadillac', origin: 'intl', group: '通用汽车',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'color', label: '经典彩色盾牌', color: '#C1121F', style: 'new' },
      { id: 'black', label: '黑银极简盾牌', color: '#212529', style: 'classic' }
    ],
    carModel: '凯迪拉克 CT5', bodyType: 'sedan', carColor: '#1D3557',
    fact: '凯迪拉克的盾牌像彩色积木拼起来的，有红、黄、蓝、黑四种颜色！'
  },
  {
    id: 'hyundai', name: '现代', en: 'HYUNDAI', origin: 'intl', group: '现代起亚',
    primaryColor: '#002C5F', bgColor: '#EEF4FF',
    variants: [
      { id: 'blue', label: '经典蓝银斜H标', color: '#002C5F', style: 'new' },
      { id: 'silver', label: '银色斜H标', color: '#495057', style: 'new' }
    ],
    carModel: '现代 伊兰特', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '现代的车标是椭圆形里一个斜斜的 H，就像两个好朋友在握手！'
  },
  {
    id: 'mazda', name: '马自达', en: 'MAZDA', origin: 'intl', group: '马自达',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'silver', label: '海鸥银标', color: '#495057', style: 'new' },
      { id: 'black', label: '黑化海鸥标', color: '#111111', style: 'new' }
    ],
    carModel: '马自达 昂克赛拉', bodyType: 'sedan', carColor: '#B5172D',
    fact: '马自达的车标就像一只海鸥张开翅膀，拼成一个大大的字母 M！'
  },
  {
    id: 'lexus', name: '雷克萨斯', en: 'LEXUS', origin: 'intl', group: '丰田集团',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'silver', label: '经典银L标', color: '#495057', style: 'new' },
      { id: 'blue', label: '混动蓝晕标', color: '#0077B6', style: 'new' }
    ],
    carModel: '雷克萨斯 ES', bodyType: 'sedan', carColor: '#495057',
    fact: '雷克萨斯的车标是椭圆形里一个斜斜的银色大字母 L，特别亮闪闪！'
  },
  {
    id: 'landrover', name: '路虎', en: 'LAND ROVER', origin: 'intl', group: '捷豹路虎',
    primaryColor: '#005A2B', bgColor: '#ECFDF3',
    variants: [
      { id: 'green', label: '经典英国绿椭圆', color: '#005A2B', style: 'new' },
      { id: 'black', label: '黑标版', color: '#111111', style: 'new' }
    ],
    carModel: '路虎 卫士', bodyType: 'boxy-suv', carColor: '#2D6A4F',
    fact: '路虎的车标是一个绿色的椭圆形，越野车高高大大的像森林小老虎！'
  },
  {
    id: 'volvo', name: '沃尔沃', en: 'VOLVO', origin: 'intl', group: '吉利集团',
    primaryColor: '#1B365D', bgColor: '#EFF4FA',
    variants: [
      { id: 'blue', label: '经典蓝带箭头标', color: '#1B365D', style: 'new' },
      { id: 'black', label: '新款极简黑标', color: '#111111', style: 'classic' }
    ],
    carModel: '沃尔沃 XC60', bodyType: 'suv', carColor: '#457B9D',
    fact: '沃尔沃的车标是一个圆圈右上方伸出一个小箭头，它是世界上最注重安全的汽车之一！'
  },
  {
    id: 'ferrari', name: '法拉利', en: 'Ferrari', origin: 'intl', group: '法拉利',
    primaryColor: '#FFD000', bgColor: '#FFFBEB',
    variants: [
      { id: 'yellow', label: '经典跃马黄盾', color: '#FFD000', style: 'new' },
      { id: 'red', label: '法拉利红底版', color: '#D62828', style: 'classic' }
    ],
    carModel: '法拉利 跑车', bodyType: 'sport', carColor: '#D90429',
    fact: '法拉利的车标是黄色的盾牌，上面有一匹黑色的小骏马，跑起来嗖的一下！'
  }
];

export const BRAND_MAP = Object.fromEntries(BRANDS.map((b) => [b.id, b]));
