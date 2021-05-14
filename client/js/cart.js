document.addEventListener('DOMContentLoaded', async () => {

    const storage = window.localStorage

    const cart = JSON.parse(storage.getItem('cart'))

    const products = document.getElementById('products')

    if(!cart || !cart.items.length) {
        products.innerHTML = "Nothing in the cart."
        return;
    }

    cart.items.forEach((item) => {

        const el = `<div class="flex gap-4"><div>${item.name}</div><div>${item.lenses[0]}</div><div>${item.price} €</div></div>`

        products.insertAdjacentHTML('beforeend', el)
    })

})