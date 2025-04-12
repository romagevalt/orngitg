document.addEventListener('DOMContentLoaded', () => {
    // Объект для хранения корзины
    let cart = [];

    // Обновление счетчика корзины в шапке
    const updateCartCount = () => {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart + span').textContent = `Корзина (${cartCount})`;
    };

    // Обновление отображения корзины
    const updateCartDisplay = () => {
        const cartContainer = document.querySelector('.shopping-cart-area .container');
        const cartItems = cartContainer.querySelector('p');

        if (cart.length === 0) {
            cartItems.textContent = 'В вашей корзине пока нет товаров.';
        } else {
            cartItems.remove();
            let cartList = cartContainer.querySelector('.cart-list');
            if (!cartList) {
                cartList = document.createElement('div');
                cartList.className = 'cart-list';
                cartContainer.appendChild(cartList);
            }

            cartList.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const itemPrice = parseFloat(item.price.replace('€', '').replace(',', '.'));
                const itemTotal = itemPrice * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name} (${item.variant})</h4>
                        <p>Количество: ${item.quantity}</p>
                        <p>Цена: ${item.price}</p>
                        <p>Итого: ${(itemTotal.toFixed(2))}€</p>
                    </div>
                    <button class="remove-item" data-index="${index}">Удалить</button>
                `;
                cartList.appendChild(cartItem);
            });

            // Добавление итоговой суммы
            const totalDiv = document.createElement('div');
            totalDiv.className = 'cart-total';
            totalDiv.innerHTML = `<p>Общая сумма: ${total.toFixed(2)}€</p>`;
            cartList.appendChild(totalDiv);

            // Обработчики удаления
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    cart.splice(index, 1);
                    updateCartDisplay();
                    updateCartCount();
                });
            });
        }
    };

    // Обработка всех карточек товаров
    document.querySelectorAll('.product-card').forEach(card => {
        const quantityInput = card.querySelector('.quantity-input');
        const decrementBtn = card.querySelector('.decrement');
        const incrementBtn = card.querySelector('.increment');
        const variantSelect = card.querySelector('.variant-select');
        const priceInput = card.querySelector('.price-input');
        const buyButton = card.querySelector('.button.secondary');

        // Обновление цены при выборе варианта
        const updatePrice = () => {
            const selectedOption = variantSelect.options[variantSelect.selectedIndex];
            const price = selectedOption.textContent.match(/\((\d+,\d+€)\)/)[1];
            priceInput.value = price;
        };

        // Управление количеством
        decrementBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        incrementBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });

        // Проверка ввода в поле количества
        quantityInput.addEventListener('input', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) {
                quantityInput.value = 1;
            }
        });

        // Обновление цены при смене варианта
        variantSelect.addEventListener('change', updatePrice);

        // Добавление в корзину
        buyButton.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const quantity = parseInt(quantityInput.value);
            const variant = variantSelect.options[variantSelect.selectedIndex].textContent;
            const price = priceInput.value;

            cart.push({
                name: productName,
                quantity: quantity,
                variant: variant.split('(')[0].trim(),
                price: price
            });

            updateCartCount();
            updateCartDisplay();

            // Сброс количества после добавления
            quantityInput.value = 1;
        });
    });

    // Инициализация корзины при загрузке
    updateCartCount();
    updateCartDisplay();
});