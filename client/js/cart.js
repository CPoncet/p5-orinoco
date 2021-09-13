
function getFullPrice(cart) {
  let fullPrice = 0;

  for (var i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];

    let tempPrice = 0;

    if (item.quantity) {
      tempPrice = item.price * item.quantity;
    } else {
      tempPrice = item.price * 1;
    }

    fullPrice += tempPrice;
  }
  return fullPrice;
}

function emptyCart() {
  const storage = window.localStorage;
  storage.clear();
  window.location.reload();
}

function alterQuantity(item, more) {
  const storage = window.localStorage;
  const cart = JSON.parse(storage.getItem("cart"));

  if ((!item.quantity || item.quantity === 1) && !more) {
    cart.items.splice(
      cart.items.findIndex((x) => x.name === item.name && x.lenses[0] === item.lenses[0]),
      1
    );
  } else {
    cart.items.map((x) =>
      x.name === item.name && x.lenses[0] === item.lenses[0]
        ? more
          ? x.quantity
            ? x.quantity++
            : (x.quantity = 2)
          : x.quantity--
        : null
    );
  }

  storage.setItem("cart", JSON.stringify(cart));

  window.location.reload();
}

async function order(e) {
  e.preventDefault();
  const storage = window.localStorage;
  const cart = JSON.parse(storage.getItem("cart"));

  let productIds = [];

  for (var i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    productIds.push(item._id);
  }

  const formData = new FormData(document.getElementById("order-form"));

  const data = {
    contact: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      address: formData.get("address"),
      city: formData.get("city"),
      email: formData.get("email"),
    },
    products: productIds,
  };

  try {
    const res = await fetch(`${apiUrl}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.orderId) {
      const fullPrice = getFullPrice(cart);
      storage.clear();
      window.location.replace(`confirmation.html?orderid=${json.orderId}&price=${fullPrice}`)
    } else {
      alert("Correct the fields");
    }
  } catch (e) {
    console.log(e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const storage = window.localStorage;

  const cart = JSON.parse(storage.getItem("cart"));

  const products = document.getElementById("products");

  if (!cart || !cart.items.length) {
    products.innerHTML = "Nothing in the cart.";
    return;
  }

  let fullPrice = getFullPrice(cart);

  cart.items.forEach((item, index) => {
    const el = `
        <div class="flex gap-4 pl-4 py-4 ${
          index % 2 === 0 ? "" : "bg-red-100"
        }">
            <div class="flex-1 flex items-center justify-center">
                ${item.name}
            </div>
            <div class="flex-1 flex items-center justify-center">
                ${item.lenses[0]}
            </div>
            <div class="flex-1 flex items-center justify-center">
                ${item.price} €
            </div>
            <div class="flex-1 flex items-center justify-center">
               <button class="mr-2" onClick='alterQuantity(${JSON.stringify(
                 item
               )})'>-</button> ${
      item.quantity ? item.quantity : 1
    } <button class="ml-2" onClick='alterQuantity(${JSON.stringify(
      item
    )}, true)'>+</button>
            </div>
            <div class="flex-1 flex items-center justify-center">
                ${item.quantity ? (item.price * item.quantity) * 0.01 : item.price * 0.01} €
            </div>
        </div>
        `;

    products.insertAdjacentHTML("beforeend", el);
  });

  products.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex p-8">
      <div class="flex-1">
        <button class="border rounded bg-red-500 text-white py-2 px-4" onClick="emptyCart()">Empty cart</button>
      </div>
      <div class="flex flex-1 justify-end">
        Total:&nbsp;<strong>${fullPrice * 0.01} €</strong>
      </div>
    </div>
    <div>
        <h2>Place order</h2>
        <form onsubmit='order(event)' id="order-form">
            <div>
                <label>First name: <input type="text" pattern="[a-zA-Z0-9]+" name="firstName" title="You can only use alphanumeric characters" required /></label>
                <label>Last name: <input type="text" pattern="[a-zA-Z0-9]+" name="lastName" title="You can only use alphanumeric characters" required /></label>
            </div>
            <div>
                <label>Address: <input type="text" pattern="[a-zA-Z0-9]+" name="address" title="You can only use alphanumeric characters" required /></label>
                <label>City: <input type="text" name="city" pattern="[a-zA-Z0-9]+" title="You can only use alphanumeric characters" required /></label>
            </div>
            <div>
                <label>Email: <input type="email" name="email" required /></label>
            </div>
            <div>
                <button type="submit" class="border rounded bg-red-500 text-white py-2 px-4">Order</button>
            </div>
        </form>   
    </div>`
  );
});
