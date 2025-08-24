// متجر SelfHealing - JavaScript الرئيسي

// سلة التسوق (تخزين في localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحديث عدد المنتجات في السلة في الهيدر
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} تم إضافته إلى السلة!`);
    }
}

// إزالة منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// تحديث كمية منتج في السلة
function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;
    
    const productId = cart[index].id;
    const product = products.find(p => p.id === productId);
    
    // إزالة المنتج القديم
    cart.splice(index, 1);
    
    // إضافة المنتج بالكمية الجديدة
    for (let i = 0; i < newQuantity; i++) {
        cart.push(product);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// عرض المنتجات في صفحة السلة
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");
    const cartTotalSection = document.getElementById("cart-total-section");
    const cartItemsCountElement = document.getElementById("cart-items-count");

    if (!cartItemsContainer || !emptyCartMessage || !cartTotalSection || !cartItemsCountElement) return;

    cartItemsContainer.innerHTML = "";
    let totalAmount = 0;
    const productQuantities = {};

    cart.forEach(item => {
        productQuantities[item.id] = (productQuantities[item.id] || 0) + 1;
    });

    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        cartTotalSection.style.display = "none";
    } else {
        emptyCartMessage.style.display = "none";
        cartTotalSection.style.display = "block";

        Object.keys(productQuantities).forEach(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            const quantity = productQuantities[productId];
            if (product) {
                const itemTotal = product.price * quantity;
                totalAmount += itemTotal;

                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<div style=\\'font-size: 2rem; color: var(--primary-green);\\'>🌿</div>\';">
                    </div>
                    <div class="item-details">
                        <h3>${product.name}</h3>
                        <p>السعر: ${product.price.toLocaleString()} د.ع</p>
                        <div class="quantity-controls">
                            <button onclick="updateCartQuantity(${cart.findIndex(p => p.id === product.id)}, ${quantity - 1})">-</button>
                            <span>${quantity}</span>
                            <button onclick="updateCartQuantity(${cart.findIndex(p => p.id === product.id)}, ${quantity + 1})">+</button>
                        </div>
                        <p>الإجمالي: ${(itemTotal).toLocaleString()} د.ع</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${cart.findIndex(p => p.id === product.id)})">إزالة</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            }
        });
    }

    document.getElementById("total-amount").textContent = totalAmount.toLocaleString();
    cartItemsCountElement.textContent = cart.length;
}

// إكمال الطلب عبر واتساب
function completeOrder() {
    if (cart.length === 0) {
        alert("سلة التسوق فارغة!");
        return;
    }

    let orderSummary = "مرحباً، أود طلب المنتجات التالية من متجر SelfHealing:\n\n";
    let total = 0;
    const productQuantities = {};

    cart.forEach(item => {
        productQuantities[item.id] = (productQuantities[item.id] || 0) + 1;
    });

    Object.keys(productQuantities).forEach(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        const quantity = productQuantities[productId];
        if (product) {
            orderSummary += `- ${product.name} (الكمية: ${quantity}) - السعر: ${(product.price * quantity).toLocaleString()} د.ع\n`;
            total += product.price * quantity;
        }
    });

    orderSummary += `\nالإجمالي الكلي: ${total.toLocaleString()} د.ع\n\n`;
    orderSummary += "الرجاء تأكيد الطلب وتفاصيل التوصيل.";

    const whatsappNumber = "07513958118"; // رقم الواتساب الأساسي
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(orderSummary)}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, "_blank");
}

// دالة إرسال رسالة من صفحة التواصل (ترسل عبر واتساب)
function sendMessage(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    let whatsappMessage = `رسالة من موقع SelfHealing:\n\n`;
    whatsappMessage += `الاسم: ${name}\n`;
    whatsappMessage += `البريد الإلكتروني: ${email}\n`;
    if (phone) {
        whatsappMessage += `رقم الهاتف: ${phone}\n`;
    }
    whatsappMessage += `الموضوع: ${subject}\n`;
    whatsappMessage += `الرسالة: ${message}\n`;

    const whatsappNumber = "07513958118"; // رقم الواتساب الأساسي للتواصل
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, "_blank");

    alert("تم إرسال رسالتك بنجاح عبر واتساب! سيتم الرد عليك قريباً.");
    document.getElementById("contactForm").reset();
}

// دالة عرض المنتجات في صفحة المنتجات (مع الفلاتر والترتيب)
let currentCategory = "الكل";
let currentSearchTerm = "";
let currentMinPrice = 0;
let currentMaxPrice = 0;
let currentMinRating = 1;

function displayProducts(productsToShow) {
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) return;

    productsGrid.innerHTML = ""; // مسح المنتجات الحالية

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = 
            `<p style="text-align: center; color: var(--text-light); font-size: 1.2rem; margin-top: 50px;">
                لا توجد منتجات مطابقة لمعايير البحث أو الفلترة.
            </p>`;
        return;
    }

    productsToShow.forEach(product => {
        const stars = "⭐".repeat(product.rating);
        const productCard = document.createElement("div");
        productCard.className = "product-card fade-in";
        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<div style=\\'font-size: 3rem; color: var(--primary-green);\\'>🌿</div>\';">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${product.price.toLocaleString()} د.ع</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span>(${product.rating}/5)</span>
                        <span class="stars">${stars}</span>
                    </div>
                    <div style="margin-bottom: 1rem; padding: 8px; background-color: var(--light-green); border-radius: 5px; font-size: 0.85rem; color: var(--dark-green);">
                        <strong>الفئة:</strong> ${product.category}
                    </div>
                </div>
            </a>
            <button class="btn" onclick="addToCart(${product.id})">إضافة للسلة</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// تطبيق جميع الفلاتر
function applyAllFilters() {
    let filtered = products;

    // فلترة حسب الفئة
    if (currentCategory !== "الكل") {
        filtered = filtered.filter(product => product.category === currentCategory);
    }

    // فلترة حسب البحث
    if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.details.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }

    // فلترة حسب السعر
    filtered = filtered.filter(product => 
        product.price >= currentMinPrice && product.price <= currentMaxPrice
    );

    // فلترة حسب التقييم
    filtered = filtered.filter(product => product.rating >= currentMinRating);

    // تحديث عداد المنتجات
    const productsCount = document.getElementById("productsCount");
    if (productsCount) {
        productsCount.textContent = `عرض ${filtered.length} من أصل ${products.length} منتج`;
    }
    
    // حفظ النتائج المفلترة مؤقتا للترتيب
    filteredProductsCache = filtered;
    sortProducts(); // تطبيق الترتيب بعد الفلترة
}

// فلترة حسب الفئة
function filterByCategory(category) {
    currentCategory = category;
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn => {
        if (btn.textContent === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    applyAllFilters();
}

// فلترة حسب البحث
function filterProducts() {
    currentSearchTerm = document.getElementById("productSearch").value.toLowerCase();
    applyAllFilters();
}

// فلترة حسب نطاق السعر
function filterByPriceRange() {
    const priceRangeInput = document.getElementById("priceRange");
    const priceDisplay = document.getElementById("priceDisplay");
    currentMaxPrice = parseInt(priceRangeInput.value);
    priceDisplay.textContent = `0 - ${currentMaxPrice.toLocaleString()} د.ع`;
    applyAllFilters();
}

// فلترة حسب التقييم
function filterByRatingFilter() {
    currentMinRating = parseInt(document.getElementById("ratingFilter").value);
    applyAllFilters();
}

// دالة التمرير للأعلى
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// إظهار/إخفاء زر التمرير للأعلى
window.onscroll = function() {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    if (scrollToTopBtn) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }
};

// عند تحميل الصفحة، تحديث عداد السلة
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // تهيئة أقصى سعر لنطاق السعر عند تحميل صفحة المنتجات
    if (document.getElementById("productsGrid") && typeof products !== "undefined") {
        currentMaxPrice = Math.max(...products.map(p => p.price));
    }

    // عرض السلة إذا كنا في صفحة السلة
    if (document.getElementById("cart-items")) {
        renderCart();
    }
});


