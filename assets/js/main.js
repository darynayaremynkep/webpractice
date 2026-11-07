// Ініціалізація Supabase 
const SUPABASE_URL = 'https://cnjxfbxqcegjjdzcixlk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4DdjE8vv6EyfHEk3cO1gYg_3LFsET-M';

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase SDK не завантажився! Перевірте підключення CDN у head.');
}
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

    // Резервний масив даних (fallback)
    const fallbackContacts = [
        {
            id: 1,
            category: "support",
            title: "Customer Support",
            description: "Our team usually responds within a few hours during business days.",
            email: "support@postpilot.com",
            detail: "Live Chat available Mon-Fri",
            badge: "24/7 Priority"
        },
        {
            id: 2,
            category: "offices",
            title: "Print Facility & HQ",
            description: "All postcard campaigns are printed and dispatched directly from our main facility.",
            email: "print@postpilot.com",
            detail: "South Carolina, United States",
            badge: "Main Hub"
        },
        {
            id: 3,
            category: "support",
            title: "Partnership & Press",
            description: "Interested in joining our partner program or press inquiries?",
            email: "partners@postpilot.com",
            detail: "Co-marketing & Affiliates",
            badge: "Growth"
        },
        {
            id: 4,
            category: "offices",
            title: "European Office",
            description: "Our regional coordination office for international delivery and support.",
            email: "eu-support@postpilot.com",
            detail: "London, United Kingdom",
            badge: "Europe"
        }
    ];

    async function fetchContacts() {
        if (!contactGrid) return;

        try {
            const response = await fetch('assets/data/contacts.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            contactsData = await response.json();

            if (errorMessage) {
                errorMessage.classList.add('d-none');
            }

            renderContacts();
        } catch (error) {
            console.warn('Fetch failed. Using fallback data:', error);
            
            contactsData = fallbackContacts;

            if (errorMessage) {
                errorMessage.classList.add('d-none');
            }

            renderContacts();
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

    // =====================================================
    // 3. Спільні допоміжні функції для форм
    // =====================================================
    function clearFormErrors(formElement) {
        if (!formElement) return;
        formElement.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        formElement.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));
    }

    function showError(inputElement, errorElementId, message) {
        inputElement.classList.add('invalid');
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // =====================================================
    // 4. Модальне вікно 1: Contact Modal (Зворотний зв'язок)
    // =====================================================
    const contactModal = document.getElementById('contactModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalForm = document.getElementById('modalForm');

    if (openModalBtn && contactModal) {
        openModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('d-none');
            document.body.classList.add('no-scroll');
        });
    }

    if (closeModalBtn && contactModal) {
        closeModalBtn.addEventListener('click', closeContactModal);
    }

    if (contactModal) {
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                closeContactModal();
            }
        });
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.add('d-none');
            document.body.classList.remove('no-scroll');
            if (modalForm) {
                modalForm.reset();
                clearFormErrors(modalForm);
            }
        }
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearFormErrors(modalForm);

            const nameInput = document.getElementById('modalName');
            const emailInput = document.getElementById('modalEmail');
            const messageInput = document.getElementById('modalMessage');

            let isValid = true;

            if (!nameInput.value.trim()) {
                showError(nameInput, 'nameError', 'Please enter your name');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, 'emailError', 'Please enter your email');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'emailError', 'Please enter a valid email address');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                showError(messageInput, 'messageError', 'Please enter your message');
                isValid = false;
            }

            if (isValid) {
                alert('Thank you! Your message has been sent successfully.');
                closeContactModal();
            }
        });
    }

   // =====================================================
    // 5. Модальне вікно 2: Auth Modal (Логін / Реєстрація / Сесія)
    // =====================================================
    const authModal = document.getElementById('authModal');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const authForm = document.getElementById('authForm');

    const authTriggerButtons = document.querySelectorAll(
        '.btn-try-it, #topBtnLogin, #topBtnCreateAccount, .try-pp-btn, .login-btn-footer, .try-btn-footer'
    );

    // =====================================================
    // Оновлення стану авторизації (UI)
    // =====================================================
    // =====================================================
    // Оновлення стану авторизації (UI)
    // =====================================================
    // =====================================================
    // Оновлення стану авторизації (UI)
    // =====================================================
    async function updateAuthUI() {
        if (!supabaseClient) return;

        const { data: { session } } = await supabaseClient.auth.getSession();
        const user = session?.user;

        const loginBtn = document.getElementById('topBtnLogin');
        const createAccBtn = document.getElementById('topBtnCreateAccount');

        if (user) {
            // 1. Приховуємо кнопку "Login"
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }

            // 2. Оновлюємо кнопку "Create free account" -> "Log out"
            if (createAccBtn) {
                const btnSpan = createAccBtn.querySelector('span');
                const btnImg = createAccBtn.querySelector('img');

                if (btnSpan) btnSpan.textContent = 'Log out';

                if (btnImg) btnImg.src = 'assets/images/icons/logout.svg';

                
                createAccBtn.classList.add('is-logout-state');
                createAccBtn.onclick = handleLogout;
            }
        } else {
            // 3. Стан ПОЧАТКОВИЙ (коли користувач НЕ авторизований / вийшов)
            if (loginBtn) {
                loginBtn.classList.remove('d-none');
            }

            if (createAccBtn) {
                const btnSpan = createAccBtn.querySelector('span');
                const btnImg = createAccBtn.querySelector('img');

                // Гарантовано повертаємо оригінальний текст і SVG-картинку реєстрації
                if (btnSpan) btnSpan.textContent = 'Create free account';
                if (btnImg) {
                    btnImg.src = 'assets/images/icons/add-user.svg';
                    btnImg.alt = 'add user icon';
                }

                createAccBtn.classList.remove('is-logout-state');
                createAccBtn.onclick = null; // Знімаємо вихід
            }
        }
    }
    // Функція виходу з акаунту
    async function handleLogout(event) {
        if (event) event.preventDefault();
        if (!supabaseClient) return;

        await supabaseClient.auth.signOut();
        alert('You have logged out successfully.');
        updateAuthUI();
    }

    

    // Автоматично перевіряємо стан при завантаженні сторінки
    updateAuthUI();

    // Підписуємося на зміни стану авторизації (Login / Logout)
    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange((event, session) => {
            updateAuthUI();
        });
    }

    // -----------------------------------------------------
    // Б. Відкриття / Закриття модального вікна
    // -----------------------------------------------------
    if (authTriggerButtons.length > 0 && authModal) {
        authTriggerButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                // Якщо це кнопка "Log out", не відкриваємо модалку
                if (button.textContent.trim() === 'Log out') return;

                event.preventDefault();
                authModal.classList.remove('d-none');
                document.body.classList.add('no-scroll');
            });
        });
    }

    if (closeAuthModalBtn && authModal) {
        closeAuthModalBtn.addEventListener('click', closeAuthModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (event) => {
            if (event.target === authModal) {
                closeAuthModal();
            }
        });
    }

    function closeAuthModal() {
        if (authModal) {
            authModal.classList.add('d-none');
            document.body.classList.remove('no-scroll');
            if (authForm) {
                authForm.reset();
                clearFormErrors(authForm);
            }
        }
    }

    // -----------------------------------------------------
    // В. Обробка відправки форми (Login / Signup)
    // -----------------------------------------------------
    if (authForm) {
        authForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearFormErrors(authForm);

            const emailInput = document.getElementById('authEmail');
            const passwordInput = document.getElementById('authPassword');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            let isValid = true;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError(emailInput, 'authEmailError', 'Please enter your email');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError(emailInput, 'authEmailError', 'Please enter a valid email address');
                isValid = false;
            }

            if (!password) {
                showError(passwordInput, 'authPasswordError', 'Please enter your password');
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordInput, 'authPasswordError', 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            if (!supabaseClient) {
                showError(emailInput, 'authEmailError', 'Database connection error.');
                return;
            }

            const submitBtn = authForm.querySelector('.btn-submit');
            if (submitBtn) submitBtn.disabled = true;

            try {
                // 1. Спроба входу
                let { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                // 2. Якщо користувача не знайдено — створюємо новий акаунт
                if (error && (error.message.includes('Invalid login credentials') || error.status === 400)) {
                    const signUpResult = await supabaseClient.auth.signUp({
                        email: email,
                        password: password
                    });

                    data = signUpResult.data;
                    error = signUpResult.error;

                    if (!error) {
                        alert('Account created successfully!');
                    }
                }

                if (error) {
                    showError(emailInput, 'authEmailError', error.message);
                } else {
                    closeAuthModal();
                    updateAuthUI(); // Оновлюємо кнопки в шапці
                }
            } catch (err) {
                console.error('Supabase auth error:', err);
                showError(emailInput, 'authEmailError', 'Authentication failed.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});