document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

document.getElementById('history-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('h-email').value.trim();
  const phone = document.getElementById('h-phone').value.trim();

  clearErrors();
  let valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('h-email-error', 'Enter a valid email'); valid = false;
  }
  if (!phone) { showError('h-phone-error', 'Phone is required'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('search-btn');
  btn.disabled = true;
  btn.textContent = 'Searching...';

  try {
    const orders = await fetchOrders(email, phone);
    renderOrders(orders);
  } catch {
    alert('Error fetching orders');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Find Orders';
  }
});

function renderOrders(orders) {
  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  if (!orders || orders.length === 0) {
    container.innerHTML = '<p class="no-results">No orders found for this email and phone.</p>';
    return;
  }

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';
    const date = new Date(order.created_at).toLocaleDateString('uk-UA', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const itemsHtml = order.items.map(item => `
      <div class="order-item">
        <span>${item.product_name}</span>
        <span>x${item.quantity}</span>
        <span>₴${item.price}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="order-header">
        <div>
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">${date}</span>
        </div>
        <span class="order-total">Total: ₴${order.total_price}</span>
      </div>
      <div class="order-address">📍 ${order.address}</div>
      <div class="order-items">${itemsHtml}</div>
    `;
    container.appendChild(card);
  });
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.style.display = 'block'; }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}