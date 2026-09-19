// 泡面点餐 前端逻辑
let cart = {};          // id -> 数量
let productMap = {};    // id -> 商品
let checkoutItems = []; // 待提交的商品
let isOpen = false;

function fmtMoney(n) {
  return (Math.round(n * 100) / 100).toFixed(2);
}

// 营业时间判断（与 server.js 的 isOpen 保持一致）
function getBusinessStatus() {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  const NOON_OPEN = 12 * 60;
  const NOON_CLOSE = 13 * 60 + 30;
  const NIGHT_OPEN = 21 * 60 + 30;
  const NIGHT_CLOSE = 1 * 60;
  const open = (t >= NOON_OPEN && t < NOON_CLOSE) || (t >= NIGHT_OPEN) || (t < NIGHT_CLOSE);
  let nextOpen = '';
  if (!open) nextOpen = (t >= NOON_CLOSE && t < NIGHT_OPEN) ? '今晚 21:30' : '今天中午 12:00';
  return { open, nextOpen };
}

function renderProducts() {
  const container = document.getElementById('productList');
  const order = ['泡面', '加料', '槟榔'];
  container.innerHTML = '';

  order.forEach(cat => {
    const items = PRODUCTS.filter(p => p.category === cat);
    if (!items.length) return;

    const group = document.createElement('div');
    group.className = 'group';
    const title = document.createElement('div');
    title.className = 'group-title';
    title.textContent = cat;
    group.appendChild(title);

    items.forEach(item => {
      productMap[item.id] = item;
      const qty = cart[item.id] || 0;
      const card = document.createElement('div');
      card.className = 'card';

      const imgHtml = item.image
        ? `<img src="${item.image}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : '';
      const placeholderStyle = item.image ? 'style="display:none"' : '';

      card.innerHTML = `
        <div class="card-img">${imgHtml}<div class="img-placeholder" ${placeholderStyle}>${item.emoji}</div></div>
        <div class="card-info">
          <div class="card-name">${item.name}</div>
          ${item.desc ? `<div class="card-desc">${item.desc}</div>` : ''}
          ${item.tag ? `<div class="card-tag">${item.tag}</div>` : ''}
          <div class="card-price"><span class="price-symbol">¥</span><span class="price-num">${fmtMoney(item.price)}</span><span class="price-unit">/${item.unit}</span></div>
        </div>
        <div class="card-stepper">
          <div class="stepper-btn minus" ${qty ? '' : 'style="display:none"'}>−</div>
          <div class="stepper-num" ${qty ? '' : 'style="display:none"'}>${qty}</div>
          <div class="stepper-btn plus">＋</div>
        </div>
      `;

      card.querySelector('.plus').addEventListener('click', () => onPlus(item.id));
      const minus = card.querySelector('.minus');
      if (minus) minus.addEventListener('click', () => onMinus(item.id));
      group.appendChild(card);
    });

    container.appendChild(group);
  });
}

function updateCartBar() {
  let count = 0, price = 0;
  Object.keys(cart).forEach(id => {
    const q = cart[id];
    if (q > 0) { const p = productMap[id]; count += q; price += p.price * q; }
  });
  document.getElementById('cartCount').textContent = '已选 ' + count + ' 件';
  document.getElementById('cartTotal').textContent = '¥' + fmtMoney(price);

  const btn = document.getElementById('cartSubmit');
  if (count === 0) { btn.textContent = '请选择商品'; btn.classList.add('disabled'); }
  else { btn.textContent = '去结算'; btn.classList.remove('disabled'); }
}

function onPlus(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderProducts();
  updateCartBar();
}

function onMinus(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  renderProducts();
  updateCartBar();
}

function updateBanner() {
  const st = getBusinessStatus();
  isOpen = st.open;
  const banner = document.getElementById('banner');
  if (st.open) {
    banner.className = 'banner open';
    banner.innerHTML = '<div class="banner-title">🈺 营业中</div><div class="banner-sub">营业时间：中午 12:00–13:30 / 晚上 21:30–次日 1:00</div>';
  } else {
    banner.className = 'banner closed';
    banner.innerHTML = '<div class="banner-title">😴 当前不营业</div><div class="banner-sub">可先预选商品，营业后再下单（下次营业：' + st.nextOpen + '）</div>';
  }
  updateCartBar();
}

function openCheckout() {
  const items = [];
  Object.keys(cart).forEach(id => {
    const q = cart[id];
    if (q > 0) { const p = productMap[id]; items.push({ name: p.name, price: p.price, qty: q, unit: p.unit }); }
  });
  if (!items.length) return;

  checkoutItems = items;
  document.getElementById('modalItems').innerHTML = items.map(i =>
    '<div class="mi"><span>' + i.name + ' ×' + i.qty + '</span><span>¥' + fmtMoney(i.price) + '</span></div>'
  ).join('');
  document.getElementById('modalTotal').textContent = '¥' + fmtMoney(items.reduce((s, i) => s + i.price * i.qty, 0));
  document.getElementById('dormInput').value = '';

  // 非营业时间：仍可进到填寝室号这步，但提交按钮置灰、提示不营业
  const closedTip = document.getElementById('closedTip');
  const submitBtn = document.getElementById('submitBtn');
  if (isOpen) {
    closedTip.style.display = 'none';
    submitBtn.textContent = '提交订单';
    submitBtn.classList.remove('disabled');
  } else {
    closedTip.style.display = 'block';
    submitBtn.textContent = '不营业，无法下单';
    submitBtn.classList.add('disabled');
  }

  document.getElementById('checkoutModal').classList.add('show');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('show');
}

async function submitOrder() {
  if (!isOpen) { alert('当前不营业，无法下单'); return; }
  const dorm = document.getElementById('dormInput').value.trim();
  if (!dorm) { alert('请填写寝室号'); return; }

  const btn = document.getElementById('submitBtn');
  btn.textContent = '提交中...';
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dorm, items: checkoutItems })
    });
    const r = await res.json();
    if (r.code === 0) {
      document.getElementById('payAmount').textContent = (r.total != null) ? fmtMoney(r.total) : '0.00';
      cart = {};
      checkoutItems = [];
      closeCheckout();
      renderProducts();
      updateCartBar();
      document.getElementById('payModal').classList.add('show');
    } else {
      alert(r.msg || '下单失败');
    }
  } catch (e) {
    alert('网络错误，请重试');
  }
  btn.textContent = '提交订单';
}

function init() {
  updateBanner();
  renderProducts();

  document.getElementById('cartSubmit').addEventListener('click', openCheckout);
  document.getElementById('cancelBtn').addEventListener('click', closeCheckout);
  document.getElementById('submitBtn').addEventListener('click', submitOrder);
  document.getElementById('payOkBtn').addEventListener('click', () => document.getElementById('payModal').classList.remove('show'));
  document.getElementById('checkoutModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeCheckout(); });

  // 每 30 秒刷新一次营业状态，到点自动切换
  setInterval(updateBanner, 30000);
}

document.addEventListener('DOMContentLoaded', init);
