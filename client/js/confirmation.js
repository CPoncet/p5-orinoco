document.addEventListener('DOMContentLoaded', () => {
const params = new URLSearchParams(window.location.search);

  const orderId = params.get("orderid");
  const price = params.get('price');

  const confirmation = document.getElementById('confirmation');

  confirmation.innerHTML += `
  
    Your order id is: ${orderId}
    <br/>
    Total price of your order: ${price * 0.01} €
  `

})