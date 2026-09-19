// ============================================================
// 商品数据（唯一维护入口）
// 改价格、改名字、加商品、换照片，都在这里改。
//
// 字段说明：
//   id       唯一标识（不要重复）
//   name     商品名
//   price    单价（元）
//   unit     数量单位
//   category 分类（泡面 / 加料 / 槟榔）
//   image    照片路径，相对 public/ 目录，例如 'images/huotuichang.png'
//            留空 '' 时用 emoji 占位图
//   emoji    占位图图标（image 为空时用到）
//   desc     一句话描述
//   tag      照片下方要额外加的字（槟榔档位用）
// ============================================================

const PRODUCTS = [
  // —— 泡面（每份 3.99 元）——
  { id: 'n1', name: '麻酱火鸡面',   price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '香浓麻酱' },
  { id: 'n2', name: '奶油火鸡面',   price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '奶香浓郁' },
  { id: 'n3', name: '咸蛋黄火鸡面', price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '咸蛋黄风味' },
  { id: 'n4', name: '蟹黄拌面',     price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '蟹黄酱香' },
  { id: 'n5', name: '炸酱面',       price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '老北京风味' },
  { id: 'n6', name: '经典火鸡面',   price: 3.99, unit: '份', category: '泡面', image: '', emoji: '🍜', desc: '经典辣味' },

  // —— 加料 ——
  // TODO: 火腿肠 / 玉米肠价格你还没给，临时按 2.00 元
  { id: 's1', name: '普通火腿肠', price: 2.00, unit: '根', category: '加料', image: 'images/huotuichang.png', emoji: '🌭', desc: '经典火腿肠' },
  { id: 's2', name: '玉米肠',     price: 2.00, unit: '根', category: '加料', image: 'images/yumichang.png',   emoji: '🌭', desc: '玉米口味' },
  { id: 'e1', name: '卤蛋',       price: 2.00, unit: '个', category: '加料', image: '', emoji: '🥚', desc: '入味卤蛋' },

  // —— 槟榔（三档）——
  { id: 'b1', name: '槟榔·小包', price: 3.00,  unit: '包', category: '槟榔', image: '', emoji: '🌰', desc: '一包两个', tag: '这个是三块包' },
  { id: 'b2', name: '槟榔·中包', price: 34.00, unit: '包', category: '槟榔', image: '', emoji: '🌰', desc: '',          tag: '这个是34元一包' },
  { id: 'b3', name: '槟榔·大包', price: 65.00, unit: '包', category: '槟榔', image: '', emoji: '🌰', desc: '',          tag: '这个是65一包' }
];
