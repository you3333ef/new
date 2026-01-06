document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('.submit-btn');
    const qrScannerBtn = document.getElementById('qrScannerBtn');
    const backBtn = document.getElementById('backBtn');

    // Input validation patterns
    const patterns = {
        phone: /^[0-9]{10,15}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^.{6,}$/
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
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const phoneValue = phoneInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;

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

        if (!isValid) {
            showNotification('الرجاء التحقق من البيانات المدخلة', 'info');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'جاري تسجيل الدخول...';
        submitBtn.disabled = true;
        
        // Add loading class to inputs
        phoneInput.classList.add('loading');
        emailInput.classList.add('loading');
        passwordInput.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            // Remove loading state
            phoneInput.classList.remove('loading');
            emailInput.classList.remove('loading');
            passwordInput.classList.remove('loading');
            submitBtn.textContent = 'تسجيل الدخول';
            submitBtn.disabled = false;

            // Show success message
            showNotification('تم تسجيل الدخول بنجاح!', 'success');

            // Add success animation to button
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            setTimeout(() => {
                submitBtn.style.background = 'linear-gradient(135deg, #3b7cb8 0%, #4a8dc9 100%)';
                // Redirect to dashboard or home
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    });

    // QR Scanner button
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
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // Show/hide password on double click
    let clickCount = 0;
    let clickTimer = null;

    passwordInput.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            // Toggle password visibility
            if (this.type === 'password') {
                this.type = 'text';
                showNotification('كلمة السر مرئية', 'info');
                setTimeout(() => {
                    this.type = 'password';
                }, 2000);
            }
        }
    });

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
    const allInputs = [phoneInput, emailInput, passwordInput];
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
