function alterQuantity(item, more) {
  const storage = window.localStorage;
  const cart = JSON.parse(storage.getItem("cart"));

  if ((!item.quantity || item.quantity === 1) && !more) {
    cart.items.splice(
      cart.items.findIndex((x) => x.name === item.name),
      1
    );
  } else {
    cart.items.map((x) =>
      x.name === item.name
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

async function order() {
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
      alert(`Voici le numéro de commande: ${json.orderId}`);
    } else {
      alert("An error occured");
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
                ${item.quantity ? item.price * item.quantity : item.price} €
            </div>
        </div>
        `;

    products.insertAdjacentHTML("beforeend", el);
  });

  products.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex w-full justify-end p-8">
        Total:&nbsp;<strong>${fullPrice} €</strong>
    </div>
    <div>
        <h2>Place order</h2>
        <form onsubmit='return false' id="order-form">
            <div>
                <label>First name: <input type="text" name="firstName" required /></label>
                <label>Last name: <input type="text" name="lastName" required /></label>
            </div>
            <div>
                <label>Address: <input type="text" name="address" required /></label>
                <label>City: <input type="text" name="city" required /></label>
            </div>
            <div>
                <label>Email: <input type="email" name="email" required /></label>
            </div>
            <div>
                <button class="border rounded bg-red-500 text-white py-2 px-4" onClick='order()'>Order</button>
            </div>
        </form>   
    </div>`
  );
});
