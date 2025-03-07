

document.getElementById('menu-btn').addEventListener('click', function() {
   document.querySelector('nav .navigation ul').classList.add('active');
});

document.getElementById('menu-close').addEventListener('click', function() {
   document.querySelector('nav .navigation ul').classList.remove('active');
});


