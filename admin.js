let fishData = [];

// Load Fish Data
async function loadFishData() {
    try {
        const response = await fetch('fish-data.json');
        const data = await response.json();
        fishData = data.fishList;
        renderFishManagement();
    } catch (error) {
        console.error('Error loading fish data:', error);
        alert('Error loading fish data. Please refresh the page.');
    }
}

// Render Fish Management Cards
function renderFishManagement() {
    const container = document.getElementById('fishManagement');
    if (!container) return;

    container.innerHTML = fishData.map(fish => `
        <div class="fish-management-card" id="fish-${fish.id}">
            <div class="management-header">
                <h3 class="management-title">
                    ${fish.nameTamil} | ${fish.nameEnglish}
                </h3>
                <div class="management-actions">
                    <button class="btn btn-danger" onclick="deleteFish(${fish.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label>Tamil Name</label>
                    <input type="text" 
                           class="form-input" 
                           value="${fish.nameTamil}"
                           onchange="updateFish(${fish.id}, 'nameTamil', this.value)">
                </div>

                <div class="form-group">
                    <label>English Name</label>
                    <input type="text" 
                           class="form-input" 
                           value="${fish.nameEnglish}"
                           onchange="updateFish(${fish.id}, 'nameEnglish', this.value)">
                </div>

                <div class="form-group">
                    <label>Price (Rs/Kg)</label>
                    <input type="number" 
                           class="form-input" 
                           value="${fish.price}"
                           onchange="updateFish(${fish.id}, 'price', parseFloat(this.value))">
                </div>

                <div class="form-group">
                    <label>Category</label>
                    <select class="form-select" 
                            onchange="updateFish(${fish.id}, 'category', this.value)">
                        <option value="regular" ${fish.category === 'regular' ? 'selected' : ''}>Regular</option>
                        <option value="premium" ${fish.category === 'premium' ? 'selected' : ''}>Premium</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Availability</label>
                    <select class="form-select" 
                            onchange="updateFish(${fish.id}, 'available', this.value === 'true')">
                        <option value="true" ${fish.available ? 'selected' : ''}>Available</option>
                        <option value="false" ${!fish.available ? 'selected' : ''}>Out of Stock</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Stock Level</label>
                    <select class="form-select" 
                            onchange="updateFish(${fish.id}, 'stock', this.value)">
                        <option value="High" ${fish.stock === 'High' ? 'selected' : ''}>High</option>
                        <option value="Medium" ${fish.stock === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="Low" ${fish.stock === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Out of Stock" ${fish.stock === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" 
                           class="form-input" 
                           value="${fish.image}"
                           onchange="updateFish(${fish.id}, 'image', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

// Update Fish Data
function updateFish(id, field, value) {
    const fishIndex = fishData.findIndex(f => f.id === id);
    if (fishIndex > -1) {
        fishData[fishIndex][field] = value;
        showNotification('✓ Updated! Click "Save All Changes" to apply.');
    }
}

// Delete Fish
function deleteFish(id) {
    if (confirm('Are you sure you want to delete this fish?')) {
        fishData = fishData.filter(f => f.id !== id);
        renderFishManagement();
        showNotification('✓ Fish deleted! Click "Save All Changes" to apply.');
    }
}

// Save All Changes
function saveAllFish() {
    const updatedData = {
        lastUpdated: new Date().toISOString().split('T')[0],
        fishList: fishData
    };

    const dataStr = JSON.stringify(updatedData, null, 2);
    
    // Download as JSON file
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fish-data.json';
    a.click();
    
    showNotification('✓ Data saved! Upload fish-data.json to your website.');
}

// Export Fish List
function exportFishList() {
    const dataStr = JSON.stringify(fishData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fish-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showNotification('✓ Fish list exported!');
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadFishData);
