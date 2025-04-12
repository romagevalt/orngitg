// Инициализация корзины из localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция обновления иконки корзины
function updateCartIcon() {
    // Всегда перечитываем данные из localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.querySelector('.cart-link span');
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Warenkorb (${totalItems})`;
    } else {
        console.error('Элемент .cart-link span не найден на странице');
    }
}

// Функция сохранения корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция обновления цены при смене варианта
function updatePrice(selectElement, priceInput) {
    const selectedOption = selectElement.options[selectElement.selectedIndex].text;
    const priceMatch = selectedOption.match(/\((\d+\,?\d*€)\)/);
    if (priceMatch) {
        priceInput.value = priceMatch[1];
    }
}

// Функция добавления товара в корзину
function addToCart(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const quantity = parseInt(productCard.querySelector('.quantity-input').value);
    const variantSelect = productCard.querySelector('.variant-select');
    const volume = variantSelect.options[variantSelect.selectedIndex].text;
    const priceText = productCard.querySelector('.price-input').value;
    const price = parseFloat(priceText.replace('€', '').replace(',', '.'));

    if (quantity <= 0 || isNaN(quantity)) {
        alert('Bitte geben Sie eine gültige Menge ein.');
        return;
    }

    const existingItem = cart.find(item => item.name === productName && item.volume === volume);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name: productName, volume, price, quantity });
    }

    saveCart();
    updateCartIcon();
    updateCartDisplay();
    alert(`${productName} (${volume}) wurde zum Warenkorb hinzugefügt!`);
}

// Функция отображения корзины
function updateCartDisplay() {
    const cartContainer = document.querySelector('.shopping-cart-area .container');
    if (!cartContainer) return; // Если не на странице buy.html, выходим

    const cartItems = cartContainer.querySelector('.cart-items') || document.createElement('div');
    cartItems.className = 'cart-items';
    const emptyMessage = cartContainer.querySelector('p');
    const totalElement = cartContainer.querySelector('.cart-total');

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        if (cartItems.parentNode) cartItems.remove();
        if (totalElement) totalElement.remove();
        return;
    }

    emptyMessage.style.display = 'none';
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name} (${item.volume}) - ${item.price}€ x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€</span>
            <button class="remove-item" data-index="${index}">Entfernen</button>
        `;
        cartItems.appendChild(itemElement);
    });

    const newTotalElement = totalElement || document.createElement('div');
    newTotalElement.className = 'cart-total';
    newTotalElement.textContent = `Gesamt: ${total.toFixed(2)}€`;

    if (!cartContainer.contains(cartItems)) cartContainer.appendChild(cartItems);
    if (!cartContainer.contains(newTotalElement)) cartContainer.appendChild(newTotalElement);

    cartItems.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Функция удаления товара из корзины
function removeFromCart(event) {
    const index = parseInt(event.target.dataset.index);
    cart.splice(index, 1);
    saveCart();
    updateCartIcon();
    updateCartDisplay();
}

// Обработчик для кнопки "Jetzt Kaufen"
function handleCheckout() {
    if (cart.length === 0) {
        alert('Ihr Warenkorb ist leer!');
    } else {
        alert('Die Zahlung über PayPal wird bald verfügbar sein. Vielen Dank für Ihre Geduld!');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    try {
        updateCartIcon();
        updateCartDisplay();

        if (document.querySelector('.product-card')) {
            document.querySelectorAll('.variant-select').forEach(select => {
                const priceInput = select.closest('.product-card').querySelector('.price-input');
                updatePrice(select, priceInput);
                select.addEventListener('change', () => updatePrice(select, priceInput));
            });

            document.querySelectorAll('.quantity-button.increment').forEach(button => {
                button.addEventListener('click', () => {
                    const input = button.previousElementSibling;
                    input.value = parseInt(input.value) + 1;
                });
            });

            document.querySelectorAll('.quantity-button.decrement').forEach(button => {
                button.addEventListener('click', () => {
                    const input = button.nextElementSibling;
                    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
                });
            });

            document.querySelectorAll('.button.secondary').forEach(button => {
                if (button.textContent === 'in Warenkorb') {
                    button.addEventListener('click', addToCart);
                }
            });
        }

        const checkoutButton = document.querySelector('.kupi-nahuy-blyat');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', handleCheckout);
        }
    } catch (error) {
        console.error('Ошибка при инициализации скрипта:', error);
    }
});

// Периодическое обновление иконки корзины (на случай, если данные изменились)
setInterval(updateCartIcon, 1000); // Обновляем каждую секунду