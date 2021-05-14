async function getProduct(id) {


    const getData = await fetch(`${apiUrl}/${id}`)

    return await getData.json()  

}

async function addToCart(item, lense) {
    const el = item.lenses.filter(x => x === lense); 
    
    item.lenses = el;

    const storage = window.localStorage

    let cartObj = {items: []}

    if(storage.getItem('cart')) {
        cartObj = JSON.parse(storage.getItem('cart'))
    }

    cartObj.items.push(item)

    storage.setItem('cart', JSON.stringify(cartObj))
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = document.getElementById("products")
    const loader = document.getElementById('loader')

    const params = new URLSearchParams(window.location.search)

    const id = params.get('id')

    const item = await getProduct(id)

    loader.remove();

    if(!item) {
        products.innerHTML = "Nothing returned from API"
    }

    
        const buttons = document.createElement('div')
        item.lenses.forEach((lense) => {
            buttons.insertAdjacentHTML('beforeend', `<button class="border rounded bg-red-500 text-white py-2 px-4" onClick='addToCart(${JSON.stringify(item)}, \"${lense}\");'>${lense}</button>`)
        })
        const el = `<div id="${item._id}" class="w-full"><figure><img src="${item.imageUrl}" /></figure></div>`
        products.insertAdjacentHTML('beforeend', el)
        const product = document.getElementById(item._id)
        product.appendChild(buttons)
    

})