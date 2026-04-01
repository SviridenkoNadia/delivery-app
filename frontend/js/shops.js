let currentShopId = null;

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  loadShops();

  document.getElementById('rating-filter').addEventListener('change', loadShops);
  document.getElementById('sort-select').addEventListener('change', () => {
    if (currentShopId) loadProducts(currentShopId);
  });
});

async function loadShops() {
  const ratingValue = document.getElementById('rating-filter').value;
  let minRating, maxRating;
  if (ratingValue) {
    [minRating, maxRating] = ratingValue.split('-').map(Number);
  }

  const shops = await fetchShops(minRating, maxRating);
  renderShops(shops);
}

function renderShops(shops) {
  if (shops.length === 0) {
    document.getElementById("products-grid").innerHTML = "<p class="no-results">No shops found</p>";
    document.getElementById("products-placeholder").style.display = "none";
    return;
  }
  const list = document.getElementById('shops-list');
  list.innerHTML = '';

  if (shops.length === 0) {
    list.innerHTML = '<p class="no-results">No shops found</p>';
    return;
  }

  shops.forEach(shop => {
    const el = document.createElement('div');
    el.className = 'shop-item';
    if (currentShopId === shop.id) el.classList.add('active');
    el.innerHTML = `
      <span class="shop-name">${shop.name}</span>
      <span class="shop-rating">⭐ ${shop.rating}</span>
    `;
    el.addEventListener('click', () => selectShop(shop.id, el));
    list.appendChild(el);
  });
}

async function selectShop(shopId, el) {
  // Highlight selected
  document.querySelectorAll('.shop-item').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  currentShopId = shopId;

  // Load categories for this shop
  await loadCategories(shopId);
  loadProducts(shopId);
}

async function loadCategories(shopId) {
  const categories = await fetchCategories(shopId);
  const container = document.getElementById('category-filters');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'category-btn active';
  allBtn.textContent = 'All';
  allBtn.dataset.category = '';
  allBtn.addEventListener('click', () => selectCategory('', allBtn));
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.addEventListener('click', () => selectCategory(cat, btn));
    container.appendChild(btn);
  });
}

function selectCategory(category, btn) {
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadProducts(currentShopId, category);
}

async function loadProducts(shopId, category) {
  const sort = document.getElementById('sort-select').value;
  const products = await fetchProducts(shopId, category, sort);
  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  const placeholder = document.getElementById('products-placeholder');

  if (!products || products.length === 0) {
    grid.innerHTML = '<p class="no-results">No products found</p>';
    placeholder.style.display = 'none';
    return;
  }

  placeholder.style.display = 'none';
  grid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x180?text=No+Image'">
      <div class="product-info">
        <h3>${product.name}</h3>
        <span class="product-category">${product.category}</span>
        <div class="product-bottom">
          <span class="product-price">₴${product.price}</span>
          <button class="add-to-cart-btn" onclick="handleAddToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            + Add to Cart
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function handleAddToCart(product) {
  addToCart(product);

  // Visual feedback
  const toast = document.getElementById('toast');
  toast.textContent = `${product.name} added to cart!`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}