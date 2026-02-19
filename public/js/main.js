const apiUrl = "/api";




const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);

    const res = await fetch(`${apiUrl}/sessions/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Usuario registrado");
      registerForm.reset();
    } else {
      alert(result.message);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    const res = await fetch(`${apiUrl}/sessions/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔥 ESTO ES CLAVE
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Login exitoso");
      window.location.href = "products.html";
    } else {
      alert(result.message);
    }
  });
}




const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const purchaseBtn = document.getElementById("purchaseBtn");

async function loadProducts() {
  if (!productList) return;

  const res = await fetch(`${apiUrl}/products`);
  const products = await res.json();

  productList.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button data-id="${p._id}">Agregar al carrito</button>
      <hr>
    `;

    productList.appendChild(div);

    div.querySelector("button").addEventListener("click", () => {
      addToCart(p._id);
    });
  });
}




async function getUserCartId() {
  const res = await fetch(`${apiUrl}/sessions/current`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    alert("Debes iniciar sesión");
    throw new Error("No autorizado");
  }

  const user = await res.json();

  return user.cart._id;
}

async function addToCart(pid) {
  try {
    const cid = await getUserCartId();

    const res = await fetch(`${apiUrl}/carts/${cid}/products/${pid}`, {
      method: "POST",
      credentials: "include"
    });

    if (!res.ok) {
      alert("Error al agregar producto");
      return;
    }

    alert("Producto agregado");
    loadCart();

  } catch (error) {
    console.error(error);
  }
}

async function loadCart() {
  if (!cartList) return;

  try {
    const cid = await getUserCartId();

    const res = await fetch(`${apiUrl}/carts/${cid}`, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) return;

    const cart = await res.json();

    cartList.innerHTML = "";

    cart.products.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `
        ${item.product.title} - Cantidad: ${item.quantity}
      `;
      cartList.appendChild(div);
    });

  } catch (error) {
    console.error(error);
  }
}

if (purchaseBtn) {
purchaseBtn.addEventListener("click", async () => {
  try {
    const cid = await getUserCartId();

    const res = await fetch(`${apiUrl}/purchase/${cid}`, {
      method: "POST",
      credentials: "include"
    });

    if (!res.ok) {
      alert("Error al comprar");
      return;
    }

    const ticket = await res.json();

    alert(`
Compra realizada ✅
Código: ${ticket.code}
Total: $${ticket.amount}
Fecha: ${new Date(ticket.purchase_datetime).toLocaleString()}
    `);

    loadCart();

  } catch (error) {
    console.error(error);
  }
});
}

loadProducts();
loadCart();