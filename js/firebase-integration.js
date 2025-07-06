// Firebase Integration for Main Website

// Load packages from Firebase
async function loadPackagesFromFirebase() {
    try {
        const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
        const packages = [];
        snapshot.forEach(doc => {
            packages.push({ id: doc.id, ...doc.data() });
        });
        
        // Update packages section
        updatePackagesSection(packages);
        
    } catch (error) {
        console.error('Error loading packages:', error);
    }
}

// Update packages section
function updatePackagesSection(packages) {
    const container = document.querySelector('.package-carousel');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Hide loader if present
    var loader = document.getElementById('package-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(function() { loader.style.display = 'none'; }, 500);
    }
    
    packages.forEach(package => {
        const card = `
            <div class="card-outer">
                <div class="package-item mx-2">
                    <div class="overflow-hidden">
                        <img class="img-fluid" src="${package.imageUrl || 'img/package-1.jpg'}" alt="${package.title}">
                    </div>
                    <div class="card-destination-row">
                        <span class="card-destination-icon"><i class="fa fa-map-marker-alt"></i></span>
                        <span class="card-destination-text">${package.destination}</span>
                    </div>
                    <div class="text-center p-4">
                        <h4 class="mb-2">${package.title}</h4>
                        <p>${package.description}</p>
                        <div class="d-flex justify-content-center">
                            <a href="#" class="btn btn-sm btn-primary px-3 border-end" style="border-radius: 30px 0 0 30px;" onclick="event.preventDefault(); openPackageModal('${package.id}')">Lire Plus</a>
                            <a href="#contact-form" class="btn btn-sm btn-primary px-3" style="border-radius: 0 30px 30px 0;" onclick="redirectToContact('${package.title}')">Réserver</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
    // Re-initialize Owl Carousel after dynamic content is loaded
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
        const $carousel = window.jQuery(container);
        $carousel.trigger('destroy.owl.carousel');
        $carousel.owlCarousel({
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
                0:{ items:1 },
                576:{ items:2 },
                768:{ items:3 },
                992:{ items:3 }
            }
        });
    }
}

// Load visas from Firebase
async function loadVisasFromFirebase() {
    try {
        const snapshot = await db.collection('visas').orderBy('createdAt', 'desc').get();
        const visas = [];
        snapshot.forEach(doc => {
            visas.push({ id: doc.id, ...doc.data() });
        });
        
        updateVisasSection(visas);
        
    } catch (error) {
        console.error('Error loading visas:', error);
    }
}

// Update visas section
function updateVisasSection(visas) {
    const container = document.querySelector('.gallery-carousel');
    if (!container) return;
    
    container.innerHTML = '';
    
    visas.forEach(visa => {
        const card = `
            <div class="gallery-item bg-white text-center border p-4 rounded mx-2">
                <img class="img-fluid rounded" src="${visa.imageUrl}" alt="${visa.title}" style="width: 100%; height: 200px; object-fit: cover;">
                <div class="mt-2">
                    <small class="text-muted">${visa.title}</small>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
    
    // Remove owl carousel initialization for horizontal layout
    // Visa images will now display horizontally with CSS flexbox
}

// Enhanced package modal function
async function openPackageModal(packageId) {
    try {
        const doc = await db.collection('packages').doc(packageId).get();
        if (!doc.exists) {
            console.error('Package not found');
            return;
        }
        
        const package = { id: doc.id, ...doc.data() };
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('packageModal');
        if (!modal) {
            modal = createPackageModal();
        }
        
        // Update modal content
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        modalTitle.textContent = package.title;
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${package.imageUrl || 'img/package-1.jpg'}" class="img-fluid rounded" alt="${package.title}">
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary mb-3">Détails du Pack</h6>
                    <p><strong>Destination:</strong> ${package.destination}</p>
                    ${package.duration ? `<p><strong>Durée:</strong> ${package.duration}</p>` : ''}
                    ${package.requirements ? `<p><strong>Niveau requis:</strong> ${package.requirements}</p>` : ''}
                    <div class="mt-3">
                        <h6 class="text-primary">Description:</h6>
                        <p>${package.description}</p>
                        ${package.details ? `
                            <h6 class="text-primary">Détails du programme:</h6>
                            <div style="white-space: pre-line;">${package.details}</div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        new bootstrap.Modal(modal).show();
        
    } catch (error) {
        console.error('Error loading package details:', error);
    }
}

// Create package modal dynamically
function createPackageModal() {
    const modalHTML = `
        <div class="modal fade" id="packageModal" tabindex="-1" aria-labelledby="packageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="packageModalLabel">Détails du Package</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Content will be loaded here -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-primary" onclick="redirectToContactFromModal()">Réserver ce Pack</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('packageModal');
}

// Redirect to contact form with package title
function redirectToContact(packageTitle) {
    localStorage.setItem('selectedPackage', packageTitle);
    window.location.hash = 'contact-form';
    setTimeout(function() {
        var msg = document.getElementById('message');
        if (msg) msg.value = `Je suis intéressé par le package: ${packageTitle}`;
    }, 300);
}

// Redirect from modal
function redirectToContactFromModal() {
    const modal = document.getElementById('packageModal');
    const title = modal.querySelector('.modal-title').textContent;
    bootstrap.Modal.getInstance(modal).hide();
    redirectToContact(title);
}

// Initialize Firebase integration
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    loadPackagesFromFirebase();
    loadVisasFromFirebase();
    
    // Pre-fill contact form if package was selected
    const selectedPackage = localStorage.getItem('selectedPackage');
    if (selectedPackage) {
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `Je suis intéressé par le package: ${selectedPackage}`;
            localStorage.removeItem('selectedPackage');
        }
    }
}); 