// Admin Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadPackages();
    loadVisas();
    // Visa title checkbox logic
    var visaHasTitle = document.getElementById('visaHasTitle');
    var visaTitleGroup = document.getElementById('visaTitleGroup');
    if (visaHasTitle && visaTitleGroup) {
        visaHasTitle.addEventListener('change', function() {
            if (visaHasTitle.checked) {
                visaTitleGroup.style.display = '';
            } else {
                visaTitleGroup.style.display = 'none';
                document.getElementById('visaTitle').value = '';
            }
        });
    }
});

// URL validation function
function isValidImageUrl(url) {
    try {
        const urlObj = new URL(url);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext => 
            urlObj.pathname.toLowerCase().includes(ext)
        );
        return hasImageExtension || url.includes('img') || url.includes('image');
    } catch {
        return false;
    }
}

// Authentication check
function checkAuth() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'login.html';
        return;
    }

    auth.onAuthStateChanged(function(user) {
        if (!user) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        } else {
            // Verify admin status
            db.collection('admins').doc(user.uid).get().then((doc) => {
                if (!doc.exists) {
                    localStorage.removeItem('adminToken');
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    });
}

// Navigation functions
function showSection(section) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide sections
    if (section === 'packages') {
        document.getElementById('packagesSection').style.display = 'block';
        document.getElementById('visasSection').style.display = 'none';
    } else if (section === 'visas') {
        document.getElementById('packagesSection').style.display = 'none';
        document.getElementById('visasSection').style.display = 'block';
    }
}

// Package Management Functions
let packages = [];
let visas = [];

async function loadPackages() {
    try {
        const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
        packages = [];
        snapshot.forEach(doc => {
            packages.push({ id: doc.id, ...doc.data() });
        });
        displayPackages();
    } catch (error) {
        console.error('Error loading packages:', error);
        showAlert('Erreur lors du chargement des packages', 'danger');
    }
}

function displayPackages() {
    const container = document.getElementById('packagesContainer');
    container.innerHTML = '';

    packages.forEach(package => {
        const card = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card package-card">
                    <img src="${package.imageUrl || '../img/package-1.jpg'}" class="card-img-top" alt="${package.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${package.title}</h5>
                        <p class="card-text">${package.description}</p>
                        <p class="text-muted"><i class="fas fa-map-marker-alt me-1"></i>${package.destination}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="editPackage('${package.id}')">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePackage('${package.id}')">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function openAddPackageModal() {
    document.getElementById('packageModalTitle').textContent = 'Ajouter un Package';
    document.getElementById('packageForm').reset();
    document.getElementById('packageId').value = '';
    document.getElementById('currentImage').innerHTML = '';
    new bootstrap.Modal(document.getElementById('packageModal')).show();
}

function editPackage(packageId) {
    const package = packages.find(p => p.id === packageId);
    if (!package) return;

    document.getElementById('packageModalTitle').textContent = 'Modifier le Package';
    document.getElementById('packageId').value = package.id;
    document.getElementById('packageTitle').value = package.title;
    document.getElementById('packageDestination').value = package.destination;
    document.getElementById('packageDescription').value = package.description;
    document.getElementById('packageDetails').value = package.details || '';
    document.getElementById('packageDuration').value = package.duration || '';
    document.getElementById('packageRequirements').value = package.requirements || '';
    document.getElementById('packageImage').value = package.imageUrl || '';

    if (package.imageUrl) {
        document.getElementById('currentImage').innerHTML = `
            <img src="${package.imageUrl}" alt="Current image" style="max-width: 100px; height: auto;">
        `;
    }

    new bootstrap.Modal(document.getElementById('packageModal')).show();
}

async function savePackage() {
    const packageId = document.getElementById('packageId').value;
    const title = document.getElementById('packageTitle').value;
    const destination = document.getElementById('packageDestination').value;
    const description = document.getElementById('packageDescription').value;
    const details = document.getElementById('packageDetails').value;
    const duration = document.getElementById('packageDuration').value;
    const requirements = document.getElementById('packageRequirements').value;
    const imageUrl = document.getElementById('packageImage').value;

    if (!title || !destination || !description) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'warning');
        return;
    }

    try {
        // Validate image URL if provided
        if (imageUrl && !isValidImageUrl(imageUrl)) {
            showAlert('Veuillez entrer une URL d\'image valide', 'warning');
            return;
        }

        const packageData = {
            title,
            destination,
            description,
            details,
            duration,
            requirements,
            imageUrl: imageUrl || '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (packageId) {
            // Update existing package
            await db.collection('packages').doc(packageId).update(packageData);
            showAlert('Package mis à jour avec succès', 'success');
        } else {
            // Add new package
            packageData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('packages').add(packageData);
            showAlert('Package ajouté avec succès', 'success');
        }

        bootstrap.Modal.getInstance(document.getElementById('packageModal')).hide();
        loadPackages();
    } catch (error) {
        console.error('Error saving package:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
    }
}

async function deletePackage(packageId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) {
        return;
    }

    try {
        await db.collection('packages').doc(packageId).delete();
        showAlert('Package supprimé avec succès', 'success');
        loadPackages();
    } catch (error) {
        console.error('Error deleting package:', error);
        showAlert('Erreur lors de la suppression', 'danger');
    }
}

// Visa Management Functions
async function loadVisas() {
    try {
        const snapshot = await db.collection('visas').orderBy('createdAt', 'desc').get();
        visas = [];
        snapshot.forEach(doc => {
            visas.push({ id: doc.id, ...doc.data() });
        });
        displayVisas();
    } catch (error) {
        console.error('Error loading visas:', error);
        showAlert('Erreur lors du chargement des visas', 'danger');
    }
}

function displayVisas() {
    const container = document.getElementById('visasContainer');
    container.innerHTML = '';
    visas.forEach(visa => {
        const card = `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card package-card">
                    <img src="${visa.imageUrl}" class="card-img-top" alt="${visa.title || ''}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        ${visa.title ? `<h6 class="card-title">${visa.title}</h6>` : ''}
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="editVisa('${visa.id}')">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteVisa('${visa.id}')">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function openAddVisaModal() {
    document.getElementById('visaModalTitle').textContent = 'Ajouter un Visa';
    document.getElementById('visaForm').reset();
    document.getElementById('visaId').value = '';
    document.getElementById('currentVisaImage').innerHTML = '';
    // Reset checkbox and show title input
    var visaHasTitle = document.getElementById('visaHasTitle');
    var visaTitleGroup = document.getElementById('visaTitleGroup');
    if (visaHasTitle && visaTitleGroup) {
        visaHasTitle.checked = true;
        visaTitleGroup.style.display = '';
    }
    new bootstrap.Modal(document.getElementById('visaModal')).show();
}

function editVisa(visaId) {
    const visa = visas.find(v => v.id === visaId);
    if (!visa) return;
    document.getElementById('visaModalTitle').textContent = 'Modifier le Visa';
    document.getElementById('visaId').value = visa.id;
    document.getElementById('visaTitle').value = visa.title || '';
    document.getElementById('visaImage').value = visa.imageUrl || '';
    // Set checkbox and show/hide title input
    var visaHasTitle = document.getElementById('visaHasTitle');
    var visaTitleGroup = document.getElementById('visaTitleGroup');
    if (visaHasTitle && visaTitleGroup) {
        if (visa.title) {
            visaHasTitle.checked = true;
            visaTitleGroup.style.display = '';
        } else {
            visaHasTitle.checked = false;
            visaTitleGroup.style.display = 'none';
        }
    }
    if (visa.imageUrl) {
        document.getElementById('currentVisaImage').innerHTML = `
            <img src="${visa.imageUrl}" alt="Current image" style="max-width: 100px; height: auto;">
        `;
    }
    new bootstrap.Modal(document.getElementById('visaModal')).show();
}

async function saveVisa() {
    const visaId = document.getElementById('visaId').value;
    const visaHasTitle = document.getElementById('visaHasTitle');
    const title = visaHasTitle && !visaHasTitle.checked ? '' : document.getElementById('visaTitle').value;
    const imageUrl = document.getElementById('visaImage').value;
    if ((visaHasTitle && visaHasTitle.checked && !title) || (!imageUrl && !visaId)) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'warning');
        return;
    }
    try {
        // Validate image URL if provided
        if (imageUrl && !isValidImageUrl(imageUrl)) {
            showAlert('Veuillez entrer une URL d\'image valide', 'warning');
            return;
        }
        const visaData = {
            title,
            imageUrl: imageUrl || '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (visaId) {
            // Update existing visa
            await db.collection('visas').doc(visaId).update(visaData);
            showAlert('Visa mis à jour avec succès', 'success');
        } else {
            // Add new visa
            visaData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('visas').add(visaData);
            showAlert('Visa ajouté avec succès', 'success');
        }
        bootstrap.Modal.getInstance(document.getElementById('visaModal')).hide();
        loadVisas();
    } catch (error) {
        console.error('Error saving visa:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
    }
}

async function deleteVisa(visaId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce visa ?')) {
        return;
    }

    try {
        await db.collection('visas').doc(visaId).delete();
        showAlert('Visa supprimé avec succès', 'success');
        loadVisas();
    } catch (error) {
        console.error('Error deleting visa:', error);
        showAlert('Erreur lors de la suppression', 'danger');
    }
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
} 