(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    // Gallery carousel
    $(".gallery-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: false,
        margin: 20,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });

    // Package carousel
    $(".package-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 800,
        center: false,
        margin: 20,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:3
            }
        }
    });

    // Custom nav for package-carousel
    $('#package-carousel-prev').click(function() {
        $('.package-carousel').trigger('prev.owl.carousel');
    });
    $('#package-carousel-next').click(function() {
        $('.package-carousel').trigger('next.owl.carousel');
    });

    // Form submission handling with success animation
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        // Get the form element
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnText = submitBtn.text();
        
        // Show loading state
        submitBtn.prop('disabled', true);
        submitBtn.html('<i class="fa fa-spinner fa-spin"></i> Envoi en cours...');
        
        // Simulate form submission (replace with actual form submission logic)
        setTimeout(function() {
            // Hide the form
            form.fadeOut(300, function() {
                // Show success message
                const successHtml = `
                    <div class="success-message text-center">
                        <div class="success-icon mb-4">
                            <i class="fa fa-check-circle"></i>
                        </div>
                        <h3 class="text-white mb-3">Message envoyé avec succès!</h3>
                        <p class="text-white mb-4">Nous vous répondrons dans les 24 heures.</p>
                        <button class="btn btn-outline-light py-2 px-4" onclick="location.reload()">
                            <i class="fa fa-refresh"></i> Envoyer un autre message
                        </button>
                    </div>
                `;
                
                form.parent().html(successHtml);
                
                // Trigger success animation
                $('.success-message').addClass('animate-success');
            });
        }, 1500);
    });
    
    // Drag-to-scroll for .gallery-carousel
    let isDown = false;
    let startX;
    let scrollLeft;
    const gallery = document.querySelector('.gallery-carousel');
    if (gallery) {
        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.classList.add('dragging');
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });
        gallery.addEventListener('mouseleave', () => {
            isDown = false;
            gallery.classList.remove('dragging');
        });
        gallery.addEventListener('mouseup', () => {
            isDown = false;
            gallery.classList.remove('dragging');
        });
        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 1.2; // scroll speed
            gallery.scrollLeft = scrollLeft - walk;
        });
        // Touch support
        let touchStartX = 0;
        let touchScrollLeft = 0;
        gallery.addEventListener('touchstart', (e) => {
            isDown = true;
            gallery.classList.add('dragging');
            touchStartX = e.touches[0].pageX;
            touchScrollLeft = gallery.scrollLeft;
        });
        gallery.addEventListener('touchend', () => {
            isDown = false;
            gallery.classList.remove('dragging');
        });
        gallery.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX;
            const walk = (x - touchStartX) * 1.2;
            gallery.scrollLeft = touchScrollLeft - walk;
        });
    }

})(jQuery);

