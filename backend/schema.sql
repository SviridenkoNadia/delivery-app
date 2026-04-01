-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  image_url TEXT
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Seed data: shops
INSERT INTO shops (name, rating, image_url) VALUES
  ('Mc Donny', 4.5, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400'),
  ('Pizza Palace', 4.2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
  ('Sushi Go', 3.8, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'),
  ('Burger Barn', 4.7, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400')
ON CONFLICT DO NOTHING;

-- Seed data: products for Mc Donny (shop_id=1)
INSERT INTO products (shop_id, name, price, category, image_url) VALUES
  (1, 'Big Mac', 89, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'),
  (1, 'Double Cheeseburger', 75, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300'),
  (1, 'McChicken', 65, 'Burgers', 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=300'),
  (1, 'Coca-Cola', 30, 'Drinks', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300'),
  (1, 'Sprite', 30, 'Drinks', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300'),
  (1, 'McFlurry', 55, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300'),
  (1, 'Apple Pie', 40, 'Desserts', 'https://images.unsplash.com/photo-1568571780765-9276b2f7e2a5?w=300'),
  (1, 'French Fries', 45, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300')
ON CONFLICT DO NOTHING;

-- Seed data: products for Pizza Palace (shop_id=2)
INSERT INTO products (shop_id, name, price, category, image_url) VALUES
  (2, 'Margherita', 120, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300'),
  (2, 'Pepperoni', 145, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300'),
  (2, 'BBQ Chicken', 155, 'Pizza', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300'),
  (2, 'Lemonade', 35, 'Drinks', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300'),
  (2, 'Tiramisu', 80, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300')
ON CONFLICT DO NOTHING;

-- Seed data: products for Sushi Go (shop_id=3)
INSERT INTO products (shop_id, name, price, category, image_url) VALUES
  (3, 'California Roll', 110, 'Rolls', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300'),
  (3, 'Salmon Nigiri', 95, 'Nigiri', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300'),
  (3, 'Dragon Roll', 145, 'Rolls', 'https://images.unsplash.com/photo-1617196034099-b65e2a6e6c5c?w=300'),
  (3, 'Miso Soup', 40, 'Soups', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300'),
  (3, 'Green Tea', 25, 'Drinks', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300')
ON CONFLICT DO NOTHING;

-- Seed data: products for Burger Barn (shop_id=4)
INSERT INTO products (shop_id, name, price, category, image_url) VALUES
  (4, 'Classic Burger', 95, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'),
  (4, 'Bacon Burger', 115, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300'),
  (4, 'Veggie Burger', 85, 'Burgers', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300'),
  (4, 'Onion Rings', 50, 'Sides', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300'),
  (4, 'Milkshake', 65, 'Drinks', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300')
ON CONFLICT DO NOTHING;