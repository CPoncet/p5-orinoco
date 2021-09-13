async function getProducts() {
  const getData = await fetch(apiUrl);

  return await getData.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = document.getElementById("products");
  const loader = document.getElementById("loader");

  const data = await getProducts();

  loader.remove();

  if (!data) {
    products.innerHTML = "Nothing returned from API";
  }

  data.forEach((item, index) => {
    let noPadding = index % 3 === 0 ? true : false;

    const el = `<div id="${item._id}" class="w-full sm:w-1/3 sm:mb-4 mb-0 ${
      noPadding ? "sm:pl-0" : "sm:pl-4"
    }"><div class="shadow-lg rounded-lg"><figure><img class="w-full h-32 object-cover" src="${
      item.imageUrl
    }" /></figure><div class="p-4">
    <h3 class="mb-4 ">${item.name}</h3>
    <div class="flex">
    <span>${item.price * 0.01} €</span>
    <div class="flex-1 flex justify-end">
    <a class="px-4 py-2 bg-red-500 rounded-lg text-white" href="product.html?id=${
      item._id
    }">See product</a>
    </div>
    </div>
    </div></div></div>`;
    products.insertAdjacentHTML("beforeend", el);
  });
});
