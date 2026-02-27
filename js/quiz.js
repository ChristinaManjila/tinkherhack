let activePetId = null;

function navigate(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const target = document.getElementById('view-' + viewId);
    if (target) target.style.display = 'block';
    
    if (viewId === 'home') renderCards(getPets(), 'home-pets-container');
    if (viewId === 'favs') renderFavorites();

    if (viewId === 'pets') {
        // RESET FILTERS: This ensures the user starts with a clean slate
        const searchInput = document.getElementById('pet-search');
        const speciesFilter = document.getElementById('species-filter');
        if(searchInput) searchInput.value = '';
        if(speciesFilter) speciesFilter.value = 'All';
        
        renderCards(getPets(), 'pets-container');
    }
}

function submitQuiz(event) {
    event.preventDefault();
    const answers = {
        size: document.getElementById('q-size').value,
        yard: document.getElementById('q-yard').value === 'true',
        activity: document.getElementById('q-activity').value,
        allergies: document.getElementById('q-allergies').value === 'true'
    };
    const matches = getPets().map(pet => {
        let score = 0;
        if (pet.size === answers.size) score++;
        if (pet.requiresYard === answers.yard) score++;
        if (pet.activity === answers.activity) score++;
        if (!answers.allergies || pet.hypoallergenic) score++;
        return { ...pet, score: Math.round((score/4)*100) };
    }).filter(p => p.score >= 50).sort((a,b) => b.score - a.score);

    renderCards(matches, 'match-container');
    navigate('match');
}

function renderCards(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Safety check
    const favs = JSON.parse(localStorage.getItem('user_favorites')) || [];
    
    container.innerHTML = list.map(pet => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 position-relative">
                <button class="btn position-absolute top-0 end-0 m-2 border-0 bg-white shadow-sm" style="border-radius:50%; z-index: 5;" onclick="toggleFavorite(event, ${pet.id})">
                    <i class="bi ${favs.includes(pet.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                </button>
                <div onclick="showPetDetails(${pet.id})" style="cursor:pointer">
                    <div class="pet-card-img">
                        <img src="${pet.image}" onerror="this.src='https://placehold.co/400x300?text=🐾'">
                        <span class="position-absolute bottom-0 start-0 m-2 badge bg-dark opacity-75">${pet.cost || 'Contact'}</span>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold mb-0">${pet.name}</h5>
                            ${pet.score ? `<span class="badge bg-success">${pet.score}%</span>` : ''}
                        </div>
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
                    <h3 class="fw-bold mb-0">${pet.name} (${pet.age})</h3>
                    <span class="badge bg-success fs-6">${pet.cost}</span>
                </div>
                <p class="text-secondary small mb-3">${pet.description}</p>
                <div class="row g-2 small mb-4 bg-light p-3 rounded">
                    <div class="col-6"><strong>📍 Location:</strong><br>${pet.location}</div>
                    <div class="col-6"><strong>🍽️ Diet:</strong><br>${pet.food || 'Pet Food'}</div>
                    <div class="col-6"><strong>👤 Owner:</strong><br>${pet.owner}</div>
                    <div class="col-6"><strong>📞 Contact:</strong><br>${pet.contact}</div>
                </div>
                <button class="btn btn-primary w-100 mb-2 py-2 fw-bold" onclick="openChat()">Message Owner</button>
                <button class="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
        <div id="chat-view" style="display:none;" class="p-4">
            <div class="d-flex align-items-center mb-3">
                <button class="btn btn-sm btn-light me-2" onclick="backToProfile()"><i class="bi bi-arrow-left"></i></button>
                <h6 class="mb-0">Chat with ${pet.owner}</h6>
            </div>
            <div id="chat-box" class="mb-3 p-2 border rounded" style="height: 250px; overflow-y: auto; background: #f8f9fa;"></div>
            <div class="input-group">
                <input type="text" id="chat-input" class="form-control" placeholder="Ask about ${pet.name}...">
                <button class="btn btn-primary" onclick="handleSend()"><i class="bi bi-send"></i></button>
            </div>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('petModal')).show();
}

function filterPets() {
    const searchTerm = document.getElementById('pet-search').value.toLowerCase();
    const speciesTerm = document.getElementById('species-filter').value;
    const allPets = getPets();

    const filtered = allPets.filter(pet => {
        const matchesSearch = 
            pet.name.toLowerCase().includes(searchTerm) || 
            pet.breed.toLowerCase().includes(searchTerm) || 
            pet.location.toLowerCase().includes(searchTerm);

        let matchesSpecies = true;
        if (speciesTerm === "Other") {
            matchesSpecies = !["Dog", "Cat", "Rabbit"].includes(pet.species);
        } else if (speciesTerm !== "All") {
            matchesSpecies = pet.species === speciesTerm;
        }

        return matchesSearch && matchesSpecies;
    });

    renderCards(filtered, 'pets-container');
}

// Helper functions for Favorites & Chat
function toggleFavorite(e, id) {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('user_favorites')) || [];
    favs = favs.includes(id) ? favs.filter(i => i !== id) : [...favs, id];
    localStorage.setItem('user_favorites', JSON.stringify(favs));
    // Determine current view and refresh
    const currentView = document.querySelector('.view[style*="block"]').id.split('-')[1];
    navigate(currentView);
}

function renderFavorites() {
    const favs = JSON.parse(localStorage.getItem('user_favorites')) || [];
    const list = getPets().filter(p => favs.includes(p.id));
    const clearBtn = document.getElementById('clear-favs-btn');
    if(clearBtn) clearBtn.style.display = list.length ? 'block' : 'none';
    
    const container = document.getElementById('favs-container');
    if (!list.length) container.innerHTML = '<p class="text-center py-5">No favorites yet!</p>';
    else renderCards(list, 'favs-container');
}

function clearAllFavorites() {
    if (confirm("Clear all favorites?")) { 
        localStorage.removeItem('user_favorites'); 
        renderFavorites(); 
    }
}

function openChat() {
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('chat-view').style.display = 'block';
    renderMessages();
}

function backToProfile() {
    document.getElementById('chat-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'block';
}

function handleSend() {
    const input = document.getElementById('chat-input');
    if (!input.value.trim()) return;
    const key = `chat_${activePetId}`;
    const msgs = JSON.parse(localStorage.getItem(key)) || [];
    msgs.push({ sender: 'user', text: input.value, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) });
    localStorage.setItem(key, JSON.stringify(msgs));
    input.value = '';
    renderMessages();
}

function renderMessages() {
    const box = document.getElementById('chat-box');
    const msgs = JSON.parse(localStorage.getItem(`chat_${activePetId}`)) || [];
    box.innerHTML = msgs.map(m => `
        <div class="mb-2 ${m.sender === 'user' ? 'text-end' : 'text-start'}">
            <div class="p-2 rounded d-inline-block ${m.sender === 'user' ? 'bg-primary text-white' : 'bg-white border'} shadow-sm" style="max-width:80%">${m.text}</div>
        </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => navigate('home'));