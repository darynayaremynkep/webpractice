// =====================================================
// 1. Мобільне меню та загальна навігація
// =====================================================

const iconBlock = document.getElementById('iconBlock');
const iconOpen = document.getElementById('iconOpen');
const iconClose = document.getElementById('iconClose');
const mainMenu = document.getElementById('mainMenu');
const topBtnLogin = document.getElementById('topBtnLogin');
const topBtnCreateAccount = document.getElementById('topBtnCreateAccount');
const logo = document.getElementById('logo');
const headerImage = document.getElementById('headerImage');

if (iconBlock) {
    iconBlock.addEventListener('click', () => {
        if (iconOpen) iconOpen.classList.toggle('d-none');
        if (iconClose) iconClose.classList.toggle('d-none');
        if (mainMenu) mainMenu.classList.toggle('menu-open');
        if (topBtnLogin) topBtnLogin.classList.toggle('hidden-btn');
        if (topBtnCreateAccount) topBtnCreateAccount.classList.toggle('hidden-btn');
        if (logo) logo.classList.toggle('move-up');
        
        if (headerImage) {
            headerImage.classList.toggle('d-none');
        }
        
        document.body.classList.toggle('no-scroll');
    });
}

// =====================================================
// 2. Асинхронне завантаження JSON, DOM-рендеринг та Вкладки/Пошук
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const contactGrid = document.getElementById('contactGrid');
    const errorMessage = document.getElementById('errorMessage');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('contactSearch');

    let contactsData = [];
    let currentCategory = 'all';
    let searchQuery = '';

    async function fetchContacts() {
        if (!contactGrid) return; 

        try {
            const response = await fetch('assets/data/contacts.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            contactsData = await response.json();
            renderContacts();
        } catch (error) {
            console.error('Error loading contacts:', error);
            if (errorMessage) {
                errorMessage.classList.remove('d-none');
            }
        }
    }

    function renderContacts() {
        if (!contactGrid) return;
        contactGrid.innerHTML = '';

        const filteredContacts = contactsData.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                  item.description.toLowerCase().includes(searchQuery) ||
                                  item.email.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filteredContacts.length === 0) {
            contactGrid.innerHTML = `<p class="no-results">No contact items match your query.</p>`;
            return;
        }

        filteredContacts.forEach(item => {
            const card = document.createElement('div');
            card.className = `contact-card info-card card-${item.id}`;

            const badge = document.createElement('span');
            badge.className = 'plan-badge badge-popular';
            badge.textContent = item.badge;

            const title = document.createElement('h3');
            title.textContent = item.title;

            const desc = document.createElement('p');
            desc.className = 'info-desc';
            desc.textContent = item.description;

            const emailBox = document.createElement('div');
            emailBox.className = 'contact-detail';
            emailBox.innerHTML = `<i class="fa-solid fa-envelope"></i> <a href="mailto:${item.email}">${item.email}</a>`;

            const detailBox = document.createElement('div');
            detailBox.className = 'contact-detail';
            detailBox.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>${item.detail}</span>`;

            card.appendChild(badge);
            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(emailBox);
            card.appendChild(detailBox);

            contactGrid.appendChild(card);
        });
    }

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentCategory = btn.getAttribute('data-category');
                renderContacts();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderContacts();
        });
    }

    fetchContacts();
});