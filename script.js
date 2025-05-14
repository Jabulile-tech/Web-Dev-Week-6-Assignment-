let cart = [];
let total = 0;

function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    total += itemPrice;
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - R${item.price}`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(index);
        listItem.appendChild(removeBtn);
        cartList.appendChild(listItem);
    });

    document.getElementById("cart-total").textContent = total;
    document.getElementById("cart").style.display = "block";
}

function removeFromCart(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    alert(`Your order total is RR{total}. Thank you for choosing Gamede's Fried Chicken!`);
    cart = [];
    total = 0;
    updateCart();
}

function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    total += itemPrice;
    updateCart();
}
function addToCart(itemName, itemPrice, portionId, spiceId) {
    const portion = document.getElementById(portionId).value;
    const spice = document.getElementById(spiceId).value;

    cart.push({ name: itemName, price: itemPrice, portion: portion, spice: spice });
    total += itemPrice;
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.portion} Portion - ${item.spice} - R${item.price}`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(index);
        listItem.appendChild(removeBtn);
        cartList.appendChild(listItem);
    });

    document.getElementById("cart-total").textContent = total;
    document.getElementById("cart").style.display = "block";
}
function checkout() {
    fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total: total })
    })
    .then(response => response.json())
    .then(data => {
        alert("Redirecting to payment...");
        window.location.href = `https://checkout.stripe.com/pay/${data.clientSecret}`;
    });

    cart = [];
    total = 0;
    updateCart();
}
// Button Click Event (Order Button)
document.getElementById("orderBtn").addEventListener("click", function() {
    alert("Your order is being processed!");
});

// Hover Effect (Menu Items)
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("mouseover", () => {
        item.style.transform = "scale(1.05)";
    });

    item.addEventListener("mouseout", () => {
        item.style.transform = "scale(1)";
    });
});

// Keypress Detection (Enter key submits order)
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkout();
    }
});

// Button Text Change on Click
document.getElementById("specialBtn").addEventListener("click", function() {
    this.textContent = "You Clicked Me!";
    this.style.backgroundColor = "#ff6600";
});

// Tabs/Accordion Content Toggle
function showTab(tabName) {
    document.getElementById("mains").style.display = tabName === "mains" ? "block" : "none";
    document.getElementById("drinks").style.display = tabName === "drinks" ? "block" : "none";
}

// Image Slideshow Functionality
const images = ["burger.jpg", "hot-wings.jpg", "fries.jpg"];
let slideIndex = 0;

function nextSlide() {
    slideIndex = (slideIndex + 1) % images.length;
    document.getElementById("slide").src = images[slideIndex];
}