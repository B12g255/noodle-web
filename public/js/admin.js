// 订单管理页逻辑
const fmt = n => (Math.round(n * 100) / 100).toFixed(2);

async function query() {
  const key = document.getElementById('keyInput').value.trim();
  if (!key) { alert('请输入管理密码'); return; }

  const list = document.getElementById('orderList');
  list.innerHTML = '<div class="empty">查询中...</div>';

  try {
    const res = await fetch('/api/orders?key=' + encodeURIComponent(key));
    const r = await res.json();
    if (r.code !== 0) {
      list.innerHTML = '';
      alert(r.msg || '查询失败');
      return;
    }
    if (!r.orders.length) {
      list.innerHTML = '<div class="empty">暂无订单</div>';
      return;
    }
    list.innerHTML = r.orders.map(o =>
      '<div class="order">' +
        '<div class="order-head"><span class="order-dorm">🏠 ' + o.dorm + '</span><span class="order-time">' + o.timeText + '</span></div>' +
        '<div class="order-items">' +
          o.items.map(it => '<div class="oi"><span>' + it.name + ' ×' + it.qty + '</span><span>¥' + fmt(it.price) + '</span></div>').join('') +
        '</div>' +
        '<div class="order-total">合计 <span>¥' + fmt(o.total) + '</span></div>' +
      '</div>'
    ).join('');
  } catch (e) {
    list.innerHTML = '<div class="empty">网络错误，请重试</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('queryBtn').addEventListener('click', query);
});
