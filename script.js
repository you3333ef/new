document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.querySelector('.chat-button');
    const phoneMockup = document.querySelector('.phone-mockup');
    const logo = document.querySelector('.logo');
    
    chatButton.addEventListener('click', function() {
        alert('دردشة! نحن هنا لمساعدتك.');
    });
    
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
    
    if (phoneMockup) {
        observer.observe(phoneMockup);
    }
    
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
        
        if (logo) {
            logo.style.transform = `translate(${logoX}px, ${logoY}px)`;
        }
        
        requestAnimationFrame(animateLogo);
    }
    
    animateLogo();
    
    const geometricShape = document.querySelector('.geometric-shape');
    if (geometricShape) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            geometricShape.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }
});
