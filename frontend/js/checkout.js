document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartPage();
});

function renderCartPage() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('total-price');
  const emptyMsg = document.getElementById('empty-cart-msg');
  const checkoutForm = document.getElementById('checkout-section');

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyMsg.style.display = 'block';
    checkoutForm.style.display = 'none';
    totalEl.textContent = '0';
    return;
  }

  emptyMsg.style.display = 'none';
  checkoutForm.style.display = 'block';
  container.innerHTML = '';

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.productName}</span>
        <span class="cart-item-price">₴${item.price} each</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.productId}, ${item.quantity - 1})">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${item.productId}, ${item.quantity + 1})">+</button>
        <span class="cart-item-subtotal">₴${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-btn" onclick="handleRemove(${item.productId})">🗑</button>
      </div>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = getCartTotal().toFixed(2);
}

function changeQty(productId, newQty) {
  if (newQty <= 0) {
    handleRemove(productId);
    return;
  }
  updateQuantity(productId, newQty);
  renderCartPage();
}

function handleRemove(productId) {
  removeFromCart(productId);
  renderCartPage();
}

// Form validation
document.getElementById('order-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  let valid = true;

  if (!name) { showError('name-error', 'Name is required'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email-error', 'Enter a valid email'); valid = false;
  }
  if (!phone || !/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
    showError('phone-error', 'Enter a valid phone number'); valid = false;
  }
  if (!address) { showError('address-error', 'Address is required'); valid = false; }
  if (getCart().length === 0) { alert('Your cart is empty!'); valid = false; }

  if (!valid) return;

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    const result = await submitOrder({ name, email, phone, address, items: getCart() });
    if (result.success) {
      clearCart();
      document.getElementById('success-message').style.display = 'block';
      document.getElementById('order-form').style.display = 'none';
      document.getElementById('cart-items').innerHTML = '';
      document.getElementById('checkout-section').style.display = 'none';
      document.getElementById('empty-cart-msg').style.display = 'none';
      document.getElementById('success-order-id').textContent = result.orderId;
    } else {
      alert('Error submitting order: ' + (result.error || 'Unknown error'));
      btn.disabled = false;
      btn.textContent = 'Submit Order';
    }
  } catch (err) {
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Order';
  }
});

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