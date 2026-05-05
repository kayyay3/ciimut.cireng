// --- LOGIKA GLOBAL ---
let cart = JSON.parse(localStorage.getItem('ciimut_cart')) || [];

function updateCartCount() {
    const cartIcon = document.querySelector('.cart-icon span');
    if (cartIcon) {
        cartIcon.innerText = `🛒 (${cart.length})`;
    }
}

// --- LOGIKA HALAMAN ORDER ---
if (document.querySelector('.btn-add')) {
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.card'); // Mencari parent card terdekat
            const name = card.querySelector('h4').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

            // Tambah ke array
            cart.push({ name, price });
            
            // Simpan ke LocalStorage
            localStorage.setItem('ciimut_cart', JSON.stringify(cart));
            
            function showToast(message) {
                const toast = document.getElementById("toast");
                toast.innerText = message;

                toast.classList.add("show");

                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2000);
            }

            showToast(`${name} ditambahkan ke keranjang!`);
            updateCartCount();
        });
    });
}


// --- LOGIKA HALAMAN CHECKOUT ---
if (document.querySelector('.order-items')) {
    const cartContainer = document.querySelector('.order-items');
    const form = document.querySelector('form');

    function renderCheckout() {
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding:20px;">Keranjang kosong.</p>';
        return;
    }

    let total = 0;
    let html = '';

    const summary = {};

    cart.forEach(item => {
        if (!summary[item.name]) {
            summary[item.name] = {
                name: item.name,
                price: item.price,
                qty: 1
            };
        } else {
            summary[item.name].qty++;
        }
    });

    function renderCheckout() {
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding:20px;">Keranjang kosong.</p>';
        return;
    }

    let total = 0;
    let html = '';

    const summary = {};

    cart.forEach(item => {
        if (!summary[item.name]) {
            summary[item.name] = {
                name: item.name,
                price: item.price,
                qty: 1
            };
        } else {
            summary[item.name].qty++;
        }
    });

    const orderedItems = [];

    cart.forEach(item => {
        if (!orderedItems.includes(item.name)) {
            orderedItems.push(item.name);
        }
    });

    orderedItems.forEach(name => {
        const item = summary[name];
        const subtotal = item.price * item.qty;
        total += subtotal;

        html += `
        <div class="item">
            <span>${item.name}</span>

            <div class="qty-control">
                <button onclick="changeQty('${item.name}', -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty('${item.name}', 1)">+</button>
            </div>

            <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
        </div>`;
    });

    html += `
    <div class="item divider"></div>
    <div class="item total">
        <span>Total Bayar</span>
        <span class="total-price">Rp ${total.toLocaleString('id-ID')}</span>
    </div>`;

    cartContainer.innerHTML = html;
    }

    function changeQty(name, delta) {
        if (delta === 1) {
            // tambah item baru
            const item = cart.find(i => i.name === name);
            cart.push({ name: item.name, price: item.price });
        } else {
            // hapus satu item
            const index = cart.findIndex(i => i.name === name);
            if (index !== -1) {
            cart.splice(index, 1);
        }
    }

    // simpan ulang
    localStorage.setItem('ciimut_cart', JSON.stringify(cart));

    // render ulang
    renderCheckout();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = form.querySelector('input[type="text"]').value;
        const alamat = form.querySelector('textarea').value;

        let pesan = `Halo Ciimut! Saya ingin pesan:%0A%0A*Nama:* ${nama}%0A*Alamat:* ${alamat}%0A%0A*Pesanan:*%0A`;
        
        cart.forEach((item, i) => {
            pesan += `${i+1}. ${item.name} (Rp ${item.price.toLocaleString('id-ID')})%0A`;
        });

        const totalFinal = cart.reduce((sum, item) => sum + item.price, 0);
        pesan += `%0A*Total: Rp ${totalFinal.toLocaleString('id-ID')}*`;

        window.open(`https://wa.me/6285959197918?text=${pesan}`, '_blank');
        localStorage.removeItem('ciimut_cart');
        location.reload();
    });

    renderCheckout();
    }

    function changeQty(name, delta) {
        if (delta === 1) {
            // tambah item baru
            const item = cart.find(i => i.name === name);
            cart.push({ name: item.name, price: item.price });
        } else {
            // hapus satu item
            const index = cart.findIndex(i => i.name === name);
            if (index !== -1) {
            cart.splice(index, 1);
        }
    }

    // simpan ulang
    localStorage.setItem('ciimut_cart', JSON.stringify(cart));

    // render ulang
    renderCheckout();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = form.querySelector('input[type="text"]').value;
        const alamat = form.querySelector('textarea').value;

        let pesan = `Halo Ciimut! Saya ingin pesan:%0A%0A*Nama:* ${nama}%0A*Alamat:* ${alamat}%0A%0A*Pesanan:*%0A`;
        
        cart.forEach((item, i) => {
            pesan += `${i+1}. ${item.name} (Rp ${item.price.toLocaleString('id-ID')})%0A`;
        });

        const totalFinal = cart.reduce((sum, item) => sum + item.price, 0);
        pesan += `%0A*Total: Rp ${totalFinal.toLocaleString('id-ID')}*`;

        window.open(`https://wa.me/6285959197918?text=${pesan}`, '_blank');
        localStorage.removeItem('ciimut_cart');
        location.reload();
    });

    renderCheckout();
}

// Jalankan update count saat load pertama kali
updateCartCount();

function scrollMenu(direction) {
    const wrapper = document.getElementById('menuWrapper');
    const scrollAmount = 300; // Sesuaikan dengan lebar card
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Opsional: Update status dot saat di-scroll
const wrapper = document.getElementById('menuWrapper');
const dots = document.querySelectorAll('.dot');

wrapper.addEventListener('scroll', () => {
    const index = Math.round(wrapper.scrollLeft / 300);
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
});