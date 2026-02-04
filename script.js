// Утилиты для обработки ошибок
const ErrorHandler = {
    log: (error, context = '') => {
        console.error(`[Ошибка${context ? ` в ${context}` : ''}]:`, error);
    },
    
    showUserMessage: (message, type = 'error') => {
        const messageEl = document.getElementById('formMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `form-message ${type} show`;
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000);
        }
    },
    
    clearFormErrors: () => {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });
    }
};

// Проверка поддержки браузерных функций
const BrowserSupport = {
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    smoothScroll: 'scrollBehavior' in document.documentElement.style,
    
    check: () => {
        if (!BrowserSupport.intersectionObserver) {
            console.warn('IntersectionObserver не поддерживается, анимации будут ограничены');
        }
        if (!BrowserSupport.smoothScroll) {
            console.warn('Smooth scroll не поддерживается, будет использован fallback');
        }
    }
};

// Валидация формы
const FormValidator = {
    validateName: (name) => {
        if (!name || name.trim().length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        }
        if (name.length > 50) {
            return 'Имя слишком длинное (максимум 50 символов)';
        }
        if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(name)) {
            return 'Имя может содержать только буквы, пробелы и дефисы';
        }
        return '';
    },
    
    validatePhone: (phone) => {
        if (!phone || phone.trim().length === 0) {
            return 'Телефон обязателен для заполнения';
        }
        // Удаляем все нецифровые символы для проверки
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return 'Телефон должен содержать минимум 10 цифр';
        }
        if (digitsOnly.length > 15) {
            return 'Телефон слишком длинный';
        }
        return '';
    },
    
    validateEmail: (email) => {
        if (!email || email.trim().length === 0) {
            return ''; // Email не обязателен
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Введите корректный email адрес';
        }
        if (email.length > 100) {
            return 'Email слишком длинный';
        }
        return '';
    },
    
    validateMessage: (message) => {
        if (!message || message.trim().length < 10) {
            return 'Сообщение должно содержать минимум 10 символов';
        }
        if (message.length > 1000) {
            return 'Сообщение слишком длинное (максимум 1000 символов)';
        }
        return '';
    },
    
    showFieldError: (fieldId, errorMessage) => {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
        }
    },
    
    clearFieldError: (fieldId) => {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorEl) {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
        }
    },
    
    validateForm: () => {
        const name = document.getElementById('name')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';
        
        let isValid = true;
        
        // Валидация имени
        const nameError = FormValidator.validateName(name);
        if (nameError) {
            FormValidator.showFieldError('name', nameError);
            isValid = false;
        } else {
            FormValidator.clearFieldError('name');
        }
        
        // Валидация телефона
        const phoneError = FormValidator.validatePhone(phone);
        if (phoneError) {
            FormValidator.showFieldError('phone', phoneError);
            isValid = false;
        } else {
            FormValidator.clearFieldError('phone');
        }
        
        // Валидация email
        const emailError = FormValidator.validateEmail(email);
        if (emailError) {
            FormValidator.showFieldError('email', emailError);
            isValid = false;
        } else {
            FormValidator.clearFieldError('email');
        }
        
        // Валидация сообщения
        const messageError = FormValidator.validateMessage(message);
        if (messageError) {
            FormValidator.showFieldError('message', messageError);
            isValid = false;
        } else {
            FormValidator.clearFieldError('message');
        }
        
        return isValid;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        BrowserSupport.check();
        initNavigation();
        initSmoothScroll();
        initAnimations();
        initForm();
        initScrollEffects();
    } catch (error) {
        ErrorHandler.log(error, 'инициализация');
        ErrorHandler.showUserMessage('Произошла ошибка при загрузке страницы. Пожалуйста, обновите страницу.', 'error');
    }
});

// Мобильное меню
function initNavigation() {
    try {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!menuToggle || !navMenu) {
            console.warn('Элементы навигации не найдены');
            return;
        }
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    } catch (error) {
        ErrorHandler.log(error, 'навигация');
    }
}

// Плавная прокрутка для якорных ссылок
function initSmoothScroll() {
    try {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        if (anchors.length === 0) {
            return;
        }
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                try {
                    const targetId = this.getAttribute('href');
                    if (!targetId || targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (!target) {
                        console.warn(`Элемент с id "${targetId}" не найден`);
                        return;
                    }
                    
                    const offsetTop = target.offsetTop - 70; // Учитываем высоту навбара
                    
                    if (BrowserSupport.smoothScroll) {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback для старых браузеров
                        window.scrollTo(0, offsetTop);
                    }
                    
                    // Закрываем мобильное меню после клика
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                } catch (error) {
                    ErrorHandler.log(error, 'плавная прокрутка');
                }
            });
        });
    } catch (error) {
        ErrorHandler.log(error, 'инициализация плавной прокрутки');
    }
}

// Анимация при прокрутке
function initAnimations() {
    try {
        if (!BrowserSupport.intersectionObserver) {
            // Fallback: показываем элементы сразу
            document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                try {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = entry.target.dataset.transform || 'translateY(0)';
                    }
                } catch (error) {
                    ErrorHandler.log(error, 'обработка анимации');
                }
            });
        }, observerOptions);
        
        // Применяем анимацию к карточкам услуг
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            try {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.dataset.transform = 'translateY(0)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            } catch (error) {
                ErrorHandler.log(error, 'настройка анимации карточки');
            }
        });
        
        // Применяем анимацию к элементам галереи
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            try {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.dataset.transform = 'scale(1)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(item);
            } catch (error) {
                ErrorHandler.log(error, 'настройка анимации галереи');
            }
        });
    } catch (error) {
        ErrorHandler.log(error, 'инициализация анимаций');
        // Fallback: показываем элементы без анимации
        document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
            el.style.opacity = '1';
        });
    }
}

// Обработка формы
function initForm() {
    try {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.warn('Форма контактов не найдена');
            return;
        }
        
        // Валидация в реальном времени
        const fields = ['name', 'phone', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    FormValidator.validateForm();
                });
                
                field.addEventListener('input', () => {
                    FormValidator.clearFieldError(fieldId);
                });
            }
        });
        
        // Обработка отправки формы
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Очищаем предыдущие ошибки
                ErrorHandler.clearFormErrors();
                
                // Валидация
                if (!FormValidator.validateForm()) {
                    ErrorHandler.showUserMessage('Пожалуйста, исправьте ошибки в форме', 'error');
                    return;
                }
                
                // Получаем данные формы
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    message: document.getElementById('message').value.trim()
                };
                
                // Блокируем кнопку отправки
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                    submitBtn.textContent = 'Отправка...';
                }
                
                // Имитация отправки (замените на реальный запрос)
                await simulateFormSubmission(formData);
                
                // Успешная отправка
                ErrorHandler.showUserMessage('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                ErrorHandler.clearFormErrors();
                
            } catch (error) {
                ErrorHandler.log(error, 'отправка формы');
                ErrorHandler.showUserMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.', 'error');
            } finally {
                // Разблокируем кнопку
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Отправить';
                }
            }
        });
    } catch (error) {
        ErrorHandler.log(error, 'инициализация формы');
    }
}

// Имитация отправки формы (замените на реальный запрос)
async function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Здесь должен быть реальный запрос к серверу
            // Например: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
            
            // Для демонстрации - случайная ошибка в 10% случаев
            if (Math.random() < 0.1) {
                reject(new Error('Ошибка сети'));
            } else {
                console.log('Данные формы:', formData);
                resolve();
            }
        }, 1500);
    });
}

// Изменение навбара при прокрутке
function initScrollEffects() {
    try {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) {
            return;
        }
        
        const handleScroll = () => {
            try {
                const currentScroll = window.pageYOffset || window.scrollY || 0;
                
                if (currentScroll > 100) {
                    navbar.style.background = 'rgba(26, 26, 26, 0.98)';
                    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.background = 'rgba(26, 26, 26, 0.95)';
                    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
                
                // Эффект параллакса для hero секции
                const hero = document.querySelector('.hero');
                if (hero && currentScroll < window.innerHeight) {
                    hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
                }
                
                lastScroll = currentScroll;
            } catch (error) {
                ErrorHandler.log(error, 'обработка прокрутки');
            }
        };
        
        // Throttle для оптимизации
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    } catch (error) {
        ErrorHandler.log(error, 'инициализация эффектов прокрутки');
    }
}

// Обработка глобальных ошибок
window.addEventListener('error', (event) => {
    ErrorHandler.log(event.error, 'глобальная ошибка');
    // Не показываем пользователю технические ошибки
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.log(event.reason, 'необработанный промис');
    event.preventDefault(); // Предотвращаем вывод в консоль браузера
});
