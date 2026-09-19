// 泡面点餐 网页版后端（Node.js + Express）
// 订单存在 data/orders.json 文件里
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: 改成你自己的管理密码（查订单时用）
const ADMIN_KEY = process.env.ADMIN_KEY || '123456';

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 营业时间判断（与前端 public/js/app.js 的 getBusinessStatus 保持一致）
function isOpen(now) {
  const t = now.getHours() * 60 + now.getMinutes();
  const NOON_OPEN = 12 * 60;
  const NOON_CLOSE = 13 * 60 + 30;
  const NIGHT_OPEN = 21 * 60 + 30;
  const NIGHT_CLOSE = 1 * 60;
  return (
    (t >= NOON_OPEN && t < NOON_CLOSE) ||
    (t >= NIGHT_OPEN) ||
    (t < NIGHT_CLOSE)
  );
}

function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('读取订单失败', e);
    return [];
  }
}

function writeOrders(orders) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return (
    d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
  );
}

// 提交订单
app.post('/api/orders', (req, res) => {
  const { dorm, items } = req.body || {};

  if (!dorm || !String(dorm).trim()) {
    return res.json({ code: 400, msg: '请填写寝室号' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.json({ code: 400, msg: '购物车为空' });
  }
  if (!isOpen(new Date())) {
    return res.json({ code: 403, msg: '当前不在营业时间，无法下单' });
  }

  let total = 0;
  const cleanItems = [];
  for (const it of items) {
    const p = Number(it.price);
    const q = Number(it.qty);
    if (isNaN(p) || isNaN(q) || q <= 0) {
      return res.json({ code: 400, msg: '商品数据异常' });
    }
    total += p * q;
    cleanItems.push({ name: it.name, price: p, qty: q, unit: it.unit || '' });
  }
  total = Math.round(total * 100) / 100;

  const order = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    dorm: String(dorm).trim(),
    items: cleanItems,
    total,
    status: 'pending',
    createTime: new Date().toISOString()
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);

  res.json({ code: 0, msg: '下单成功', orderId: order.id, total });
});

// 查询订单（管理员）
app.get('/api/orders', (req, res) => {
  const key = req.query.key || '';
  if (key !== ADMIN_KEY) {
    return res.json({ code: 401, msg: '管理密码错误' });
  }
  const orders = readOrders().map(o => ({
    id: o.id,
    dorm: o.dorm,
    items: o.items,
    total: o.total,
    status: o.status,
    timeText: formatTime(o.createTime)
  }));
  res.json({ code: 0, orders });
});

app.listen(PORT, () => {
  console.log('泡面点餐已启动：http://localhost:' + PORT);
  console.log('管理页：http://localhost:' + PORT + '/admin.html');
});
