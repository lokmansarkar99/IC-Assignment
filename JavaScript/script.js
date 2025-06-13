
// API URLs
const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
const SEARCH_URL = `${API_BASE}/search.php?s=`;
const LOOKUP_URL = `${API_BASE}/lookup.php?i=`;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipesGrid = document.getElementById('recipesGrid');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const recipeModal = document.getElementById('recipeModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// State
let currentRecipes = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDefaultRecipes();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    closeModal.addEventListener('click', closeRecipeModal);
    recipeModal.addEventListener('click', function(e) {
        if (e.target === recipeModal) {
            closeRecipeModal();
        }
    });
}

// Load default recipes
async function loadDefaultRecipes() {
    showLoading();
    try {
        // Load some popular recipes by default
        const defaultSearches = ['chicken', 'beef'];
        const randomSearch = defaultSearches[Math.floor(Math.random() * defaultSearches.length)];
       
        const response = await fetch(`${SEARCH_URL}${randomSearch}`);
        const data = await response.json();
        

        
        if (data.meals) {
            currentRecipes = data.meals.slice(0, 20); // Limit to 20 recipes
            displayRecipes(currentRecipes);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error loading recipes:', error);
        showNoResults();
    }
    hideLoading();
}

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    showLoading();
    try {
        const response = await fetch(`${SEARCH_URL}${query}`);
        const data = await response.json();
        
        if (data.meals) {
            currentRecipes = data.meals;
            displayRecipes(currentRecipes);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error searching recipes:', error);
        showNoResults();
    }
    hideLoading();
}

// Display recipes
function displayRecipes(recipes) {
    recipesGrid.innerHTML = '';
    noResults.classList.add('hidden');
    
    recipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipesGrid.appendChild(recipeCard);
    });
}

// Create recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer';
    
    const description = recipe.strInstructions ? 
        recipe.strInstructions.substring(0, 100) + '...' : 
        'Delicious recipe with amazing flavors and ingredients.';

    card.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-2 text-gray-800">${recipe.strMeal}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${description}</p>
            <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors font-semibold">
                VIEW DETAILS
            </button>
        </div>
    `;

    card.addEventListener('click', () => openRecipeModal(recipe.idMeal));
    return card;
}

// Open recipe modal
async function openRecipeModal(recipeId) {
    try {
        const response = await fetch(`${LOOKUP_URL}${recipeId}`);
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            const recipe = data.meals[0];
            displayRecipeModal(recipe);
            recipeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error loading recipe details:', error);
    }
}

// Display recipe in modal
function displayRecipeModal(recipe) {
    modalTitle.textContent = recipe.strMeal;
    
    // Get ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
        }
    }

    modalContent.innerHTML = `
        <div>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full rounded-lg mb-4">
            <div class="space-y-4">
                <div>
                    <h3 class="font-bold text-lg mb-2">Category</h3>
                    <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">${recipe.strCategory}</span>
                </div>
                ${recipe.strArea ? `
                <div>
                    <h3 class="font-bold text-lg mb-2">Cuisine</h3>
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${recipe.strArea}</span>
                </div>
                ` : ''}
                ${recipe.strYoutube ? `
                <div>
                    <h3 class="font-bold text-lg mb-2">Video Tutorial</h3>
                    <a href="${recipe.strYoutube}" target="_blank" class="text-orange-500 hover:text-orange-600 underline">
                        Watch on YouTube
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
        <div>
            <div class="mb-6">
                <h3 class="font-bold text-lg mb-3">Ingredients</h3>
                <ul class="space-y-2">
                    ${ingredients.map(ingredient => `
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                            ${ingredient}
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h3 class="font-bold text-lg mb-3">Instructions</h3>
                <div class="text-gray-700 leading-relaxed">
                    ${recipe.strInstructions.replace(/\n/g, '<br><br>')}
                </div>
            </div>
        </div>
    `;
}

// Close recipe modal
function closeRecipeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Show loading
function showLoading() {
    loading.classList.add('active');
    noResults.classList.add('hidden');
}

// Hide loading
function hideLoading() {
    loading.classList.remove('active');
}

// Show no results
function showNoResults() {
    recipesGrid.innerHTML = '';
    noResults.classList.remove('hidden');
}
