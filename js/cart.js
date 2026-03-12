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
        toastContainer.className = 'fixed bottom-24 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[120] flex flex-col gap-3 pointer-events-none';
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

function showErrorToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-white text-gray-900 px-6 py-4 rounded-lg shadow-xl border border-red-100 flex items-center gap-3 transform translate-y-12 opacity-0 transition-all duration-300 pointer-events-auto';
    toast.innerHTML = `
        <div class="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-sm font-medium pr-4">${message}</p>
    `;

    container.prepend(toast);

    requestAnimationFrame(() => {
        setTimeout(() => toast.classList.remove('translate-y-12', 'opacity-0'), 10);
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- Checkout Gateway ---
function showCheckoutGateway() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    let modalContainer = document.getElementById('checkout-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'checkout-modal-container';
        document.body.appendChild(modalContainer);
    }

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    modalContainer.innerHTML = `
        <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 opacity-0 transition-opacity duration-300" id="checkout-modal-backdrop" style="background: rgba(46, 31, 31, 0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" onclick="closeCheckoutGateway(event)">
            <div class="bg-[#faf8f5] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 relative flex flex-col max-h-[90vh]" id="checkout-modal-content" onclick="event.stopPropagation()">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-6 bg-[#ede9e3] border-b border-[#2e1f1f]/10">
                    <h3 class="text-2xl font-semibold text-[#2e1f1f] brand-font">Checkout Details</h3>
                    <button onclick="closeCheckoutGateway()" class="w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur rounded-full text-[#2e1f1f] hover:bg-[#2e1f1f] hover:text-white transition-colors" aria-label="Close modal">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
                    </button>
                </div>

                <!-- Form Body -->
                <div class="p-6 overflow-y-auto w-full scrollbar-hide">
                    <div class="space-y-5">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-semibold tracking-widest uppercase text-[#7a9470] mb-2">Full Name</label>
                            <input type="text" id="co-name" class="w-full bg-white border border-[#2e1f1f]/10 rounded-lg px-4 py-3 text-[#2e1f1f] focus:outline-none focus:border-[#7a9470] focus:ring-1 focus:ring-[#7a9470] transition-colors" placeholder="e.g. Jane Doe">
                        </div>

                        <!-- Delivery Method -->
                        <div>
                            <label class="block text-sm font-semibold tracking-widest uppercase text-[#7a9470] mb-2">Delivery Method</label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label class="border border-[#2e1f1f]/10 rounded-lg p-3 flex cursor-pointer hover:border-[#7a9470] transition-colors bg-white group relative">
                                    <input type="radio" name="delivery" value="Paxi" data-cost="110" class="peer absolute w-0 h-0 opacity-0" onchange="updateCheckoutTotal()" checked>
                                    <div class="w-full flex justify-between items-center group-hover:text-[#7a9470] peer-checked:text-[#7a9470]">
                                        <span class="font-medium">Paxi</span>
                                        <span class="text-sm font-semibold">R110</span>
                                    </div>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-[#7a9470] rounded-lg pointer-events-none transition-all"></div>
                                </label>
                                <label class="border border-[#2e1f1f]/10 rounded-lg p-3 flex cursor-pointer hover:border-[#7a9470] transition-colors bg-white group relative">
                                    <input type="radio" name="delivery" value="Aramex" data-cost="110" class="peer absolute w-0 h-0 opacity-0" onchange="updateCheckoutTotal()">
                                    <div class="w-full flex justify-between items-center group-hover:text-[#7a9470] peer-checked:text-[#7a9470]">
                                        <span class="font-medium">Aramex</span>
                                        <span class="text-sm font-semibold">R110</span>
                                    </div>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-[#7a9470] rounded-lg pointer-events-none transition-all"></div>
                                </label>
                                <label class="border border-[#2e1f1f]/10 rounded-lg p-3 flex cursor-pointer hover:border-[#7a9470] transition-colors bg-white group relative">
                                    <input type="radio" name="delivery" value="Postnet" data-cost="110" class="peer absolute w-0 h-0 opacity-0" onchange="updateCheckoutTotal()">
                                    <div class="w-full flex justify-between items-center group-hover:text-[#7a9470] peer-checked:text-[#7a9470]">
                                        <span class="font-medium">Postnet</span>
                                        <span class="text-sm font-semibold">R110</span>
                                    </div>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-[#7a9470] rounded-lg pointer-events-none transition-all"></div>
                                </label>
                                <label class="border border-[#2e1f1f]/10 rounded-lg p-3 flex cursor-pointer hover:border-[#7a9470] transition-colors bg-white group relative">
                                    <input type="radio" name="delivery" value="Collection" data-cost="0" class="peer absolute w-0 h-0 opacity-0" onchange="updateCheckoutTotal()">
                                    <div class="w-full flex justify-between items-center group-hover:text-[#7a9470] peer-checked:text-[#7a9470]">
                                        <span class="font-medium">Collection</span>
                                        <span class="text-sm font-semibold text-[#7a9470]">Free</span>
                                    </div>
                                    <div class="absolute inset-0 border-2 border-transparent peer-checked:border-[#7a9470] rounded-lg pointer-events-none transition-all"></div>
                                </label>
                            </div>
                        </div>

                        <!-- Address -->
                        <div>
                            <label class="block text-sm font-semibold tracking-widest uppercase text-[#7a9470] mb-2">Delivery Address or Node</label>
                            <textarea id="co-address" rows="3" class="w-full bg-white border border-[#2e1f1f]/10 rounded-lg px-4 py-3 text-[#2e1f1f] focus:outline-none focus:border-[#7a9470] focus:ring-1 focus:ring-[#7a9470] transition-colors resize-none mb-1" placeholder="Enter your full address or PEP Node..."></textarea>
                            <p class="text-xs text-[#2e1f1f]/50 italic">For Collection, please note we will arrange the pickup location via WhatsApp.</p>
                        </div>
                    </div>
                </div>

                <!-- Footer Totals & CTA -->
                <div class="p-6 bg-white border-t border-[#2e1f1f]/10 flex flex-col gap-4">
                    <div class="bg-[#faf8f5] p-4 rounded-lg text-sm text-[#2e1f1f]/80 space-y-2">
                        <div class="flex justify-between"><span>Subtotal:</span> <span class="font-medium" id="co-subtotal" data-total="${cartTotal}">R ${cartTotal.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span>Delivery:</span> <span class="font-medium" id="co-deliveryfee">+ R 110.00</span></div>
                        <div class="h-px bg-[#2e1f1f]/10 w-full my-2"></div>
                        <div class="flex justify-between text-lg font-semibold text-[#2e1f1f]"><span>Total:</span> <span id="co-finaltotal">R ${(cartTotal + 110).toFixed(2)}</span></div>
                    </div>

                    <button onclick="submitCheckout()" class="w-full bg-[#2e1f1f] text-white py-4 rounded-lg font-semibold tracking-widest uppercase text-sm hover:bg-[#433030] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                        Proceed to WhatsApp
                    </button>
                    <p class="text-center text-xs text-[#2e1f1f]/50">No payment is taken here. You will complete your order securely via WhatsApp.</p>
                </div>

            </div>
        </div>
    `;

    document.body.style.overflow = 'hidden';
    
    // Close cart drawer if open
    if (isCartOpen) toggleCart();

    requestAnimationFrame(() => {
        const backdrop = document.getElementById('checkout-modal-backdrop');
        const content = document.getElementById('checkout-modal-content');
        if (backdrop && content) {
            backdrop.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }
    });
}

function closeCheckoutGateway(event) {
    if (event && event.target !== document.getElementById('checkout-modal-backdrop') && !event.currentTarget.classList?.contains('z-[110]')) {
         return;
    }

    const backdrop = document.getElementById('checkout-modal-backdrop');
    const content = document.getElementById('checkout-modal-content');
    
    if (backdrop && content) {
        backdrop.style.opacity = '0';
        content.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            const container = document.getElementById('checkout-modal-container');
            if (container) container.innerHTML = '';
            document.body.style.overflow = '';
        }, 300);
    }
}

function updateCheckoutTotal() {
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    if (!selectedDelivery) return;
    
    const deliveryCost = parseFloat(selectedDelivery.dataset.cost);
    const subtotal = parseFloat(document.getElementById('co-subtotal').dataset.total);
    const total = subtotal + deliveryCost;

    document.getElementById('co-deliveryfee').innerHTML = deliveryCost === 0 ? '<span class="text-[#7a9470]">Free</span>' : `+ R ${deliveryCost.toFixed(2)}`;
    document.getElementById('co-finaltotal').innerText = `R ${total.toFixed(2)}`;
}

function submitCheckout() {
    const nameInput = document.getElementById('co-name');
    const addressInput = document.getElementById('co-address');
    
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');

    // Reset error styling
    nameInput.classList.remove('border-red-500');
    addressInput.classList.remove('border-red-500');

    if (!name) {
        showErrorToast("Please enter your Full Name to proceed.");
        nameInput.classList.add('border-red-500');
        nameInput.focus();
        return;
    }
    if (!address && selectedDelivery.value !== 'Collection') {
        showErrorToast("Please provide a Delivery Address or node.");
        addressInput.classList.add('border-red-500');
        addressInput.focus();
        return;
    }

    const deliveryMethod = selectedDelivery.value;
    const deliveryCost = parseFloat(selectedDelivery.dataset.cost);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryCost;

    const phoneNumber = "27646849684"; // Replace with actual business WhatsApp number
    let message = `*New Order from The Body Barn* 🌿\n\n`;
    
    message += `*Customer Details*\n`;
    message += `Name: ${name}\n`;
    message += `Delivery Method: ${deliveryMethod} ${deliveryCost > 0 ? `(R${deliveryCost})` : '(Free)'}\n`;
    message += `Address/Node: ${address || 'N/A'}\n\n`;

    message += `*Order Items*\n`;
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - R ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Order Summary*\n`;
    message += `Subtotal: R ${subtotal.toFixed(2)}\n`;
    message += `Delivery: R ${deliveryCost.toFixed(2)}\n`;
    message += `*TOTAL: R ${total.toFixed(2)}*\n\n`;
    message += `Hi! I'd like to place this order. Please let me know how to proceed with payment 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Close modal and clear cart
    closeCheckoutGateway();
    cart = [];
    saveCart();
    updateCartUI();
    
    window.open(whatsappUrl, '_blank');
}
