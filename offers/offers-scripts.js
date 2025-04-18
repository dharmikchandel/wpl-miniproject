// Store offers in localStorage
let offers = JSON.parse(localStorage.getItem('sageSeaOffers')) || [];
const offersContainer = document.getElementById('offers-container');
const noOffersMessage = document.getElementById('no-offers-message');
const addOfferBtn = document.getElementById('add-offer-btn');
const addOfferModal = document.getElementById('add-offer-modal');
const closeModalBtn = document.getElementById('close-modal');
const addOfferForm = document.getElementById('add-offer-form');

// Calculate final price based on original price and discount percentage
const originalPriceInput = document.getElementById('original-price');
const discountPercentInput = document.getElementById('discount-percent');
const finalPriceInput = document.getElementById('final-price');

function calculateFinalPrice() {
    const originalPrice = parseFloat(originalPriceInput.value) || 0;
    const discountPercent = parseFloat(discountPercentInput.value) || 0;
    
    if (originalPrice > 0 && discountPercent >= 0 && discountPercent <= 100) {
        const discount = originalPrice * (discountPercent / 100);
        const finalPrice = originalPrice - discount;
        finalPriceInput.value = finalPrice.toFixed(2);
    } else {
        finalPriceInput.value = '';
    }
}

originalPriceInput.addEventListener('input', calculateFinalPrice);
discountPercentInput.addEventListener('input', calculateFinalPrice);

// Display offers function
function displayOffers() {
    // Clear current offers
    const existingOffers = document.querySelectorAll('.offer-card');
    existingOffers.forEach(offer => offer.remove());
    
    // Show/hide no offers message
    if (offers.length === 0) {
        noOffersMessage.style.display = 'block';
    } else {
        noOffersMessage.style.display = 'none';
        
        // Display each offer
        offers.forEach((offer, index) => {
            const offerCard = document.createElement('div');
            offerCard.className = 'offer-card';
            offerCard.innerHTML = `
                <div class="card-image">
                    <img src="${offer.imageUrl}" alt="${offer.title}">
                </div>
                <div class="card-body">
                    <div class="discount-badge">${offer.discountPercent}% OFF</div>
                    <div class="card-title">
                        <span class="dish-name">${offer.title}</span>
                    </div>
                    <p class="card-description">${offer.description}</p>
                    <div class="offer-price">
                        <span class="original-price">$${offer.originalPrice}</span>
                        <span class="discount-price">$${offer.discountPrice}</span>
                    </div>
                    <div class="offer-actions">
                        <button class="delete-btn" data-index="${index}">Remove</button>
                    </div>
                    <div class="accent-pattern"></div>
                </div>
            `;
            offersContainer.appendChild(offerCard);
        });
        
        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteOffer(index);
            });
        });
    }
}

// Add offer function
function addOffer(offerData) {
    offers.push(offerData);
    localStorage.setItem('sageSeaOffers', JSON.stringify(offers));
    displayOffers();
}

// Delete offer function
function deleteOffer(index) {
    if (confirm('Are you sure you want to remove this offer?')) {
        offers.splice(index, 1);
        localStorage.setItem('sageSeaOffers', JSON.stringify(offers));
        displayOffers();
    }
}

// Show modal
addOfferBtn.addEventListener('click', function() {
    addOfferModal.style.display = 'block';
});

// Close modal
closeModalBtn.addEventListener('click', function() {
    addOfferModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === addOfferModal) {
        addOfferModal.style.display = 'none';
    }
});

// Form submission
addOfferForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const originalPrice = parseFloat(document.getElementById('original-price').value);
    const discountPercent = parseFloat(document.getElementById('discount-percent').value);
    const discountPrice = (originalPrice * (1 - discountPercent / 100)).toFixed(2);
    
    const imageInput = document.getElementById('offer-image');
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const offerData = {
                title: document.getElementById('offer-title').value,
                description: document.getElementById('offer-description').value,
                originalPrice: originalPrice.toFixed(2),
                discountPrice: discountPrice,
                discountPercent: discountPercent,
                imageUrl: event.target.result // base64 string
            };

            addOffer(offerData);
            addOfferForm.reset();
            finalPriceInput.value = '';
            addOfferModal.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image for the offer.');
    }
});

// Display offers when page loads
displayOffers();