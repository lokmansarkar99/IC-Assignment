const menu_btn = document.getElementById("menu-btn")
const close_btn = document.getElementById("close-btn")
const nav_menu = document.getElementById("nav-menu")

const products = document.querySelectorAll(".product")


menu_btn.addEventListener("click" , (event) => {
    nav_menu.classList.add("active")
    menu_btn.style.display = "none"
    close_btn.style.display = "block"
})

close_btn.addEventListener("click", (event ) => {
nav_menu.classList.remove("active")
close_btn.style.display = "none"
menu_btn.style.display = "block"
})

products.forEach((product) => {
    product.addEventListener("click", () => {
        window.location.href = "productdetail.html";
    });
});