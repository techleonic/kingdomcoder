document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out-cubic'
    });

    // Toggle Sidebar on Mobile
    const toggleSidebarBtn = document.createElement('button');
    toggleSidebarBtn.classList.add('toggle-sidebar-btn');
    toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.dashboard-main').prepend(toggleSidebarBtn);

    toggleSidebarBtn.addEventListener('click', function() {
        document.querySelector('.dashboard-sidebar').classList.toggle('show');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const toggleBtn = document.querySelector('.toggle-sidebar-btn');
        
        if (sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleBtn && 
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });

    // Custom cursor follower
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        requestAnimationFrame(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
            cursorFollower.style.opacity = '1';
        });
    });

    // Hover effect for buttons, links and cards
    const hoverElements = document.querySelectorAll('.btn, a, .course-card, .course-progress-card, .event-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            cursorFollower.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.backgroundColor = 'rgba(255, 107, 107, 0.5)';
        });
    });

    // Hide cursor follower when leaving window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget === null) {
            cursorFollower.style.opacity = '0';
        }
    });

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box .btn');
    const searchTags = document.querySelectorAll('.search-tag');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        searchTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                searchInput.value = this.textContent;
                performSearch(this.textContent);
            });
        });
    }
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        // For demo purposes, just show an alert
        alert(`Buscando: ${query}`);
        
        // In a real application, you would:
        // 1. Send an AJAX request to the server
        // 2. Process the results
        // 3. Update the UI with the search results
    }

    // Course progress animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width;
        }, 500);
    });

    // Course tabs functionality
    const courseTabs = document.querySelectorAll('#coursesTabs .nav-link');
    
    courseTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Reset all progress bars in the newly shown tab
            const tabId = this.getAttribute('data-bs-target');
            const tabPane = document.querySelector(tabId);
            const tabProgressBars = tabPane.querySelectorAll('.progress-bar');
            
            tabProgressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                bar.style.transition = 'none';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-in-out';
                    bar.style.width = width;
                }, 50);
            });
        });
    });

    // Notification dropdown functionality
    const notificationDropdown = document.getElementById('notificationsDropdown');
    
    if (notificationDropdown) {
        notificationDropdown.addEventListener('show.bs.dropdown', function() {
            // In a real application, you would mark notifications as read here
            setTimeout(() => {
                const badge = this.querySelector('.notification-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            }, 2000);
        });
    }
});