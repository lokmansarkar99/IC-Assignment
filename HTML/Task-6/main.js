// Select elements
const menuButton = document.querySelector('.menu');
const closeButton = document.querySelector('.menu-close');
const menu = document.querySelector('.menu-open');

// Show menu when clicking hamburger button
menuButton.addEventListener('click', () => {
    menu.classList.add('active');  // Show menu
    menuButton.style.display = 'none';  // Hide menu button
    closeButton.style.display = 'block'; // Show close button
});

// Hide menu when clicking close button
closeButton.addEventListener('click', () => {
    menu.classList.remove('active');  // Hide menu
    closeButton.style.display = 'none';  // Hide close button
    menuButton.style.display = 'block';  // Show menu button
});
