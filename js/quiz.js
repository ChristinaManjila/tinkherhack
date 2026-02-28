let activePetId = null;
let uploadedImageBase64 = "";
let isEditing = false; // Track if we are editing an existing pet

/** 1. DATA MANAGEMENT **/
function getPets() {
    const userPosted = JSON.parse(localStorage.getItem('user_posted_pets')) || [];
    return [...pets, ...userPosted];
}

/** 2. NAVIGATION **/
function navigate(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const target = document.getElementById('view-' + viewId);
    if (target) target.style.display = 'block';

    if (viewId === 'home') renderCards(getPets(), 'home-pets-container');
    if (viewId === 'favs') renderFavorites();
    if (viewId === 'pets') renderCards(getPets(), 'pets-container');

    // Reset Form if just navigating to add-pet (and not via Edit button)
    if (viewId === 'add-pet' && !isEditing) {
        document.querySelector('#view-add-pet form').reset();
        resetUpload();
    }
}

/** 3. IMAGE HANDLING **/
function previewImage(event) {
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImageBase64 = e.target.result;
            document.getElementById('image-preview').src = uploadedImageBase64;
            document.getElementById('image-preview-container').classList.remove('d-none');
            document.getElementById('drop-zone').classList.add('d-none');
        }
        reader.readAsDataURL(file);
    }
}

function resetUpload() {
    uploadedImageBase64 = "";
    const input = document.getElementById('new-image-file');
    if (input) input.value = "";
    document.getElementById('image-preview-container').classList.add('d-none');
    document.getElementById('drop-zone').classList.remove('d-none');
}

/** 4. CREATE & UPDATE (EDIT) LOGIC **/
function handlePetUpload(event) {
    event.preventDefault();

    if (!uploadedImageBase64) {
        alert("Please upload a photo!");
        return;
    }

    // Fix the Price formatting
    let priceValue = document.getElementById('new-cost-input').value;
    if (!priceValue.includes('₹') && !isNaN(priceValue.replace(/\D/g, ''))) {
        priceValue = "₹" + priceValue;
    }
    const currentUser = JSON.parse(localStorage.getItem('petmatch_user'));

const petData = {
    id: isEditing ? activePetId : Date.now(),
    isUserGenerated: true,
    name: document.getElementById('new-name').value,
    species: document.getElementById('new-species').value,
    breed: document.getElementById('new-breed').value,
    location: document.getElementById('new-location').value,
    description: document.getElementById('new-description').value,
    image: uploadedImageBase64,
    cost: priceValue,

    age: document.getElementById('new-age')?.value || "1 Year",
    food: document.getElementById('new-food')?.value || "Mixed Diet",

    owner: currentUser?.name || "You (Verified)",
    phone: currentUser?.phone || "919000000000",

    size: "Medium",
    activity: "Medium",
    requiresYard: false
};

    let userPets = JSON.parse(localStorage.getItem('user_posted_pets')) || [];

    if (isEditing) {
        // Update existing
        const index = userPets.findIndex(p => p.id === activePetId);
        userPets[index] = petData;
        isEditing = false;
    } else {
        // Add new
        userPets.push(petData);
    }

    localStorage.setItem('user_posted_pets', JSON.stringify(userPets));
    alert("Listing saved!");
    event.target.reset();
    resetUpload();
    navigate('pets');
}

/** 5. EDIT & REMOVE BUTTONS **/
function startEdit(petId) {
    const pet = getPets().find(p => p.id === petId);
    if (!pet) return;

    isEditing = true;
    activePetId = petId;

    // Fill the form
    document.getElementById('new-name').value = pet.name;
    document.getElementById('new-species').value = pet.species;
    document.getElementById('new-breed').value = pet.breed;
    document.getElementById('new-cost-input').value = pet.cost;
    document.getElementById('new-location').value = pet.location;
    document.getElementById('new-description').value = pet.description;

    // Set image preview
    uploadedImageBase64 = pet.image;
    document.getElementById('image-preview').src = pet.image;
    document.getElementById('image-preview-container').classList.remove('d-none');
    document.getElementById('drop-zone').classList.add('d-none');

    // Close Modal and Navigate
    bootstrap.Modal.getInstance(document.getElementById('petModal')).hide();
    navigate('add-pet');
}

function removeListing(petId) {
    if (confirm("Remove this pet from sale?")) {
        let userPets = JSON.parse(localStorage.getItem('user_posted_pets')) || [];
        userPets = userPets.filter(p => p.id !== petId);
        localStorage.setItem('user_posted_pets', JSON.stringify(userPets));
        bootstrap.Modal.getInstance(document.getElementById('petModal')).hide();
        navigate('pets');
    }
}

/** 6. UI RENDERING **/
function renderCards(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const favs = JSON.parse(localStorage.getItem('user_favorites')) || [];

    container.innerHTML = list.map(pet => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 position-relative">
                <button class="btn position-absolute top-0 end-0 m-2 border-0 bg-white shadow-sm" style="border-radius:50%; z-index: 5;" onclick="toggleFavorite(event, ${pet.id})">
                    <i class="bi ${favs.includes(pet.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                </button>
                <div onclick="showPetDetails(${pet.id})" style="cursor:pointer">
                    <div class="pet-card-img">
                        <img src="${pet.image}">
                        <span class="position-absolute bottom-0 start-0 m-2 badge bg-dark opacity-75">${pet.cost}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="fw-bold mb-1">${pet.name}</h5>
                        <p class="text-muted small mb-0">${pet.breed} • ${pet.location}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showPetDetails(petId) {
    activePetId = petId;
    const pet = getPets().find(p => p.id === petId);
    const modalBody = document.getElementById('modal-content-body');

    // fallback phone if missing
    const phone = pet.phone || "919000000000";

    const whatsappLink =
        `https://wa.me/${phone}?text=${encodeURIComponent(
            `Hi ${pet.owner}, I'm interested in ${pet.name} listed on PetMatch 🐾`
        )}`;

    const callLink = `tel:${phone}`;

    modalBody.innerHTML = `
<div id="profile-view">
    <img src="${pet.image}" class="img-fluid w-100" style="height:250px; object-fit:cover;">

    <div class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="fw-bold mb-0">${pet.name}</h3>
            <span class="badge bg-success fs-6">${pet.cost}</span>
        </div>

        <p class="text-secondary small mb-3">${pet.description}</p>

        <!-- ✅ PET DETAILS -->
        <div class="row g-2 small mb-4 bg-light p-3 rounded">
            <div class="col-6">📍 Location: ${pet.location}</div>
            <div class="col-6">👤 Owner: ${pet.owner}</div>
            <div class="col-6">🐕 Breed: ${pet.breed || "Not specified"}</div>
            <div class="col-6">🎂 Age: ${pet.age || "Not specified"}</div>
            <div class="col-12">🍗 Preferred Food: ${pet.food || "Not specified"}</div>
        </div>

        <!-- ✅ WHATSAPP -->
        <a href="https://wa.me/${pet.phone || "919000000000"}?text=${encodeURIComponent(
            `Hi ${pet.owner}, I'm interested in ${pet.name} listed on PetMatch 🐾`
        )}"
        target="_blank"
        class="btn btn-success w-100 mb-2 fw-bold">
        💬 Message on WhatsApp
        </a>

        <!-- ✅ CALL -->
        <a href="tel:${pet.phone || "919000000000"}"
        class="btn btn-outline-primary w-100 mb-2 fw-bold">
        📞 Call Owner
        </a>

        ${pet.isUserGenerated ? `
            <div class="d-flex gap-2">
                <button class="btn btn-outline-dark w-50" onclick="startEdit(${pet.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-outline-danger w-50" onclick="removeListing(${pet.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        ` : ''}

        <button class="btn btn-light w-100 mt-2" data-bs-dismiss="modal">
            Close
        </button>
    </div>
</div>
`;

    new bootstrap.Modal(document.getElementById('petModal')).show();
}

/** 7. OTHER CORE FUNCTIONS **/
function filterPets() {
    const searchTerm = document.getElementById('pet-search').value.toLowerCase();
    const speciesTerm = document.getElementById('species-filter').value;
    const filtered = getPets().filter(pet => {
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm) || pet.location.toLowerCase().includes(searchTerm);
        const matchesSpecies = (speciesTerm === "All") || (pet.species === speciesTerm);
        return matchesSearch && matchesSpecies;
    });
    renderCards(filtered, 'pets-container');
}

function submitQuiz(event) {
    event.preventDefault();
    const size = document.getElementById('q-size').value;
    const matches = getPets().filter(p => p.size === size);
    renderCards(matches, 'match-container');
    navigate('match');
}

function toggleFavorite(e, id) {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('user_favorites')) || [];
    favs = favs.includes(id) ? favs.filter(i => i !== id) : [...favs, id];
    localStorage.setItem('user_favorites', JSON.stringify(favs));
    renderFavorites();
}

function renderFavorites() {
    const favs = JSON.parse(localStorage.getItem('user_favorites')) || [];
    const list = getPets().filter(p => favs.includes(p.id));
    const container = document.getElementById('favs-container');
    if (container) {
        container.innerHTML = list.length ? '' : '<p class="text-center py-5">No favorites yet.</p>';
        if (list.length) renderCards(list, 'favs-container');
    }
}

function openChat() { document.getElementById('profile-view').style.display = 'none'; document.getElementById('chat-view').style.display = 'block'; }
function backToProfile() { document.getElementById('chat-view').style.display = 'none'; document.getElementById('profile-view').style.display = 'block'; }
function handleSend() {
    const input = document.getElementById('chat-input');
    if (!input.value.trim()) return;
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="text-end mb-2"><span class="bg-primary text-white p-2 rounded d-inline-block">${input.value}</span></div>`;
    input.value = "";
    box.scrollTop = box.scrollHeight;
}

/** 8. INITIALIZATION **/
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    navigate('home');

    const dz = document.getElementById('drop-zone');
    if (dz) {
        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.background = "#e2e8f0"; });
        dz.addEventListener('dragleave', () => { dz.style.background = "#f8fafc"; });
        dz.addEventListener('drop', (e) => { e.preventDefault(); dz.style.background = "#f8fafc"; previewImage(e); });
    }
});


function handleAuth(event, type) {
    event.preventDefault();

    // For demo purposes, we'll just save a "user" object in localStorage
    const user = {
        name: type === 'signup' ? event.target.querySelector('input[type="text"]').value : "User",
        email: event.target.querySelector('input[type="email"]').value,
        isLoggedIn: true
    };

    localStorage.setItem('petmatch_user', JSON.stringify(user));

    // Close modal
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    authModal.hide();

    updateAuthUI();
    alert(type === 'login' ? "Welcome back!" : "Account created successfully!");
}

function logout() {
    localStorage.removeItem('petmatch_user');
    updateAuthUI();
    navigate('home');
}

function updateAuthUI() {
    const authControls = document.getElementById('auth-controls');
    const user = JSON.parse(localStorage.getItem('petmatch_user'));

    if (user && user.isLoggedIn) {
        authControls.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-light btn-sm dropdown-toggle shadow-sm" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle text-primary"></i> ${user.name}
                </button>
                <ul class="dropdown-menu shadow border-0">
                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                </ul>
            </div>
        `;
    } else {
        authControls.innerHTML = `
            <button class="btn btn-outline-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#authModal">Login</button>
        `;
    }
}