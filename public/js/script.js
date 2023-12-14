document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('hamButton');
    const navList = document.getElementById('navList');

    mobileMenuButton.addEventListener('click', function () {
        navList.classList.toggle('show');
    });
});