document.addEventListener('DOMContentLoaded', function() {
    // Button Click Handlers
    const issueCardBtn = document.getElementById('issueCardBtn');
    const verifyAccountBtn = document.getElementById('verifyAccountBtn');
    const activateFeatureBtn = document.getElementById('activateFeatureBtn');
    const chatBtn = document.getElementById('chatBtn');

    issueCardBtn.addEventListener('click', function() {
        showNotification('جاري تحويلك لصفحة إصدار البطاقة...', 'success');
        setTimeout(() => {
            window.location.href = '#issue-card';
        }, 1000);
    });

    verifyAccountBtn.addEventListener('click', function() {
        showNotification('جاري تحويلك لصفحة التوثيق...', 'success');
        setTimeout(() => {
            window.location.href = '#verify-account';
        }, 1000);
    });

    activateFeatureBtn.addEventListener('click', function() {
        showNotification('تم تفعيل خاصية تحويل العملات بنجاح!', 'success');
    });

    chatBtn.addEventListener('click', function() {
        showNotification('مرحباً! كيف يمكننا مساعدتك؟', 'info');
    });

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                         type === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 
                         'linear-gradient(135deg, #3498db, #2980b9)'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-size: 16px;
            font-weight: 600;
            animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-in 2.6s;
            max-width: 350px;
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
    `;
    document.head.appendChild(style);

    // Parallax Effect for 3D Logo
    const logo3d = document.querySelector('.logo-3d-shape');
    let mouseX = 0;
    let mouseY = 0;
    let logoX = 0;
    let logoY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function animateLogo() {
        logoX += (mouseX - logoX) * 0.1;
        logoY += (mouseY - logoY) * 0.1;
        
        if (logo3d) {
            const currentTransform = logo3d.style.transform || '';
            const rotateMatch = currentTransform.match(/rotate3d\([^)]+\)/);
            const baseRotation = rotateMatch ? rotateMatch[0] : 'rotateY(0deg)';
            logo3d.style.transform = `${baseRotation} translateX(${logoX}px) translateY(${logoY}px)`;
        }
        
        requestAnimationFrame(animateLogo);
    }

    animateLogo();

    // Card Tilt Effect
    const visaCard = document.querySelector('.visa-card');
    if (visaCard) {
        visaCard.addEventListener('mousemove', function(e) {
            const rect = visaCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            visaCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        visaCard.addEventListener('mouseleave', function() {
            visaCard.style.transform = 'perspective(1000px) rotateY(-5deg)';
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.hero-buttons, .brand-section, .description-section, .card-section');
    animatedElements.forEach(el => observer.observe(el));

    // Add sparkle effect to buttons on hover
    const buttons = document.querySelectorAll('.action-btn, .feature-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            createSparkles(e, button);
        });
    });

    function createSparkles(e, element) {
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                animation: sparkleAnim 0.6s ease-out forwards;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
            `;
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 600);
        }
    }

    // Add sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleAnim {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // Loading animation for page
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
});
