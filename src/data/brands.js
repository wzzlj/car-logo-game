// 第一期 50 个汽车品牌（国产 32 个 + 进口 18 个）
// 包含：标准色、颜色变体、新旧车标版本、代表车型与车身视觉配置、儿童语音小知识
// 图片版权说明：内置矢量图形为教学用途原创几何绘制，同时支持通过 scripts/fetch_wikimedia_assets.py 补充 Wikimedia Commons 公开授权真车图。

export const BRANDS = [
  // ==================== 国产品牌 (32) ====================
  {
    id: 'byd', name: '比亚迪', en: 'BYD', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '比亚迪 汉 EV', bodyType: 'sedan', carColor: '#C1121F',
    fact: '比亚迪是中国超厉害的新能源汽车品牌，字母 B Y D 排成一排！'
  },
  {
    id: 'yangwang', name: '仰望', en: 'YANGWANG', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#B08968', bgColor: '#FDF8F3',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '仰望 U8', bodyType: 'boxy-suv', carColor: '#2D6A4F',
    fact: '仰望的车标像甲骨文里的“电”字，它的车子还会原地掉头呢！'
  },
  {
    id: 'denza', name: '腾势', en: 'DENZA', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#0077B6', bgColor: '#F0F9FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '腾势 D9', bodyType: 'mpv', carColor: '#1D3557',
    fact: '腾势的车标像两只温柔合拢的手，里面托着一颗蓝色的水滴！'
  },
  {
    id: 'fangchengbao', name: '方程豹', en: 'FANGCHENGBAO', origin: 'cn', group: '比亚迪集团',
    primaryColor: '#E85D04', bgColor: '#FFF4ED',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '方程豹 豹5', bodyType: 'boxy-suv', carColor: '#E85D04',
    fact: '方程豹的车标像一条充满力量的闪电纽带，最喜欢去爬山越野！'
  },
  {
    id: 'geely', name: '吉利', en: 'GEELY', origin: 'cn', group: '吉利集团',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'default', label: '新款标准标' },
      { id: 'classic', label: '经典旧标' }
    ],
    carModel: '吉利 星瑞', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '吉利的车标是一个盾牌，里面整整齐齐排着六个小格子！'
  },
  {
    id: 'lynkco', name: '领克', en: 'LYNK & CO', origin: 'cn', group: '吉利集团',
    primaryColor: '#111111', bgColor: '#F4F4F5',
    variants: [
      { id: 'default', label: '经典黑标' },
      { id: 'silver', label: '金属银标' }
    ],
    carModel: '领克 03', bodyType: 'sport', carColor: '#FFBE0B',
    fact: '领克的车标像两只握在一起的小手，代表把东西方连在一起！'
  },
  {
    id: 'zeekr', name: '极氪', en: 'ZEEKR', origin: 'cn', group: '吉利集团',
    primaryColor: '#2B2D42', bgColor: '#F8F9FA',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '极氪 001', bodyType: 'sport', carColor: '#FF6B35',
    fact: '极氪的车标是一个镂空的小方块，里面有一道斜斜的曙光！'
  },
  {
    id: 'gwm', name: '长城', en: 'GWM', origin: 'cn', group: '长城汽车',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '长城 炮', bodyType: 'pickup', carColor: '#D62828',
    fact: '长城的车标就像万里长城上的烽火台，笔直冲向天空！'
  },
  {
    id: 'haval', name: '哈弗', en: 'HAVAL', origin: 'cn', group: '长城汽车',
    primaryColor: '#D90429', bgColor: '#FFF0F3',
    variants: [
      { id: 'default', label: '原色标' },
      { id: 'red', label: '红标哈弗' },
      { id: 'black', label: '黑标哈弗' }
    ],
    carModel: '哈弗 大狗', bodyType: 'suv', carColor: '#FB8500',
    fact: '哈弗车标有红标、黑标和蓝标，专门造威武的大越野车！'
  },
  {
    id: 'tank', name: '坦克', en: 'TANK', origin: 'cn', group: '长城汽车',
    primaryColor: '#343A40', bgColor: '#F1F3F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '坦克 300', bodyType: 'boxy-suv', carColor: '#FF7B00',
    fact: '坦克的车标像一个硬朗的大字母 T，看起来就像变形金刚的盾牌！'
  },
  {
    id: 'wey', name: '魏牌', en: 'WEY', origin: 'cn', group: '长城汽车',
    primaryColor: '#495057', bgColor: '#F8F9FA',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '魏牌 蓝山', bodyType: 'suv', carColor: '#457B9D',
    fact: '魏牌的车标像一根高高竖起的旗杆，非常简单又好认！'
  },
  {
    id: 'ora', name: '欧拉', en: 'ORA', origin: 'cn', group: '长城汽车',
    primaryColor: '#FF6B9D', bgColor: '#FFF0F6',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '欧拉 好猫', bodyType: 'mini', carColor: '#FF8FAB',
    fact: '欧拉的车标是一个圆润的小感叹号，车子圆滚滚的像可爱小猫咪！'
  },
  {
    id: 'changan', name: '长安', en: 'CHANGAN', origin: 'cn', group: '长安汽车',
    primaryColor: '#023E8A', bgColor: '#EDF6FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '长安 UNI-V', bodyType: 'sedan', carColor: '#48CAE4',
    fact: '长安的车标是一个大大的胜利 V 字，像小鸟展开的翅膀！'
  },
  {
    id: 'deepal', name: '深蓝', en: 'DEEPAL', origin: 'cn', group: '长安汽车',
    primaryColor: '#0096C7', bgColor: '#ECFAFF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '深蓝 SL03', bodyType: 'sedan', carColor: '#0096C7',
    fact: '深蓝的车标像三片合在一起的银色花瓣，也像一艘宇宙飞船！'
  },
  {
    id: 'avatr', name: '阿维塔', en: 'AVATR', origin: 'cn', group: '长安汽车',
    primaryColor: '#2B2D42', bgColor: '#F4F5F7',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '阿维塔 11', bodyType: 'suv', carColor: '#52B788',
    fact: '阿维塔的车标由三个小三角组成一个多边形，充满科幻感！'
  },
  {
    id: 'chery', name: '奇瑞', en: 'CHERY', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#2B2D42', bgColor: '#F8F9FA',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '奇瑞 瑞虎8', bodyType: 'suv', carColor: '#2B2D42',
    fact: '奇瑞的车标像两个人手拉手组成一个大写的 A，围在一个椭圆形里！'
  },
  {
    id: 'exeed', name: '星途', en: 'EXEED', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#B5838D', bgColor: '#FDF6F8',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '星途 瑶光', bodyType: 'suv', carColor: '#6D597A',
    fact: '星途的车标由五个闪亮的英文字母 E X E E D 组成，像夜空的星星！'
  },
  {
    id: 'jetour', name: '捷途', en: 'JETOUR', origin: 'cn', group: '奇瑞集团',
    primaryColor: '#1B4332', bgColor: '#F0FAF4',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '捷途 旅行者', bodyType: 'boxy-suv', carColor: '#40916C',
    fact: '捷途的车标像一个大大的“行”字，最喜欢带小朋友去郊游旅行！'
  },
  {
    id: 'roewe', name: '荣威', en: 'ROEWE', origin: 'cn', group: '上汽集团',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '荣威 D7', bodyType: 'sedan', carColor: '#1D3557',
    fact: '荣威的盾牌车标里有两只面对面的小狮子，护卫着中间的柱子！'
  },
  {
    id: 'mg', name: '名爵', en: 'MG', origin: 'cn', group: '上汽集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '原色标' },
      { id: 'black', label: '黑化运动标' }
    ],
    carModel: '名爵 Cyberster', bodyType: 'sport', carColor: '#E63946',
    fact: '名爵的车标是一个八角形，里面装着大大的字母 M 和 G！'
  },
  {
    id: 'im', name: '智己', en: 'IM', origin: 'cn', group: '上汽集团',
    primaryColor: '#0077B6', bgColor: '#F0F9FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '智己 L6', bodyType: 'sedan', carColor: '#9B5DE5',
    fact: '智己的车标像两个圆圆的小圈和两根竖线，像数字 1 和 0！'
  },
  {
    id: 'wuling', name: '五菱', en: 'WULING', origin: 'cn', group: '上汽通用五菱',
    primaryColor: '#E63946', bgColor: '#FFF0F2',
    variants: [
      { id: 'default', label: '经典红标' },
      { id: 'silver', label: '全球银标' }
    ],
    carModel: '五菱 宏光 MINI EV', bodyType: 'mini', carColor: '#FFD166',
    fact: '五菱的车标由五个红菱形拼在一起，像一只展翅飞翔的大鹏鸟！'
  },
  {
    id: 'baojun', name: '宝骏', en: 'BAOJUN', origin: 'cn', group: '上汽通用五菱',
    primaryColor: '#3A86FF', bgColor: '#EFF6FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '宝骏 悦也', bodyType: 'mini', carColor: '#4CC9F0',
    fact: '宝骏以前是小马头车标，现在换成了闪亮亮的立体钻石标！'
  },
  {
    id: 'gac', name: '传祺', en: 'GAC', origin: 'cn', group: '广汽集团',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '广汽传祺 M8', bodyType: 'mpv', carColor: '#2B2D42',
    fact: '传祺的车标像一个圆圆的大写字母 G，稳稳地圈在一起！'
  },
  {
    id: 'aion', name: '埃安', en: 'AION', origin: 'cn', group: '广汽集团',
    primaryColor: '#00B4D8', bgColor: '#ECFEFF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '埃安 Y', bodyType: 'suv', carColor: '#00B4D8',
    fact: '埃安的车标带着蓝色的科技光环，路上经常能看到它的电动车！'
  },
  {
    id: 'hongqi', name: '红旗', en: 'HONGQI', origin: 'cn', group: '一汽集团',
    primaryColor: '#D90429', bgColor: '#FFF0F3',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '红旗 H9', bodyType: 'sedan', carColor: '#8D0801',
    fact: '红旗的车标像一面迎风飘扬的红旗，又像一只漂亮的红酒杯！'
  },
  {
    id: 'nio', name: '蔚来', en: 'NIO', origin: 'cn', group: '蔚来汽车',
    primaryColor: '#00A8E8', bgColor: '#F0FAFF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '蔚来 ES6', bodyType: 'suv', carColor: '#00A8E8',
    fact: '蔚来的车标上面像半个圆圆的天空，下面像通向远方的公路！'
  },
  {
    id: 'xpeng', name: '小鹏', en: 'XPENG', origin: 'cn', group: '小鹏汽车',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '小鹏 G6', bodyType: 'suv', carColor: '#FF9F1C',
    fact: '小鹏的车标像一个张开翅膀的大字母 X，随时准备起飞！'
  },
  {
    id: 'lixiang', name: '理想', en: 'LI AUTO', origin: 'cn', group: '理想汽车',
    primaryColor: '#006D77', bgColor: '#EDF8F9',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '理想 L9', bodyType: 'suv', carColor: '#83C5BE',
    fact: '理想的车标像一个圆角方框里藏着汉字“理”的简化线条，车头还有一条长长的星环灯！'
  },
  {
    id: 'aito', name: '问界', en: 'AITO', origin: 'cn', group: '鸿蒙智行',
    primaryColor: '#1D3557', bgColor: '#F2F6FC',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '问界 M9', bodyType: 'suv', carColor: '#457B9D',
    fact: '问界的车标像一个圆圆的地球仪加上星环，特别聪明会自己停车！'
  },
  {
    id: 'xiaomi', name: '小米', en: 'XIAOMI', origin: 'cn', group: '小米汽车',
    primaryColor: '#FF6900', bgColor: '#FFF4EB',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '小米 SU7', bodyType: 'sport', carColor: '#38BDF8',
    fact: '小米的车标是一个圆润的小橙方块，里面写着 M 和 I！'
  },
  {
    id: 'leapmotor', name: '零跑', en: 'LEAPMOTOR', origin: 'cn', group: '零跑汽车',
    primaryColor: '#2A9D8F', bgColor: '#EEFAF8',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '零跑 C11', bodyType: 'suv', carColor: '#2A9D8F',
    fact: '零跑的车标把字母 L 和 P 巧妙地拼成一个圆圆的跑道！'
  },

  // ==================== 进口 / 国际品牌 (18) ====================
  {
    id: 'vw', name: '大众', en: 'Volkswagen', origin: 'intl', group: '大众集团',
    primaryColor: '#004E98', bgColor: '#EDF4FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '大众 甲壳虫', bodyType: 'mini', carColor: '#FFBE0B',
    fact: '大众的车标是一个圆圈里，上面一个 V，下面一个 W，就像叠罗汉！'
  },
  {
    id: 'toyota', name: '丰田', en: 'TOYOTA', origin: 'intl', group: '丰田集团',
    primaryColor: '#D62828', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '丰田 凯美瑞', bodyType: 'sedan', carColor: '#E63946',
    fact: '丰田的车标由三个椭圆形叠在一起，看起来像一个小牛头，也藏着字母 T！'
  },
  {
    id: 'honda', name: '本田', en: 'HONDA', origin: 'intl', group: '本田汽车',
    primaryColor: '#CC0000', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '本田 思域', bodyType: 'sedan', carColor: '#EF476F',
    fact: '本田的车标是一个方框里的大写字母 H，就像一扇大大的门！'
  },
  {
    id: 'nissan', name: '日产', en: 'NISSAN', origin: 'intl', group: '日产汽车',
    primaryColor: '#C3002F', bgColor: '#FFF2F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '日产 轩逸', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '日产的车标像一轮圆圆的太阳，中间横着写着 NISSAN！'
  },
  {
    id: 'mercedes', name: '奔驰', en: 'Mercedes-Benz', origin: 'intl', group: '梅赛德斯',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '奔驰 大G', bodyType: 'boxy-suv', carColor: '#2B2D42',
    fact: '奔驰的车标是一个圆圈里有三根尖尖的星芒，代表陆地、海洋和天空！'
  },
  {
    id: 'bmw', name: '宝马', en: 'BMW', origin: 'intl', group: '宝马集团',
    primaryColor: '#0066B1', bgColor: '#EDF6FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '宝马 3系', bodyType: 'sedan', carColor: '#0066B1',
    fact: '宝马的车标像蓝天白云拼成的小风车，转起来可好看啦！'
  },
  {
    id: 'audi', name: '奥迪', en: 'Audi', origin: 'intl', group: '大众集团',
    primaryColor: '#212529', bgColor: '#F8F9FA',
    variants: [
      { id: 'default', label: '经典银环' },
      { id: 'black', label: '黑化四环' }
    ],
    carModel: '奥迪 A6', bodyType: 'sedan', carColor: '#6C757D',
    fact: '奥迪的车标是四个圆环手拉手排成一排，一二三四数一数！'
  },
  {
    id: 'porsche', name: '保时捷', en: 'PORSCHE', origin: 'intl', group: '大众集团',
    primaryColor: '#D4A017', bgColor: '#FFFBEB',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '保时捷 911', bodyType: 'sport', carColor: '#FFB703',
    fact: '保时捷的车标是一个金色的大盾牌，上面有红黑条纹，跑起来像青蛙王子一样快！'
  },
  {
    id: 'tesla', name: '特斯拉', en: 'TESLA', origin: 'intl', group: '特斯拉',
    primaryColor: '#E31937', bgColor: '#FFF0F3',
    variants: [
      { id: 'default', label: '经典红标' },
      { id: 'silver', label: '金属银标' }
    ],
    carModel: '特斯拉 Model 3', bodyType: 'sedan', carColor: '#E31937',
    fact: '特斯拉的车标像一把酷酷的字母 T，还像一只小猫咪的鼻子！'
  },
  {
    id: 'ford', name: '福特', en: 'Ford', origin: 'intl', group: '福特汽车',
    primaryColor: '#003478', bgColor: '#EEF4FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '福特 猛禽', bodyType: 'pickup', carColor: '#00509D',
    fact: '福特的车标是一个蓝色的椭圆形，里面用漂亮的花体字写着 Ford！'
  },
  {
    id: 'buick', name: '别克', en: 'BUICK', origin: 'intl', group: '通用汽车',
    primaryColor: '#1D3557', bgColor: '#F0F4FA',
    variants: [
      { id: 'default', label: '新款三盾标' },
      { id: 'classic', label: '经典圆圈标' }
    ],
    carModel: '别克 GL8', bodyType: 'mpv', carColor: '#457B9D',
    fact: '别克的车标有三颗小盾牌，分别是红色、银色和蓝色，像三个好兄弟！'
  },
  {
    id: 'cadillac', name: '凯迪拉克', en: 'Cadillac', origin: 'intl', group: '通用汽车',
    primaryColor: '#C1121F', bgColor: '#FFF5F5',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '凯迪拉克 CT5', bodyType: 'sedan', carColor: '#1D3557',
    fact: '凯迪拉克的盾牌像彩色积木拼起来的，有红、黄、蓝、黑四种颜色！'
  },
  {
    id: 'hyundai', name: '现代', en: 'HYUNDAI', origin: 'intl', group: '现代起亚',
    primaryColor: '#002C5F', bgColor: '#EEF4FF',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '现代 伊兰特', bodyType: 'sedan', carColor: '#3A86FF',
    fact: '现代的车标是椭圆形里一个斜斜的 H，就像两个好朋友在握手！'
  },
  {
    id: 'mazda', name: '马自达', en: 'MAZDA', origin: 'intl', group: '马自达',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '马自达 昂克赛拉', bodyType: 'sedan', carColor: '#B5172D',
    fact: '马自达的车标就像一只海鸥张开翅膀，拼成一个大大的字母 M！'
  },
  {
    id: 'lexus', name: '雷克萨斯', en: 'LEXUS', origin: 'intl', group: '丰田集团',
    primaryColor: '#2B2D42', bgColor: '#F4F6F9',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '雷克萨斯 ES', bodyType: 'sedan', carColor: '#495057',
    fact: '雷克萨斯的车标是椭圆形里一个斜斜的银色大字母 L，特别亮闪闪！'
  },
  {
    id: 'landrover', name: '路虎', en: 'LAND ROVER', origin: 'intl', group: '捷豹路虎',
    primaryColor: '#005A2B', bgColor: '#ECFDF3',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '路虎 卫士', bodyType: 'boxy-suv', carColor: '#2D6A4F',
    fact: '路虎的车标是一个绿色的椭圆形，越野车高高大大的像森林小老虎！'
  },
  {
    id: 'volvo', name: '沃尔沃', en: 'VOLVO', origin: 'intl', group: '吉利集团',
    primaryColor: '#1B365D', bgColor: '#EFF4FA',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '沃尔沃 XC60', bodyType: 'suv', carColor: '#457B9D',
    fact: '沃尔沃的车标是一个圆圈右上方伸出一个小箭头，它是世界上最注重安全的汽车之一！'
  },
  {
    id: 'ferrari', name: '法拉利', en: 'Ferrari', origin: 'intl', group: '法拉利',
    primaryColor: '#FFD000', bgColor: '#FFFBEB',
    variants: [
      { id: 'default', label: '标准车标' }
    ],
    carModel: '法拉利 跑车', bodyType: 'sport', carColor: '#D90429',
    fact: '法拉利的车标是黄色的盾牌，上面有一匹黑色的小骏马，跑起来嗖的一下！'
  },
  // ==================== 新增中国品牌 (11) ====================
  {
    id: 'voyah', name: '岚图', en: 'VOYAH', origin: 'cn', group: '东风汽车',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '岚图 FREE', bodyType: 'suv', carColor: '#475569',
    fact: '岚图的车标就像大鹏展开一对优雅的翅膀，准备飞向天空！'
  },
  {
    id: 'dongfeng', name: '东风', en: 'DONGFENG', origin: 'cn', group: '东风汽车',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '东风 风神', bodyType: 'sedan', carColor: '#DC2626',
    fact: '东风的车标是一个圆圈里两只旋转飞翔的小燕子，叫做双飞燕！'
  },
  {
    id: 'faw', name: '中国一汽', en: 'FAW', origin: 'cn', group: '中国一汽',
    primaryColor: '#1D4ED8', bgColor: '#EFF6FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '一汽 奔腾', bodyType: 'sedan', carColor: '#1D4ED8',
    fact: '中国一汽的车标像一只展翅飞翔的大雄鹰，里面藏着数字 1！'
  },
  {
    id: 'baic', name: '北汽', en: 'BAIC', origin: 'cn', group: '北汽集团',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '北京 BJ40', bodyType: 'boxy-suv', carColor: '#EA580C',
    fact: '北汽的车标就像一个圆圆的“北”字，也像可爱的小猪鼻子！'
  },
  {
    id: 'arcfox', name: '极狐', en: 'ARCFOX', origin: 'cn', group: '北汽集团',
    primaryColor: '#0F172A', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '极狐 阿尔法 S', bodyType: 'sedan', carColor: '#38BDF8',
    fact: '极狐的车标就像一只机灵的北极小狐狸的尖尖小脑袋！'
  },
  {
    id: 'jac', name: '江淮', en: 'JAC', origin: 'cn', group: '江淮汽车',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '江淮 瑞风', bodyType: 'suv', carColor: '#2563EB',
    fact: '江淮的车标是盾牌里一颗闪亮的五角星，或者三个字母 J A C！'
  },
  {
    id: 'neta', name: '哪吒', en: 'NETA', origin: 'cn', group: '合众新能源',
    primaryColor: '#0284C7', bgColor: '#F0F9FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '哪吒 S', bodyType: 'sport', carColor: '#0284C7',
    fact: '哪吒汽车的车标像一股向上喷涌的清泉，名字来自踩风火轮的小哪吒！'
  },
  {
    id: 'maxus', name: '上汽大通', en: 'MAXUS', origin: 'cn', group: '上汽集团',
    primaryColor: '#334155', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '上汽大通 G50', bodyType: 'mpv', carColor: '#475569',
    fact: '上汽大通的车标是三个三角形叠在一起，组成一个大大的“众”字！'
  },
  {
    id: 'foton', name: '福田', en: 'FOTON', origin: 'cn', group: '北汽福田',
    primaryColor: '#2563EB', bgColor: '#EFF6FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '福田 火星皮卡', bodyType: 'pickup', carColor: '#1D4ED8',
    fact: '福田的车标是三块三角形拼成的闪亮大钻石，马路上很多大卡车都是它！'
  },
  {
    id: 'yutong', name: '宇通', en: 'YUTONG', origin: 'cn', group: '宇通客车',
    primaryColor: '#1D4ED8', bgColor: '#EFF6FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '宇通 大巴车', bodyType: 'mpv', carColor: '#2563EB',
    fact: '宇通的车标是一个圆圈里大大的字母 Y，大街上好多公交车和校车都是宇通！'
  },
  {
    id: 'kinglong', name: '金龙', en: 'KING LONG', origin: 'cn', group: '金龙客车',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '金龙 大客车', bodyType: 'mpv', carColor: '#DC2626',
    fact: '金龙的车标是一个大大的“人”字形，专门造载着大家去旅游的大巴车！'
  },
  // ==================== 新增国际品牌 (27) ====================
  {
    id: 'lamborghini', name: '兰博基尼', en: 'Lamborghini', origin: 'intl', group: '大众集团',
    primaryColor: '#CA8A04', bgColor: '#FEFCE8',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '兰博基尼 小牛', bodyType: 'sport', carColor: '#EAB308',
    fact: '兰博基尼的车标是黑色盾牌里一头金色大公牛，跑起来像大公牛冲刺一样快！'
  },
  {
    id: 'maserati', name: '玛莎拉蒂', en: 'Maserati', origin: 'intl', group: 'Stellantis',
    primaryColor: '#1E3A8A', bgColor: '#EFF6FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '玛莎拉蒂 吉博力', bodyType: 'sport', carColor: '#1E3A8A',
    fact: '玛莎拉蒂的车标是一把帅气的海神三叉戟，就像海底国王拿的魔法叉！'
  },
  {
    id: 'rollsroyce', name: '劳斯莱斯', en: 'Rolls-Royce', origin: 'intl', group: '宝马集团',
    primaryColor: '#1E1B4B', bgColor: '#F5F3FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '劳斯莱斯 幻影', bodyType: 'sedan', carColor: '#1E1B4B',
    fact: '劳斯莱斯的车标是两个重叠的大字母 R，是全世界最豪华的大轿车之一！'
  },
  {
    id: 'bentley', name: '宾利', en: 'Bentley', origin: 'intl', group: '大众集团',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '宾利 欧陆 GT', bodyType: 'sport', carColor: '#065F46',
    fact: '宾利的车标是一对大翅膀中间夹着一个大字母 B，看起来特别威风！'
  },
  {
    id: 'astonmartin', name: '阿斯顿·马丁', en: 'Aston Martin', origin: 'intl', group: '阿斯顿·马丁',
    primaryColor: '#065F46', bgColor: '#ECFDF5',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '阿斯顿·马丁 DB11', bodyType: 'sport', carColor: '#065F46',
    fact: '阿斯顿·马丁的车标是一对平平展开的大翅膀，是电影里大侦探最爱开的跑车！'
  },
  {
    id: 'mclaren', name: '迈凯伦', en: 'McLaren', origin: 'intl', group: '迈凯伦',
    primaryColor: '#F97316', bgColor: '#FFF7ED',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '迈凯伦 720S', bodyType: 'sport', carColor: '#F97316',
    fact: '迈凯伦的车标像一片飞速划过的橙色弯月，车门还能像蝴蝶翅膀一样向上打开！'
  },
  {
    id: 'bugatti', name: '布加迪', en: 'Bugatti', origin: 'intl', group: '布加迪',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '布加迪 凯龙', bodyType: 'sport', carColor: '#1D4ED8',
    fact: '布加迪的车标是一个红色大椭圆，它是世界上跑得最快的超级跑车之一！'
  },
  {
    id: 'jaguar', name: '捷豹', en: 'Jaguar', origin: 'intl', group: '捷豹路虎',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '捷豹 F-Type', bodyType: 'sport', carColor: '#15803D',
    fact: '捷豹的车标是一只向前飞跃的美洲豹，又敏捷又凶猛！'
  },
  {
    id: 'mini', name: '迷你', en: 'MINI', origin: 'intl', group: '宝马集团',
    primaryColor: '#111827', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: 'MINI Cooper', bodyType: 'mini', carColor: '#DC2626',
    fact: '迷你的车标是一个圆圈两边长出小翅膀，车子圆圆小小，有两只大圆眼睛！'
  },
  {
    id: 'smart', name: '精灵', en: 'smart', origin: 'intl', group: '吉利与奔驰',
    primaryColor: '#F59E0B', bgColor: '#FFFBEB',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: 'smart 精灵小车', bodyType: 'mini', carColor: '#F59E0B',
    fact: '精灵 smart 专门造萌萌的都市小汽车，停车特别方便！'
  },
  {
    id: 'jeep', name: '吉普', en: 'Jeep', origin: 'intl', group: 'Stellantis',
    primaryColor: '#166534', bgColor: '#F0FDF4',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '吉普 牧马人', bodyType: 'boxy-suv', carColor: '#166534',
    fact: '吉普的车标就是四个大字母 J e e p，它是最经典的翻山越岭越野车！'
  },
  {
    id: 'chevrolet', name: '雪佛兰', en: 'Chevrolet', origin: 'intl', group: '通用汽车',
    primaryColor: '#D97706', bgColor: '#FFFBEB',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '雪佛兰 大黄蜂', bodyType: 'sport', carColor: '#EAB308',
    fact: '雪佛兰的车标像一个金色的领结或小十字架，变形金刚大黄蜂就是雪佛兰哦！'
  },
  {
    id: 'lincoln', name: '林肯', en: 'Lincoln', origin: 'intl', group: '福特集团',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '林肯 领航员', bodyType: 'suv', carColor: '#1E293B',
    fact: '林肯的车标是一个细长方框里一颗闪亮的十字星！'
  },
  {
    id: 'kia', name: '起亚', en: 'KIA', origin: 'intl', group: '现代起亚',
    primaryColor: '#111827', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '起亚 EV6', bodyType: 'suv', carColor: '#DC2626',
    fact: '起亚的车标是连在一起的三个帅气字母 K I A，一笔就能写出来！'
  },
  {
    id: 'peugeot', name: '标致', en: 'Peugeot', origin: 'intl', group: 'Stellantis',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '标致 408', bodyType: 'sedan', carColor: '#1D4ED8',
    fact: '标致的车标是盾牌里一只威风凛凛的小狮子头！'
  },
  {
    id: 'citroen', name: '雪铁龙', en: 'Citroën', origin: 'intl', group: 'Stellantis',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '雪铁龙 凡尔赛', bodyType: 'sedan', carColor: '#475569',
    fact: '雪铁龙的车标是两个向上指的人字形小箭头，像小房顶一样！'
  },
  {
    id: 'renault', name: '雷诺', en: 'Renault', origin: 'intl', group: '雷诺集团',
    primaryColor: '#111827', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '雷诺 梅甘娜', bodyType: 'sport', carColor: '#EAB308',
    fact: '雷诺的车标是一个线条交错的钻石菱形，来自浪漫的法国！'
  },
  {
    id: 'skoda', name: '斯柯达', en: 'Škoda', origin: 'intl', group: '大众集团',
    primaryColor: '#15803D', bgColor: '#F0FDF4',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '斯柯达 明锐', bodyType: 'sedan', carColor: '#15803D',
    fact: '斯柯达的车标是绿色的飞箭加上长长的羽毛，代表速度飞快！'
  },
  {
    id: 'subaru', name: '斯巴鲁', en: 'Subaru', origin: 'intl', group: '斯巴鲁',
    primaryColor: '#1D4ED8', bgColor: '#EFF6FF',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '斯巴鲁 森林人', bodyType: 'suv', carColor: '#1D4ED8',
    fact: '斯巴鲁的车标是蓝色椭圆形里六颗闪闪发光的小星星！'
  },
  {
    id: 'mitsubishi', name: '三菱', en: 'Mitsubishi', origin: 'intl', group: '三菱汽车',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '三菱 欧蓝德', bodyType: 'suv', carColor: '#DC2626',
    fact: '三菱的车标是三颗鲜红的菱形大钻石，拼成一朵风车花！'
  },
  {
    id: 'suzuki', name: '铃木', en: 'Suzuki', origin: 'intl', group: '铃木汽车',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '铃木 吉姆尼', bodyType: 'boxy-suv', carColor: '#84CC16',
    fact: '铃木的车标是一个大大的红色字母 S，小越野车吉姆尼超可爱！'
  },
  {
    id: 'infiniti', name: '英菲尼迪', en: 'Infiniti', origin: 'intl', group: '日产集团',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '英菲尼迪 QX60', bodyType: 'suv', carColor: '#475569',
    fact: '英菲尼迪的车标是一个椭圆里面两条线伸向远方，就像一条通往山顶的公路！'
  },
  {
    id: 'acura', name: '讴歌', en: 'Acura', origin: 'intl', group: '本田集团',
    primaryColor: '#1E293B', bgColor: '#F8FAFC',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '讴歌 MDX', bodyType: 'suv', carColor: '#334155',
    fact: '讴歌的车标像一把精准的尖头圆规，也像大字母 A，是本田的高端兄弟！'
  },
  {
    id: 'alfaromeo', name: '阿尔法·罗密欧', en: 'Alfa Romeo', origin: 'intl', group: 'Stellantis',
    primaryColor: '#DC2626', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '阿尔法·罗密欧 Giulia', bodyType: 'sport', carColor: '#DC2626',
    fact: '阿尔法·罗密欧的圆形车标左边是红十字，右边是一条戴皇冠的小青龙！'
  },
  {
    id: 'fiat', name: '菲亚特', en: 'Fiat', origin: 'intl', group: 'Stellantis',
    primaryColor: '#B91C1C', bgColor: '#FEF2F2',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '菲亚特 500', bodyType: 'mini', carColor: '#F8FAFC',
    fact: '菲亚特的车标是红色盾牌里四个字母 F I A T，它造的小汽车圆嘟嘟超萌！'
  },
  {
    id: 'lotus', name: '路特斯', en: 'Lotus', origin: 'intl', group: '吉利集团',
    primaryColor: '#EAB308', bgColor: '#FEFCE8',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '路特斯 Emira', bodyType: 'sport', carColor: '#0284C7',
    fact: '路特斯的车标是一个明亮的黄色大圆徽章，专门造轻巧飞快的赛车和跑车！'
  },
  {
    id: 'polestar', name: '极星', en: 'Polestar', origin: 'intl', group: '吉利与沃尔沃',
    primaryColor: '#18181B', bgColor: '#F4F4F5',
    variants: [{ id: 'default', label: '标准车标' }],
    carModel: '极星 2', bodyType: 'sedan', carColor: '#64748B',
    fact: '极星的车标是两枚尖尖的箭头对在一起，拼成一颗闪耀的北极十字星！'
  }
];

export const BRAND_MAP = Object.fromEntries(BRANDS.map((b) => [b.id, b]));
