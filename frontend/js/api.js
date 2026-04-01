const API_URL = 'https://affectionate-exploration-production.up.railway.app/api';
// When deployed, change to: const API_URL = 'https://your-backend.railway.app/api';

async function fetchShops(minRating, maxRating) {
  let url = `${API_URL}/shops`;
  if (minRating !== undefined) url += `?minRating=${minRating}&maxRating=${maxRating}`;
  const res = await fetch(url);
  return res.json();
}

async function fetchProducts(shopId, category, sort) {
  let url = `${API_URL}/products?shopId=${shopId}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (sort) url += `&sort=${sort}`;
  const res = await fetch(url);
  return res.json();
}

async function fetchCategories(shopId) {
  const res = await fetch(`${API_URL}/products/categories?shopId=${shopId}`);
  return res.json();
}

async function submitOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

async function fetchOrders(email, phone) {
  const res = await fetch(`${API_URL}/orders?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
  return res.json();
}