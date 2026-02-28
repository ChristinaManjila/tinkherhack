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
        reader.onload = function(e) {
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
    if(input) input.value = "";
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
    if (!priceValue.includes('₹') && !isNaN(priceValue.replace(/\D/g,''))) {
        priceValue = "₹" + priceValue;
    }

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
        age: "1 Year",
        owner: "You (Verified)",
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
    
    modalBody.innerHTML = `
        <div id="profile-view">
            <img src="${pet.image}" class="img-fluid w-100" style="height:250px; object-fit:cover;">
            <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h3 class="fw-bold mb-0">${pet.name}</h3>
                    <span class="badge bg-success fs-6">${pet.cost}</span>
                </div>
                <p class="text-secondary small mb-3">${pet.description}</p>
                <div class="row g-2 small mb-4 bg-light p-3 rounded">
                    <div class="col-6">📍 ${pet.location}</div>
                    <div class="col-6">👤 ${pet.owner}</div>
                </div>
                
                <button class="btn btn-primary w-100 mb-2 fw-bold" onclick="openChat()">Message Owner</button>
                
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
                
                <button class="btn btn-light w-100 mt-2" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
        <div id="chat-view" style="display:none;" class="p-4">
            <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-2" onclick="backToProfile()"><i class="bi bi-arrow-left"></i></button>
                <h6>Chatting about ${pet.name}</h6>
            </div>
            <div id="chat-box" class="mb-3 p-2 border rounded" style="height:200px; overflow-y:auto; background:#f8f9fa;"></div>
            <div class="input-group">
                <input type="text" id="chat-input" class="form-control" placeholder="Type a message...">
                <button class="btn btn-primary" onclick="handleSend()"><i class="bi bi-send"></i></button>
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
    navigate('home');
    const dz = document.getElementById('drop-zone');
    if (dz) {
        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.background = "#e2e8f0"; });
        dz.addEventListener('dragleave', () => { dz.style.background = "#f8fafc"; });
        dz.addEventListener('drop', (e) => { e.preventDefault(); dz.style.background = "#f8fafc"; previewImage(e); });
    }
});