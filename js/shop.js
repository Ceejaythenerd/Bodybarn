// Product Catalog
const products = [
    {
        id: 1,
        name: 'Rosemary & Mint Hair Oil',
        size: '50ml',
        price: 115.00,
        category: 'Hair Care',
        image: 'assets/products/Hair Oil.png',
        modalImage: 'assets/products/hair-oil-50ml.png',
        badge: null,
        dateAdded: '2024-03-01',
        description: 'A lightweight hair and body oil made with natural & organic food grade ingredients. Extra Virgin oils infused with fresh herbs and a touch of jojoba oil. Restores hair from root to tip, nourishes the hair follicle, aids healthy hair growth, conditions the scalp and adds shine without build up.'
    },
    {
        id: 2,
        name: 'Rosemary & Mint Hair Oil',
        size: '100ml',
        price: 230.00,
        category: 'Hair Care',
        image: 'assets/products/Hair Oil.png',
        modalImage: 'assets/products/hair-oil-100ml.png',
        badge: 'Best Seller',
        dateAdded: '2024-03-01',
        description: 'A lightweight hair and body oil made with natural & organic food grade ingredients. Extra Virgin oils infused with fresh herbs and a touch of jojoba oil. Restores hair from root to tip, nourishes the hair follicle, aids healthy hair growth, conditions the scalp and adds shine without build up.'
    },
    {
        id: 3,
        name: 'Rosemary & Hibiscus Hair Tonic',
        size: '250ml',
        price: 130.00,
        category: 'Hair Care',
        image: 'assets/products/Hair Tonic.png',
        modalImage: 'assets/products/hair-tonic.png',
        badge: 'New',
        dateAdded: '2024-04-01',
        description: 'An aloe-based hydrating hair tonic enriched with botanical extracts. Stimulates hair growth, prevents itching and dry scalp, strengthens hair from root to tip and softens hair. Made from natural ingredients sourced sustainably within Africa.'
    },
    {
        id: 4,
        name: 'Rosemary & Clove Hair Butter',
        size: null,
        price: 100.00,
        category: 'Hair Care',
        image: 'assets/products/Hair Butter.png',
        modalImage: 'assets/products/hair-butter.png',
        badge: null,
        dateAdded: '2024-01-10',
        description: 'A soft and fluffy hair butter made with natural & organic food grade ingredients. Virgin oils infused with fresh herbs on a base of nutrient-rich shea butter and avocado butter. Nourishes from root to tip, conditions the scalp and contains Fenugreek.'
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

// ── Product Details Modal Logic ──────────────────────────────────────────────

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if container exists, create if not
    let modalContainer = document.getElementById('product-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'product-modal-container';
        document.body.appendChild(modalContainer);
    }

    const fullName = `${product.name}${product.size ? ' ' + product.size : ''}`;

    modalContainer.innerHTML = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-0 transition-opacity duration-300" id="product-modal-backdrop" style="background: rgba(46, 31, 31, 0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" onclick="closeProductModal(event)">
            <div class="bg-[#faf8f5] w-full max-w-4xl max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row transform scale-95 transition-transform duration-300 relative" id="product-modal-content" onclick="event.stopPropagation()">
                
                <!-- Close Button -->
                <button onclick="closeProductModal()" class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur rounded-full text-[#2e1f1f] hover:bg-[#2e1f1f] hover:text-white transition-colors border border-[#2e1f1f]/10" aria-label="Close modal">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
                </button>

                <!-- Image Side -->
                <div class="w-full md:w-1/2 bg-[#ede9e3] relative group">
                    <div class="aspect-square md:aspect-auto md:h-full w-full">
                        <img src="${product.modalImage || product.image}" alt="${fullName}" class="w-full h-full object-cover object-center">
                    </div>
                    ${product.badge ? `
                    <div class="absolute top-4 left-4 bg-[#2e1f1f] text-white text-xs px-3 py-1.5 rounded tracking-widest uppercase shadow-md font-medium">
                        ${product.badge}
                    </div>` : ''}
                </div>

                <!-- Content Side -->
                <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#faf8f5]">
                    <span class="text-sm tracking-widest uppercase text-[#7a9470] font-semibold mb-2 block">${product.category}</span>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2e1f1f] brand-font mb-2 leading-tight">${product.name}</h2>
                    
                    <div class="flex items-center gap-4 mb-6">
                        <span class="text-xl font-medium text-[#2e1f1f]">R ${product.price.toFixed(2)}</span>
                        ${product.size ? `<span class="px-3 py-1 bg-[#2e1f1f]/5 rounded-full text-sm font-semibold text-[#2e1f1f]/80">${product.size}</span>` : ''}
                    </div>
                    
                    <div class="h-px w-full bg-[#2e1f1f]/10 mb-6"></div>
                    
                    <div class="prose prose-sm text-[#2e1f1f]/80 mb-8 leading-relaxed">
                        <p>${product.description.replace(/\n/g, '<br>')}</p>
                        ${product.name.includes('Hair') ? `
                        <ul class="mt-4 space-y-2">
                            <li class="flex items-start gap-2"><span class="text-[#7a9470]">✓</span> 100% natural and organic ingredients</li>
                            <li class="flex items-start gap-2"><span class="text-[#7a9470]">✓</span> Ethically sourced within Africa</li>
                            <li class="flex items-start gap-2"><span class="text-[#7a9470]">✓</span> Nourishes and restores from root to tip</li>
                        </ul>
                        ` : ''}
                    </div>
                    
                    <button onclick="addToCart('${fullName}', ${product.price}, '${product.image}'); closeProductModal();" class="w-full bg-[#2e1f1f] text-white py-4 rounded-lg font-semibold tracking-widest uppercase text-sm hover:bg-[#433030] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                        Add to Cart &mdash; R ${product.price.toFixed(2)}
                    </button>
                    
                    <p class="text-center text-xs text-[#2e1f1f]/50 mt-4">Secure checkout &amp; fast shipping in SA.</p>
                </div>
            </div>
        </div>
    `;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        const backdrop = document.getElementById('product-modal-backdrop');
        const content = document.getElementById('product-modal-content');
        if (backdrop && content) {
            backdrop.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }
    });

    // Handle escape key
    document.addEventListener('keydown', handleEscKey);
}

function closeProductModal(event) {
    // If event is passed, only close if we clicked the backdrop
    if (event && event.target !== document.getElementById('product-modal-backdrop') && !event.currentTarget.classList?.contains('z-[100]')) {
         return;
    }

    const backdrop = document.getElementById('product-modal-backdrop');
    const content = document.getElementById('product-modal-content');
    
    if (backdrop && content) {
        backdrop.style.opacity = '0';
        content.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            const container = document.getElementById('product-modal-container');
            if (container) container.innerHTML = '';
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscKey);
        }, 300); // Wait for transition
    }
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
}

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
                <p class="text-[#2e1f1f]/60 text-lg">No products found matching your active filters.</p>
                <button onclick="resetFilters()" class="mt-4 text-[#7a9470] underline font-medium">Clear filters</button>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card bg-[#faf8f5] rounded-xl overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg transition-all" onclick="openProductModal(${product.id})">
            <div class="aspect-[4/5] overflow-hidden relative bg-[#ede9e3]">
                <img src="${product.image}"
                    alt="${product.name}${product.size ? ' ' + product.size : ''}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" decoding="async">

                ${product.badge ? `
                <div class="absolute top-4 left-4 bg-[#2e1f1f] text-white text-xs px-2.5 py-1 rounded tracking-widest uppercase shadow-md font-medium">
                    ${product.badge}
                </div>` : ''}

                ${product.size ? `
                <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-[#2e1f1f] text-xs px-2.5 py-1 rounded-full font-semibold shadow">
                    ${product.size}
                </div>` : ''}

                <button
                    onclick="event.stopPropagation(); addToCart('${product.name}${product.size ? ' ' + product.size : ''}', ${product.price}, '${product.image}')"
                    class="absolute bottom-4 left-4 right-4 bg-[#faf8f5]/95 backdrop-blur py-3 rounded text-sm font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg text-[#2e1f1f]">
                    Add to Cart &mdash; R ${product.price.toFixed(2)}
                </button>
            </div>
            <div class="p-4 sm:p-5 flex flex-col flex-grow">
                <div class="flex items-start justify-between gap-2 mb-1">
                    <h3 class="text-base font-semibold text-[#2e1f1f] brand-font leading-tight">${product.name}${product.size ? ` <span class="text-sm font-normal opacity-60">${product.size}</span>` : ''}</h3>
                    <span class="text-base font-semibold text-[#2e1f1f] whitespace-nowrap">R ${product.price.toFixed(2)}</span>
                </div>
                <p class="text-sm text-[#2e1f1f]/70 leading-relaxed line-clamp-3 mt-1 flex-grow">${product.description}</p>
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
