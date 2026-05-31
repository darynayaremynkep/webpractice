const iconBlock = document.getElementById('iconBlock');
const iconOpen = document.getElementById('iconOpen');
const iconClose = document.getElementById('iconClose');
const mainMenu = document.getElementById('mainMenu');
const topBtnLogin = document.getElementById('topBtnLogin');
const topBtnCreateAccount = document.getElementById('topBtnCreateAccount');
const logo = document.getElementById('logo');
const headerImage = document.getElementById('headerImage');

iconBlock.addEventListener('click', () => {
    iconOpen.classList.toggle('d-none');
    iconClose.classList.toggle('d-none');
    mainMenu.classList.toggle('menu-open');
    topBtnLogin.classList.toggle('hidden-btn');
    topBtnCreateAccount.classList.toggle('hidden-btn');
    logo.classList.toggle('move-up');
    headerImage.classList.toggle('d-none');
});