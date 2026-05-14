// --- LOGIKA GLOBAL ---
let cart = JSON.parse(localStorage.getItem('ciimut_cart')) || [];
let currentSelectedItem = null; // Untuk menampung data item yang sedang dipilih

function updateCartCount() {
    const cartIcon = document.querySelector('.cart-icon span');
    if (cartIcon) {
        cartIcon.innerText = `🛒 (${cart.length})`;
    }
}

// --- LOGIKA HALAMAN ORDER (DENGAN MODAL) ---
const modal = document.getElementById("modal-flavor");

    // Fungsi untuk menampilkan atau menyembunyikan gambar QRIS
function toggleQRIS(show) {
    const qrisContainer = document.getElementById('qris-container');
    if (qrisContainer) {
        qrisContainer.style.display = show ? 'block' : 'none';
    }
}

// Fungsi untuk menyiapkan data sebelum modal dibuka
function prepareOrder(button) {
    const card = button.closest('.card');
    const name = card.querySelector('h4').innerText;
    const priceText = card.querySelector('.price').innerText;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));

    // Simpan ke variabel global yang sudah Anda buat di baris 3
    currentSelectedItem = { name, price };
    
    // Update teks judul di dalam modal
    const modalTitle = document.getElementById('modal-item-name');
    if(modalTitle) modalTitle.innerText = `Pilih Rasa: ${name}`;
    
    // Reset semua checkbox varian agar tidak terpilih otomatis
    document.querySelectorAll('.flavor-cb').forEach(cb => cb.checked = false);
    
    // Tampilkan modal
    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal() {
    if (modal) modal.style.display = "none";
}

function confirmOrder() {
    const selectedFlavors = [];
    document.querySelectorAll('.flavor-cb:checked').forEach((cb) => {
        selectedFlavors.push(cb.value);
    });

    if (selectedFlavors.length === 0) {
        alert("Silahkan pilih minimal satu varian!");
        return;
    }

    // Gabungkan nama produk dengan pilihan rasa untuk keranjang
    const finalName = `${currentSelectedItem.name} (${selectedFlavors.join(", ")})`;
    
    // Logika simpan ke keranjang (mirip kode lama Anda)
    cart.push({ name: finalName, price: currentSelectedItem.price });
    localStorage.setItem('ciimut_cart', JSON.stringify(cart));
    
    showToast(`${currentSelectedItem.name} ditambahkan!`);
    updateCartCount();
    closeModal();
}

// Fungsi Toast dipindah ke luar agar bisa diakses global
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// Tutup modal jika klik di luar box putih
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
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
    
    // Mengambil nilai metode pembayaran yang dipilih
    const metodeBayar = form.querySelector('input[name="payment"]:checked').value;

    //commad menambahkan pesan dalam string pesan
    let pesan = `Halo Ciimut! Saya ingin pesan:%0A%0A*Nama:* ${nama}%0A*Alamat:* ${alamat}%0A*Metode Pembayaran:* ${metodeBayar}%0A%0A*Pesanan:*%0A`;
    
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
        const catatan = document.getElementById('catatan').value || "-";

        let pesan = `Halo Ciimut! Saya ingin pesan:%0A%0A*Nama:* ${nama}%0A*Alamat:* ${alamat}%0A%0A*Pesanan:*%0A%0A*Catatan:* ${catatan}`;
        
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

