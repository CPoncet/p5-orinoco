const apiUrl = "http://localhost:3000/api/cameras";

function notify(message, type) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div id="notif" class="bg-${type}-500 fixed left-0 right-0 mx-auto top-1/2 z-10 w-1/3 p-4 h-1/3 flex items-center justify-center">${message}</div>`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const cart = document.getElementById("cart");

  let cartNum = 0;

  const cartStore = JSON.parse(window.localStorage.getItem("cart"));

  if (!cartStore || !cartStore.items || !cartStore.items.length) {
    cartNum = 0;
  } else {
    for (var i = 0; i < cartStore.items.length; i++) {
      const item = cartStore.items[i];
      console.log(item);
      if (!item.quantity) {
        cartNum++;
      } else {
        cartNum += item.quantity;
      }
    }
  }

  cart.innerHTML += `Cart (${cartNum})`;
});
