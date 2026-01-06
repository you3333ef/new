document.addEventListener('DOMContentLoaded', function() {
    const exchangeForm = document.getElementById('exchangeForm');
    const amountInput = document.getElementById('amountInput');
    const resultInput = document.getElementById('resultInput');
    const swapBtn = document.getElementById('swapBtn');
    const backBtn = document.getElementById('backBtn');
    const usdToSypBtn = document.getElementById('usdToSyp');
    const sypToUsdBtn = document.getElementById('sypToUsd');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const exchangeRateDisplay = document.getElementById('exchangeRate');
    const fromLabel = document.getElementById('fromLabel');
    const toLabel = document.getElementById('toLabel');
    const inputCurrency = document.getElementById('inputCurrency');
    const resultCurrency = document.getElementById('resultCurrency');

    let currentRate = 15750;
    let currentDirection = 'USD_TO_SYP';

    function updateExchangeRate() {
        exchangeRateDisplay.textContent = currentRate.toLocaleString('ar-SY');
    }

    function calculateExchange() {
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount <= 0) {
            resultInput.value = '';
            return;
        }

        resultInput.classList.add('calculating');

        setTimeout(() => {
            let result;
            
            if (currentDirection === 'USD_TO_SYP') {
                result = amount * currentRate;
            } else {
                result = amount / currentRate;
            }

            resultInput.value = result.toFixed(2);
            resultInput.classList.remove('calculating');

            resultInput.style.animation = 'none';
            setTimeout(() => {
                resultInput.style.animation = 'pulse 0.6s ease-out';
            }, 10);
        }, 300);
    }

    amountInput.addEventListener('input', function() {
        calculateExchange();
    });

    function switchDirection(direction) {
        currentDirection = direction;
        
        if (direction === 'USD_TO_SYP') {
            usdToSypBtn.classList.add('active');
            sypToUsdBtn.classList.remove('active');
            fromLabel.textContent = 'المبلغ بالدولار';
            toLabel.textContent = 'المبلغ بالليرة السورية';
            inputCurrency.textContent = 'USD';
            resultCurrency.textContent = 'SYP';
        } else {
            sypToUsdBtn.classList.add('active');
            usdToSypBtn.classList.remove('active');
            fromLabel.textContent = 'المبلغ بالليرة السورية';
            toLabel.textContent = 'المبلغ بالدولار';
            inputCurrency.textContent = 'SYP';
            resultCurrency.textContent = 'USD';
        }

        amountInput.value = '';
        resultInput.value = '';
        amountInput.focus();
    }

    usdToSypBtn.addEventListener('click', function() {
        switchDirection('USD_TO_SYP');
        showNotification('تم التبديل إلى: دولار → ليرة', 'info');
    });

    sypToUsdBtn.addEventListener('click', function() {
        switchDirection('SYP_TO_USD');
        showNotification('تم التبديل إلى: ليرة → دولار', 'info');
    });

    swapBtn.addEventListener('click', function() {
        const currentValue = amountInput.value;
        const currentResult = resultInput.value;

        if (currentDirection === 'USD_TO_SYP') {
            switchDirection('SYP_TO_USD');
            if (currentResult) {
                amountInput.value = currentResult;
                calculateExchange();
            }
        } else {
            switchDirection('USD_TO_SYP');
            if (currentResult) {
                amountInput.value = currentResult;
                calculateExchange();
            }
        }

        showNotification('تم عكس التحويل بنجاح', 'success');
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.dataset.amount;
            amountInput.value = amount;
            calculateExchange();
            
            amountInput.focus();
            
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    exchangeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const amount = parseFloat(amountInput.value);
        const result = parseFloat(resultInput.value);

        if (!amount || amount <= 0) {
            showNotification('الرجاء إدخال المبلغ المراد تحويله', 'info');
            amountInput.focus();
            return;
        }

        const submitBtn = exchangeForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>جاري المعالجة...</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #f0b429 0%, #f7c84b 100%)';

        amountInput.classList.add('calculating');
        resultInput.classList.add('calculating');

        setTimeout(() => {
            amountInput.classList.remove('calculating');
            resultInput.classList.remove('calculating');
            
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            submitBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg><span>تم التحويل بنجاح</span>';

            const fromCurrency = currentDirection === 'USD_TO_SYP' ? 'دولار' : 'ليرة';
            const toCurrency = currentDirection === 'USD_TO_SYP' ? 'ليرة' : 'دولار';
            
            showNotification(`تم تحويل ${amount.toLocaleString('ar-SY')} ${fromCurrency} إلى ${result.toLocaleString('ar-SY')} ${toCurrency}`, 'success');

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #3b7cb8 0%, #4a8dc9 100%)';
                submitBtn.disabled = false;
                
                amountInput.value = '';
                resultInput.value = '';
                amountInput.focus();
            }, 2500);
        }, 2000);
    });

    backBtn.addEventListener('click', function() {
        document.querySelector('.exchange-container').style.animation = 'fadeOut 0.4s ease-out';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 400);
    });

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
            border-radius: 14px;
            box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-size: 15px;
            font-weight: 600;
            animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-in 2.6s;
            max-width: 350px;
            backdrop-filter: blur(10px);
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

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }
    `;
    document.head.appendChild(style);

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

    setTimeout(() => {
        amountInput.focus();
    }, 600);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            backBtn.click();
        }
    });

    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    updateExchangeRate();

    setInterval(() => {
        const variation = Math.floor(Math.random() * 100) - 50;
        currentRate = 15750 + variation;
        updateExchangeRate();
    }, 30000);
});
