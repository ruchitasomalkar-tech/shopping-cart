const API = "http://localhost:8080/api";
const SESSION_ID = "sess_" + Math.random().toString(36).substr(2, 9);
let allProducts = [];
let cartData = { items: [], total: 0, totalItems: 0 };

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function init() {
  await checkApiStatus();
  await loadProducts();
  await loadCart();
}

async function checkApiStatus() {
  try {
    await fetch(API + "/products");
    document.getElementById("apiBadge").className = "api-badge";
    document.getElementById("apiBadge").textContent = "Spring Boot Live";
  } catch {
    document.getElementById("apiBadge").className = "api-badge offline";
    document.getElementById("apiBadge").textContent = "API Offline";
    useMockData();
  }
}

function useMockData() {
  allProducts = [
    {
      id: 1,
      name: "Mechanical Keyboard",
      description: "RGB backlit",
      price: 2499,
      image: "⌨️",
      category: "Electronics",
      stock: 15,
    },
    {
      id: 2,
      name: "Wireless Mouse",
      description: "Ergonomic, 3200 DPI",
      price: 999,
      image: "🖱️",
      category: "Electronics",
      stock: 30,
    },
    {
      id: 3,
      name: '27" Monitor',
      description: "1080p IPS, 144Hz",
      price: 12999,
      image: "🖥️",
      category: "Electronics",
      stock: 8,
    },
    {
      id: 4,
      name: "USB-C Hub",
      description: "7-in-1 adapter",
      price: 1499,
      image: "🔌",
      category: "Electronics",
      stock: 25,
    },
    {
      id: 5,
      name: "Headphones",
      description: "40hr battery",
      price: 4999,
      image: "🎧",
      category: "Electronics",
      stock: 12,
    },
    {
      id: 6,
      name: "Laptop Stand",
      description: "Adjustable aluminium",
      price: 799,
      image: "💻",
      category: "Accessories",
      stock: 40,
    },
    {
      id: 7,
      name: "Webcam 1080p",
      description: "Full HD with mic",
      price: 1799,
      image: "📷",
      category: "Electronics",
      stock: 20,
    },
    {
      id: 8,
      name: "Desk Lamp",
      description: "LED touch dimmer",
      price: 649,
      image: "💡",
      category: "Accessories",
      stock: 35,
    },
  ];
  renderProducts(allProducts);
}

async function loadProducts() {
  try {
    allProducts = await apiFetch(API + "/products");
    renderProducts(allProducts);
  } catch {}
}

function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!products.length) {
    grid.innerHTML =
      '<div style="text-align:center;padding:3rem;">No products found.</div>';
    return;
  }
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card">
      <div class="product-emoji">${p.image}</div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <span class="stock-badge">✓ ${p.stock} in stock</span>
        <div class="product-footer">
          <div class="product-price">₹${p.price.toLocaleString("en-IN")}</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function filterProducts(category, btn) {
  document
    .querySelectorAll(".filter-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  const filtered =
    category === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === category);
  renderProducts(filtered);
}

async function loadCart() {
  try {
    cartData = await apiFetch(API + "/cart?sessionId=" + SESSION_ID);
    renderCart();
  } catch {
    renderCart();
  }
}

async function addToCart(productId) {
  try {
    cartData = await apiFetch(API + "/cart/add", {
      method: "POST",
      body: JSON.stringify({ sessionId: SESSION_ID, productId, quantity: 1 }),
    });
  } catch {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;
    const existing = cartData.items.find((i) => i.product.id === productId);
    if (existing) existing.quantity++;
    else cartData.items.push({ product, quantity: 1 });
    cartData.total = cartData.items.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0,
    );
    cartData.totalItems = cartData.items.reduce((s, i) => s + i.quantity, 0);
  }
  renderCart();
  showToast("Added to cart!");
  bumpCount();
}

async function removeFromCart(productId) {
  try {
    cartData = await apiFetch(API + "/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ sessionId: SESSION_ID, productId }),
    });
  } catch {
    cartData.items = cartData.items.filter((i) => i.product.id !== productId);
    cartData.total = cartData.items.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0,
    );
    cartData.totalItems = cartData.items.reduce((s, i) => s + i.quantity, 0);
  }
  renderCart();
}

async function updateQty(productId, qty) {
  try {
    cartData = await apiFetch(API + "/cart/update", {
      method: "PUT",
      body: JSON.stringify({ sessionId: SESSION_ID, productId, quantity: qty }),
    });
  } catch {
    if (qty <= 0)
      cartData.items = cartData.items.filter((i) => i.product.id !== productId);
    else {
      const item = cartData.items.find((i) => i.product.id === productId);
      if (item) item.quantity = qty;
    }
    cartData.total = cartData.items.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0,
    );
    cartData.totalItems = cartData.items.reduce((s, i) => s + i.quantity, 0);
  }
  renderCart();
}

async function clearCart() {
  try {
    cartData = await apiFetch(API + "/cart/clear?sessionId=" + SESSION_ID, {
      method: "DELETE",
    });
  } catch {
    cartData = { items: [], total: 0, totalItems: 0 };
  }
  renderCart();
  showToast("Cart cleared");
}

function renderCart() {
  const body = document.getElementById("cartBody");
  const count = document.getElementById("cartCount");
  const total = document.getElementById("summaryTotal");
  const items = document.getElementById("summaryItems");
  const btn = document.getElementById("checkoutBtn");
  const cartItems = cartData.items || [];
  const cartTotal = cartData.total || 0;
  const cartCount =
    cartData.totalItems || cartItems.reduce((s, i) => s + i.quantity, 0);
  count.textContent = cartCount;
  total.textContent = "₹" + cartTotal.toLocaleString("en-IN");
  items.textContent = cartCount;
  btn.disabled = cartItems.length === 0;
  if (!cartItems.length) {
    body.innerHTML =
      '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.</p></div>';
    return;
  }
  body.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.product.image}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-price">₹${(item.product.price * item.quantity).toLocaleString("en-IN")}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQty(${item.product.id}, ${item.quantity - 1})">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQty(${item.product.id}, ${item.quantity + 1})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.product.id})">✕</button>
    </div>
  `,
    )
    .join("");
}

function checkout() {
  showToast("Order placed! (demo)");
  clearCart();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function bumpCount() {
  const c = document.getElementById("cartCount");
  c.classList.remove("bump");
  void c.offsetWidth;
  c.classList.add("bump");
}

function toggleCartPanel() {
  document.getElementById("cartPanel").scrollIntoView({ behavior: "smooth" });
}

init();