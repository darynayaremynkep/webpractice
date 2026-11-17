const SUPABASE_URL = 'https://cnjxfbxqcegjjdzcixlk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4DdjE8vv6EyfHEk3cO1gYg_3LFsET-M';

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase SDK не завантажився! Перевірте підключення CDN у head.');
}



let currentLang = localStorage.getItem('site_lang') || 'en';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);

    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';

    document.querySelectorAll('.langText').forEach(el => {
        el.textContent = lang === 'en' ? 'UA' : 'EN';
    });


    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.innerHTML = text;
    });

    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const placeholder = el.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) el.placeholder = placeholder;
    });

    if (typeof window.refreshTeamList === 'function') {
        window.refreshTeamList();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.langBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ua' : 'en';
            applyLanguage(newLang);
        });
    });

    applyLanguage(currentLang);
});



const iconBlock = document.getElementById('iconBlock');
const iconOpen = document.getElementById('iconOpen');
const iconClose = document.getElementById('iconClose');
const mainMenu = document.getElementById('mainMenu');
const topBtnLogin = document.getElementById('topBtnLogin');
const topBtnCreateAccount = document.getElementById('topBtnCreateAccount');
const logo = document.getElementById('logo');
const headerImage = document.getElementById('headerImage');
const langBtn = document.getElementById('langBtn');

if (iconBlock) {
    iconBlock.addEventListener('click', () => {
        if (iconOpen) iconOpen.classList.toggle('d-none');
        if (iconClose) iconClose.classList.toggle('d-none');
        if (mainMenu) mainMenu.classList.toggle('menu-open');
        if (topBtnLogin) topBtnLogin.classList.toggle('hidden-btn');
        if (topBtnCreateAccount) topBtnCreateAccount.classList.toggle('hidden-btn');
        if (logo) logo.classList.toggle('move-up');
        if (langBtn) langBtn.classList.toggle('move-up');

        const desktopLangSwitch = document.querySelector('.desktop-lang-switch .lang-btn');
        if (desktopLangSwitch) {
            desktopLangSwitch.classList.toggle('move-up');
        }
        
        if (headerImage) {
            headerImage.classList.toggle('d-none');
        }
        
        document.body.classList.toggle('no-scroll');
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const contactGrid = document.getElementById('contactGrid');
    const errorMessage = document.getElementById('errorMessage');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('contactSearch');

    let contactsData = [];
    let currentCategory = 'all';
    let searchQuery = '';

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

            if (errorMessage) errorMessage.classList.add('d-none');
            renderContacts();
        } catch (error) {
            console.warn('Fetch failed. Using fallback data:', error);
            contactsData = fallbackContacts;

            if (errorMessage) errorMessage.classList.add('d-none');
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
            const noResText = currentLang === 'en' ? 'No contact items match your query.' : 'Нічого не знайдено за вашим запитом.';
            contactGrid.innerHTML = `<p class="no-results">${noResText}</p>`;
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
                showError(nameInput, 'nameError', currentLang === 'en' ? 'Please enter your name' : 'Введіть ваше ім’я');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, 'emailError', currentLang === 'en' ? 'Please enter your email' : 'Введіть свій email');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'emailError', currentLang === 'en' ? 'Please enter a valid email address' : 'Введіть коректний email');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                showError(messageInput, 'messageError', currentLang === 'en' ? 'Please enter your message' : 'Введіть повідомлення');
                isValid = false;
            }

            if (isValid) {
                alert(currentLang === 'en' ? 'Thank you! Your message has been sent successfully.' : 'Дякуємо! Ваше повідомлення успішно надіслано.');
                closeContactModal();
            }
        });
    }



    const authModal = document.getElementById('authModal');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const authForm = document.getElementById('authForm');

    const authTriggerButtons = document.querySelectorAll(
        '.btn-try-it, #topBtnLogin, #topBtnCreateAccount, .try-pp-btn, .login-btn-footer, .try-btn-footer'
    );

    async function updateAuthUI() {
        if (!supabaseClient) return;

        const { data: { session } } = await supabaseClient.auth.getSession();
        const user = session?.user;

        const loginBtn = document.getElementById('topBtnLogin');
        const createAccBtn = document.getElementById('topBtnCreateAccount');
        const footerAuthButtons = document.querySelectorAll('.login-btn-footer, .try-btn-footer');

        if (user) {
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }

            footerAuthButtons.forEach(btn => {
                btn.style.display = 'none';
            });

            if (createAccBtn) {
                const btnSpan = createAccBtn.querySelector('span');
                const btnImg = createAccBtn.querySelector('img');

                if (btnSpan) btnSpan.textContent = currentLang === 'en' ? 'Log out' : 'Вийти';
                if (btnImg) btnImg.src = 'assets/images/icons/logout.svg';

                createAccBtn.classList.add('is-logout-state');
                createAccBtn.onclick = handleLogout;
            }
        } else {
            if (loginBtn) {
                loginBtn.style.display = '';
            }

            footerAuthButtons.forEach(btn => {
                btn.style.display = '';
            });

            if (createAccBtn) {
                const btnSpan = createAccBtn.querySelector('span');
                const btnImg = createAccBtn.querySelector('img');

                if (btnSpan) btnSpan.textContent = currentLang === 'en' ? 'Create free account' : 'Створити акаунт';
                if (btnImg) {
                    btnImg.src = 'assets/images/icons/add-user.svg';
                    btnImg.alt = 'add user icon';
                }

                createAccBtn.classList.remove('is-logout-state');
                createAccBtn.onclick = null;
            }
        }
    }

    async function handleLogout(event) {
        if (event) event.preventDefault();
        if (!supabaseClient) return;

        await supabaseClient.auth.signOut();
        alert(currentLang === 'en' ? 'You have logged out successfully.' : 'Ви успішно вийшли з акаунту.');
        updateAuthUI();
    }

    updateAuthUI();

    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange((event, session) => {
            updateAuthUI();
        });
    }

    if (authTriggerButtons.length > 0 && authModal) {
        authTriggerButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                if (button.classList.contains('is-logout-state')) return;

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
                showError(emailInput, 'authEmailError', currentLang === 'en' ? 'Please enter your email' : 'Введіть свій email');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError(emailInput, 'authEmailError', currentLang === 'en' ? 'Please enter a valid email address' : 'Введіть коректний email');
                isValid = false;
            }

            if (!password) {
                showError(passwordInput, 'authPasswordError', currentLang === 'en' ? 'Please enter your password' : 'Введіть свій пароль');
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordInput, 'authPasswordError', currentLang === 'en' ? 'Password must be at least 6 characters' : 'Пароль має бути не менше 6 символів');
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
                let { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error && (error.message.includes('Invalid login credentials') || error.status === 400)) {
                    const signUpResult = await supabaseClient.auth.signUp({
                        email: email,
                        password: password
                    });

                    data = signUpResult.data;
                    error = signUpResult.error;

                    if (!error) {
                        alert(currentLang === 'en' ? 'Account created successfully!' : 'Акаунт успішно створено!');
                    }
                }

                if (error) {
                    showError(emailInput, 'authEmailError', error.message);
                } else {
                    closeAuthModal();
                    updateAuthUI();
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



document.addEventListener('DOMContentLoaded', () => {
    const addTeamForm = document.getElementById('addTeamForm');
    const teamGrid = document.getElementById('teamGrid');
    const statusAlert = document.getElementById('statusAlert');
    const searchInput = document.getElementById('searchInput');
    const filterDept = document.getElementById('filterDept');
    const sortSelect = document.getElementById('sortSelect');
    const btnSubmit = document.getElementById('btnSubmitTeam');

    if (!teamGrid) return; 

    function showStatus(message, isError = false) {
        if (!statusAlert) return;
        statusAlert.textContent = message;
        statusAlert.className = `status-alert ${isError ? 'error' : 'success'}`;
        statusAlert.classList.remove('d-none');
        setTimeout(() => statusAlert.classList.add('d-none'), 4000);
    }

    function getSupabaseClient() {
        return window.supabaseClient || (typeof supabaseClient !== 'undefined' ? supabaseClient : null);
    }

    async function fetchTeam() {
        const client = getSupabaseClient();
        
        if (!client) {
            console.error('Supabase client is not initialized!');
            return;
        }

        try {
            let query = client.from('team_members').select('*');

            const searchValue = searchInput ? searchInput.value.trim() : '';
            if (searchValue) {
                query = query.ilike('name', `%${searchValue}%`);
            }

            const deptValue = filterDept ? filterDept.value : '';
            if (deptValue) {
                query = query.eq('department', deptValue);
            }

            const sortValue = sortSelect ? sortSelect.value : 'created_at-desc';
            const [sortField, sortOrder] = sortValue.split('-');
            query = query.order(sortField, { ascending: sortOrder === 'asc' });

            const { data, error } = await query;

            if (error) {
                console.error('Supabase fetch error:', error);
                showStatus((currentLang === 'en' ? 'Error loading data: ' : 'Помилка завантаження: ') + error.message, true);
                return;
            }

            renderTeam(data);
        } catch (err) {
            console.error('Fetch team exception:', err);
            showStatus((currentLang === 'en' ? 'Error loading team: ' : 'Помилка завантаження команди: ') + err.message, true);
        }
    }

    window.refreshTeamList = fetchTeam;

    function renderTeam(members) {
        teamGrid.innerHTML = '';

        if (!members || members.length === 0) {
            const emptyText = currentLang === 'en' ? 'No team members found matching your search.' : 'Членів команди за вашим запитом не знайдено.';
            teamGrid.innerHTML = `<p class="empty-msg">${emptyText}</p>`;
            return;
        }

        const deptTranslations = {
            'Marketing': { en: 'Marketing', ua: 'Маркетинг' },
            'Design': { en: 'Design', ua: 'Дизайн' },
            'Engineering': { en: 'Engineering', ua: 'Розробка' },
            'Sales': { en: 'Sales', ua: 'Продажі' }
        };

        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';

            const deptClass = member.department ? member.department.toLowerCase().trim() : '';
            const deptName = member.department;
            const translatedDept = deptTranslations[deptName] 
                ? deptTranslations[deptName][currentLang] 
                : deptName;

            const projectsText = currentLang === 'en' ? 'Projects completed:' : 'Виконано проєктів:';

            card.innerHTML = `
                <h4>${escapeHtml(member.name)}</h4>
                <p class="role-text">${escapeHtml(member.role)}</p>
                <span class="dept-badge ${deptClass}">${escapeHtml(translatedDept)}</span>
                <p class="projects-text"><small>${projectsText} ${member.projects_count}</small></p>
            `;
            teamGrid.appendChild(card);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (addTeamForm) {
        addTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const client = getSupabaseClient();
            if (!client) {
                showStatus(currentLang === 'en' ? 'Database connection is not ready. Please try again.' : 'З’єднання з базою не готове. Спробуйте ще раз.', true);
                return;
            }

            const name = document.getElementById('memberName').value.trim();
            const role = document.getElementById('memberRole').value.trim();
            const department = document.getElementById('memberDept').value;
            const projects_count = parseInt(document.getElementById('memberProjects').value, 10) || 0;

            if (!name || name.length > 50) {
                showStatus(currentLang === 'en' ? 'Name is required (max 50 chars).' : 'Ім’я обов’язкове (макс. 50 символів).', true);
                return;
            }

            const btnText = btnSubmit ? btnSubmit.querySelector('span') : null;
            if (btnSubmit) {
                btnSubmit.disabled = true;
                if (btnText) btnText.textContent = currentLang === 'en' ? 'Saving...' : 'Збереження...';
            }

            try {
                const { error } = await client
                    .from('team_members')
                    .insert([{ name, role, department, projects_count }]);

                if (error) throw error;

                showStatus(currentLang === 'en' ? 'New team member added successfully!' : 'Нового члена команди успішно додано!');
                addTeamForm.reset();
                fetchTeam();
            } catch (err) {
                console.error('Insert team error:', err);
                showStatus((currentLang === 'en' ? 'Failed to add team member: ' : 'Помилка додавання: ') + err.message, true);
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    if (btnText) btnText.textContent = currentLang === 'en' ? 'Add Member' : 'Додати';
                }
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', fetchTeam);
    if (filterDept) filterDept.addEventListener('change', fetchTeam);
    if (sortSelect) sortSelect.addEventListener('change', fetchTeam);

    fetchTeam();
});