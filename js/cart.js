// js/cart.js

// --- State Management ---
let cart = JSON.parse(localStorage.getItem('bodybarn_cart')) || [];
let isCartOpen = false;

// Initialize cart on load
document.addEventListener('DOMContentLoaded', () => {
    // Inject Toast Container if not present
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-24 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(toastContainer);
    }
    updateCartUI();
});

// --- Cart Functions ---
function toggleCart() {
    isCartOpen = !isCartOpen;
    const body = document.body;
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');

    if (isCartOpen) {
        body.classList.replace('drawer-closed', 'drawer-open');
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
        }
    } else {
        body.classList.replace('drawer-open', 'drawer-closed');
        if (overlay) {
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 400);
        }
    }
}

function saveCart() {
    localStorage.setItem('bodybarn_cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`Added ${name} to cart`);
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center space-y-4 py-10">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg width="32" height="32" fill="none" class="text-gray-300" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
                <p class="text-gray-500 font-medium">Your cart is empty.</p>
                <button onclick="toggleCart()" class="text-sm font-semibold tracking-widest uppercase border-b border-black pb-1 hover:opacity-60 transition-opacity mt-4">Continue Shopping</button>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50 mb-4 transition-all hover:border-gray-100">
                <img src="${item.img}" class="w-20 h-24 object-cover rounded shadow-sm" alt="${item.name}" />
                <div class="flex-grow flex flex-col justify-between h-full">
                    <div class="flex justify-between items-start">
                        <h4 class="font-medium brand-font text-lg leading-tight text-gray-900">${item.name}</h4>
                        <button onclick="removeFromCart('${item.name}')" class="text-gray-400 hover:text-red-500 transition-colors p-1" aria-label="Remove item">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                    
                    <div class="flex justify-between items-end mt-4">
                        <div class="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
                            <button onclick="updateQuantity('${item.name}', -1)" class="text-gray-500 hover:text-black font-semibold w-5 h-5 flex items-center justify-center leading-none transition-colors" aria-label="Decrease quantity">&minus;</button>
                            <span class="text-sm font-medium w-4 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.name}', 1)" class="text-gray-500 hover:text-black font-semibold w-5 h-5 flex items-center justify-center leading-none transition-colors" aria-label="Increase quantity">&plus;</button>
                        </div>
                        <p class="text-sm font-medium text-gray-900">R ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.innerText = totalCount;
    cartTotal.innerText = `R ${totalPrice.toFixed(2)}`;
}

// --- Toast Notification ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-white text-gray-900 px-6 py-4 rounded-lg shadow-xl border border-gray-100 flex items-center gap-3 transform translate-y-12 opacity-0 transition-all duration-300 pointer-events-auto';
    toast.innerHTML = `
        <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
        <p class="text-sm font-medium pr-4">${message}</p>
    `;

    // Prepend to stack new toasts on top
    container.prepend(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-12', 'opacity-0');
    }, 10);

    // Animate out
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- WhatsApp Checkout ---
function checkoutToWhatsApp() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    const phoneNumber = "27646849684"; // Replace with actual business WhatsApp number
    let message = "*New Order from The Body Barn* 🌿\n\n";

    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - R ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Order Total: R ${totalPrice.toFixed(2)}*\n\n`;
    message += "Please let me know how to proceed with payment and delivery details. Thank you!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
