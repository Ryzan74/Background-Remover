document.addEventListener('DOMContentLoaded', () => {
    // ---- KONFIGURASI API ----
    // PERINGATAN PENTING: Meletakkan API Key langsung di frontend adalah TIDAK AMAN untuk aplikasi produksi.
    // Ini hanya untuk DEMONSTRASI dan PEMBELAJARAN CEPAT.
    // Untuk aplikasi publik, gunakan proxy server backend untuk melindungi API Key Anda.
    const REMOVEBG_API_KEY = 'mhybvMLBah5r7Jt7gy5rZgvL'; // <--- GANTI DENGAN API KEY ANDA!
    const REMOVEBG_API_URL = 'https://api.remove.bg/v1.0/removebg';
    // -------------------------

    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const previewSection = document.getElementById('previewSection');
    const originalImage = document.getElementById('originalImage');
    const removedBgImage = document.getElementById('removedBgImage');
    const processingMessage = document.getElementById('processingMessage');
    const errorWarning = document.getElementById('errorWarning');
    const downloadButton = document.getElementById('downloadButton');
    const uploadNewButton = document.getElementById('uploadNewButton');

    // Pastikan semua elemen yang dibutuhkan ada
    if (!uploadArea || !imageUpload || !uploadButton || !previewSection || !originalImage || !removedBgImage || !processingMessage || !errorWarning || !downloadButton || !uploadNewButton) {
        console.error("Salah satu elemen HTML yang dibutuhkan tidak ditemukan. Periksa ID di index.html.");
        return; // Hentikan eksekusi script jika elemen kunci tidak ada
    }

    // --- Event Listener untuk Unggah Gambar ---

    uploadButton.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = event.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // --- Fungsi Penanganan Unggah Gambar dan Panggilan API ---
    async function handleImageUpload(file) {
        // Validasi tipe file
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WebP.');
            resetUI();
            return;
        }

        // Validasi ukuran file (maks 5MB)
        const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            resetUI();
            return;
        }

        if (!REMOVEBG_API_KEY || REMOVEBG_API_KEY === 'YOUR_REMOVEBG_API_KEY_HERE') {
            alert('API Key remove.bg belum dikonfigurasi. Harap masukkan API Key Anda di script.js.');
            console.error('REMOVEBG_API_KEY not configured.');
            resetUI();
            return;
        }

        // Tampilkan loading dan reset UI sebelumnya
        processingMessage.classList.remove('hidden');
        errorWarning.classList.add('hidden');
        removedBgImage.src = '';
        removedBgImage.classList.add('hidden');
        downloadButton.classList.add('hidden');
        originalImage.src = URL.createObjectURL(file); // Tampilkan gambar asli segera
        previewSection.classList.remove('hidden'); // Tampilkan section pratinjau

        try {
            const formData = new FormData();
            formData.append('image_file', file);
            formData.append('size', 'auto'); // Otomatis deteksi ukuran terbaik
            formData.append('output_format', 'png'); // Hasil PNG agar transparan

            const response = await fetch(REMOVEBG_API_URL, {
                method: 'POST',
                headers: {
                    'X-Api-Key': REMOVEBG_API_KEY,
                    // 'accept': 'application/json' // Untuk respons JSON (jika ingin detail kredit/error)
                },
                body: formData,
            });

            if (!response.ok) {
                // Tangani error dari API
                const errorText = await response.text(); // Ambil respons error dalam bentuk teks
                let errorMessage = `Gagal memproses gambar (Status: ${response.status}).`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson && errorJson.errors && errorJson.errors.length > 0) {
                        errorMessage = errorJson.errors[0].title || errorMessage;
                    } else {
                        errorMessage += ` Detail: ${errorText.substring(0, 100)}...`; // Potong jika terlalu panjang
                    }
                } catch (e) {
                    errorMessage += ` Detail: ${errorText.substring(0, 100)}...`; // Jika bukan JSON
                }
                throw new Error(errorMessage);
            }

            // Jika sukses, respons adalah file gambar (blob)
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            removedBgImage.src = imageUrl; // Tampilkan gambar hasil dari API
            removedBgImage.classList.remove('hidden');
            downloadButton.classList.remove('hidden');

        } catch (error) {
            console.error('Error processing image:', error);
            errorWarning.textContent = `Gagal memproses gambar: ${error.message}`;
            errorWarning.classList.remove('hidden');
            // Sembunyikan gambar hasil jika terjadi error
            removedBgImage.classList.add('hidden');
            downloadButton.classList.add('hidden');
        } finally {
            processingMessage.classList.add('hidden'); // Sembunyikan pesan loading
        }
    }

    // --- Event Listener untuk Tombol Aksi ---

    downloadButton.addEventListener('click', () => {
        if (removedBgImage.src && !removedBgImage.classList.contains('hidden')) {
            const link = document.createElement('a');
            link.href = removedBgImage.src;
            link.download = `removabg_output_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Penting: Revoke URL objek setelah tidak dibutuhkan untuk membebaskan memori
            URL.revokeObjectURL(link.href);
        } else {
            alert('Tidak ada gambar yang siap diunduh.');
        }
    });

    uploadNewButton.addEventListener('click', () => {
        resetUI();
    });

    // --- Fungsi Reset UI ---
    function resetUI() {
        previewSection.classList.add('hidden');
        originalImage.src = '';
        removedBgImage.src = '';
        processingMessage.classList.add('hidden');
        errorWarning.classList.add('hidden');
        downloadButton.classList.add('hidden');
        imageUpload.value = ''; // Reset input file agar bisa memilih file yang sama lagi
    }
});
