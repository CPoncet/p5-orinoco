async function getProduct(id) {
  const getData = await fetch(`${apiUrl}/${id}`);

  return await getData.json();
}

async function addToCart(item, lense) {
  const qty = parseInt(document.getElementById("qty").value);

  if (typeof qty !== "number" || qty <= 0) {
    return notify("Quantity has a wrong value!", "red");
  }

  const el = item.lenses.filter((x) => x === lense);

  item.lenses = el;

  const storage = window.localStorage;

  let cartObj = { items: [] };

  if (storage.getItem("cart")) {
    cartObj = JSON.parse(storage.getItem("cart"));
  }

  if (cartObj.items.length) {
    cartObj.items.map((x) =>
      x.name === item.name && x.lenses.includes(lense)
        ? x.quantity
          ? x.quantity++
          : (x.quantity = 2)
        : cartObj.items.push({ ...item, quantity: qty })
    );
  } else {
    cartObj.items.push({ ...item, quantity: qty });
  }

  notify("Added to cart!", "green");

  storage.setItem("cart", JSON.stringify(cartObj));
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = document.getElementById("products");
  const loader = document.getElementById("loader");

  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");

  const item = await getProduct(id);

  loader.remove();

  if (!item) {
    products.innerHTML = "Nothing returned from API";
  }

  const buttons = document.createElement("div");

  const el = `
        <div class="flex gap-2">

            <div id="${item._id}" class="w-1/3">
                <figure><img src="${item.imageUrl}" /></figure>
            </div>

            <div class="flex-1">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <select id="select-lenses" name="lenses" class="my-4">
                    ${item.lenses.map(
                      (lense) => `<option value="${lense}">${lense}</option>`
                    )}
                    

                </select>

                <div>
                    <input type="number" name="quantity" id="qty" value="1" />
                    <button id="add-cart" class="border rounded bg-red-500 text-white py-2 px-4" onClick='addToCart(${JSON.stringify(
                      item
                    )}, \"${item.lenses[0]}\");'>Add to cart</button>
                </div>

            </div>

        </div>
        `;

  products.insertAdjacentHTML("beforeend", el);
  const product = document.getElementById(item._id);
  product.appendChild(buttons);

  document.getElementById("select-lenses").addEventListener("change", (e) => {
    document
      .getElementById("add-cart")
      .setAttribute(
        "onclick",
        `addToCart(${JSON.stringify(item)}, \"${e.target.value}\")`
      );
  });
});
