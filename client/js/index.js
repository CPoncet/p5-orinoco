async function getProducts() {

    const getData = await fetch(apiUrl)

    return await getData.json()  

}

document.addEventListener('DOMContentLoaded', async () => {
    const products = document.getElementById("products")
    const loader = document.getElementById('loader')

    const data = await getProducts()

    loader.remove();

    if(!data) {
        products.innerHTML = "Nothing returned from API"
    }

    data.forEach((item, index) => {
        let noPadding = index % 3 === 0 ? true : false
        
        const el = `<div id="${item._id}" class="w-full sm:w-1/3 ${noPadding ? "sm:pl-0" : "sm:pl-4"}"><figure><img src="${item.imageUrl}" /></figure><a href="product.html?id=${item._id}">See product</a></div>`
        products.insertAdjacentHTML('beforeend', el)
    })

})



