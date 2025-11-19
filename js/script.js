// ===== ヘッダースクロール効果 =====
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // ===== ハンバーガーメニュー =====
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');

            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.setAttribute('aria-label', isExpanded ? 'メニューを開く' : 'メニューを閉じる');
        });

        // メニューリンククリックで閉じる
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
            });
        });

        // ===== Intersection Observer (スクロールアニメーション) =====
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // アニメーション対象要素を監視
        document.querySelectorAll('[data-animate], .service-card, .achievement-item').forEach(el => {
            observer.observe(el);
        });

        // ===== アクティブナビゲーション =====
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // ===== スムーススクロール (フォールバック) =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // ===== カウントアップアニメーション =====
        const animateValue = (element, start, end, duration) => {
            const range = end - start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / range));
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                const text = element.textContent;
                const suffix = text.replace(/[0-9]/g, '');
                element.textContent = current + suffix;

                if (current === end) {
                    clearInterval(timer);
                }
            }, stepTime);
        };

        // 実績の数字をカウントアップ
        const achievementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const numberElement = entry.target.querySelector('.achievement-number');
                    const text = numberElement.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));

                    if (!isNaN(number)) {
                        numberElement.textContent = '0' + text.replace(/[0-9]/g, '');
                        animateValue(numberElement, 0, number, 2000);
                        entry.target.dataset.animated = 'true';
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.achievement-item').forEach(item => {
            achievementObserver.observe(item);
        });