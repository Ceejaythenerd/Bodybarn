// Product Catalog
const products = [
    {
        id: 1,
        name: 'Vannir-rave Cream',
        price: 110.00,
        category: 'Body Creams',
        image: 'assets/products/vannir-rave.jpg',
        badge: null,
        dateAdded: '2023-01-01'
    },
    {
        id: 2,
        name: 'Demond Deckharette',
        price: 250.00,
        category: 'Body Creams',
        image: 'assets/products/demond-deckharette.jpg',
        badge: null,
        dateAdded: '2023-02-15'
    },
    {
        id: 3,
        name: 'Boregenoa xxt',
        price: 180.00,
        category: 'Oils & Serums',
        image: 'assets/products/boregenoa-xxt.jpg',
        badge: null,
        dateAdded: '2023-03-10'
    },
    {
        id: 4,
        name: 'Natural Poupes Cream',
        price: 220.00,
        category: 'Body Creams',
        image: 'assets/products/natural-poupes.jpg',
        badge: null,
        dateAdded: '2023-04-05'
    },
    {
        id: 5,
        name: 'Botanical Body Oil',
        price: 195.00,
        category: 'Oils & Serums',
        image: 'assets/products/botanical-body.jpg',
        badge: 'Best Seller',
        dateAdded: '2023-05-20'
    },
    {
        id: 6,
        name: 'Amber Face Elixir',
        price: 280.00,
        category: 'Oils & Serums',
        image: 'assets/products/amber-face.jpg',
        badge: null,
        dateAdded: '2023-06-12'
    },
    {
        id: 7,
        name: 'Charcoal Detox Soap',
        price: 85.00,
        category: 'Soaps & Scrubs',
        image: 'assets/products/charcoal-detox.jpg',
        badge: 'New',
        dateAdded: '2023-07-01'
    },
    {
        id: 8,
        name: 'Himalayan Salt Scrub',
        price: 150.00,
        category: 'Soaps & Scrubs',
        image: 'assets/products/himalayan-salt.jpg',
        badge: null,
        dateAdded: '2023-06-25'
    }
];

// State Management
let selectedCategories = ['All Products'];
let currentSort = 'Recommended';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterContainer = document.getElementById('active-filters');
const categoryCheckboxes = document.querySelectorAll('.category-filter');
const sortDropdown = document.getElementById('sort-dropdown');
const searchInput = document.getElementById('product-search');

// Initialize Shop
document.addEventListener('DOMContentLoaded', () => {
    if (productGrid) {
        bindEventListeners();
        renderShop();
    }
});

function bindEventListeners() {
    // Category Filtering
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const value = e.target.value;

            if (value === 'All Products') {
                // If "All Products" is checked, uncheck everything else
                if (e.target.checked) {
                    selectedCategories = ['All Products'];
                    categoryCheckboxes.forEach(cb => {
                        if (cb.value !== 'All Products') cb.checked = false;
                    });
                } else {
                    // Prevent unchecking "All Products" if it's the only one left
                    if (selectedCategories.length === 1 && selectedCategories[0] === 'All Products') {
                        e.target.checked = true;
                    }
                }
            } else {
                // If a specific category is checked, uncheck "All Products"
                if (e.target.checked) {
                    selectedCategories = selectedCategories.filter(c => c !== 'All Products');
                    selectedCategories.push(value);
                    document.querySelector('.category-filter[value="All Products"]').checked = false;
                } else {
                    selectedCategories = selectedCategories.filter(c => c !== value);
                    // If no categories are left, default back to "All Products"
                    if (selectedCategories.length === 0) {
                        selectedCategories = ['All Products'];
                        document.querySelector('.category-filter[value="All Products"]').checked = true;
                    }
                }
            }
            renderShop();
        });
    });

    // Sorting
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderShop();
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderShop();
        });
    }
}

function renderShop() {
    // 1. Filter Products
    let filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.includes('All Products') ? true : selectedCategories.includes(product.category);
        const matchesSearch = searchQuery === '' ? true : product.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // 2. Sort Products
    filteredProducts = sortProducts(filteredProducts, currentSort);

    // 3. Render Grid
    renderProductGrid(filteredProducts);

    // 4. Render Active Filter Pills
    renderActiveFilters();
}

function sortProducts(productArray, sortValue) {
    const arr = [...productArray];
    switch (sortValue) {
        case 'Price: Low to High':
            return arr.sort((a, b) => a.price - b.price);
        case 'Price: High to Low':
            return arr.sort((a, b) => b.price - a.price);
        case 'Newest Arrivals':
            return arr.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        case 'Recommended':
        default:
            return arr; // Keep original array order as "Recommended"
    }
}

function renderProductGrid(productsToRender) {
    if (productsToRender.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full py-20 text-center">
                <p class="text-[#342525]/60 text-lg">No products found matching your active filters.</p>
                <button onclick="resetFilters()" class="mt-4 text-[#89A37B] underline font-medium">Clear filters</button>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card bg-white rounded-xl overflow-hidden group">
            <div class="aspect-[4/5] overflow-hidden relative bg-gray-100">
                <img src="${product.image}"
                    alt="${product.name}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                
                ${product.badge ? `
                <div class="absolute top-4 left-4 bg-[#342525] text-white text-xs px-2 py-1 rounded tracking-widest uppercase shadow-md font-medium">
                    ${product.badge}
                </div>` : ''}

                <button
                    onclick="addToCart('${product.name}', ${product.price}, '${product.image}')"
                    class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur py-3 rounded text-sm font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg text-[#342525]">
                    Add to Cart - R ${product.price.toFixed(2)}
                </button>
            </div>
            <div class="p-6 text-center">
                <h3 class="text-xl font-medium text-[#342525] brand-font">${product.name}</h3>
                <p class="text-sm text-[#342525]/70 mt-2 font-medium">R ${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function renderActiveFilters() {
    if (!filterContainer) return;

    filterContainer.innerHTML = selectedCategories.map(category => `
        <span class="bg-white border border-[#342525]/20 text-xs px-3 py-1.5 rounded-full text-[#342525] flex items-center gap-2 shadow-sm">
            ${category}
            ${category !== 'All Products' ? `
            <button onclick="removeFilter('${category}')" class="hover:text-red-500 transition-colors" aria-label="Remove filter">
                <svg width="12" height="12" fill="none" class="opacity-60 hover:opacity-100 block" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>` : ''}
        </span>
    `).join('');
}

function removeFilter(categoryToRemove) {
    const checkbox = document.querySelector(`.category-filter[value="${categoryToRemove}"]`);
    if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
    }
}

// Global scope helpers
window.resetFilters = function () {
    selectedCategories = ['All Products'];
    categoryCheckboxes.forEach(cb => {
        cb.checked = (cb.value === 'All Products');
    });
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    renderShop();
};
