document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('hamButton');
    console.log(mobileMenuButton);
    const navList = document.getElementById('navList');

    mobileMenuButton.addEventListener('click', function () {
        navList.classList.toggle('show');
    });
});