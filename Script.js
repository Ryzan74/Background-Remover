document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload'); // Ini adalah input file tersembunyi
    const uploadButton = document.getElementById('uploadButton'); // Ini adalah tombol yang terlihat
    const previewSection = document.getElementById('previewSection');
    const originalImage = document.getElementById('originalImage');
    const removedBgImage = document.getElementById('removedBgImage');
    const processingMessage = document.getElementById('processingMessage');
    const errorWarning = document.getElementById('errorWarning');
    const downloadButton = document.getElementById('downloadButton');
    const uploadNewButton = document.getElementById('uploadNewButton');

    // --- Event Listener untuk Unggah Gambar ---

    // 1. Mengklik tombol "Pilih Gambar" akan memicu klik pada input file tersembunyi
    // Pastikan ID 'uploadButton' benar-benar mengacu pada tombol, bukan div.
    if (uploadButton) { // Tambahkan pengecekan untuk memastikan elemen ada
        uploadButton.addEventListener('click', () => {
            imageUpload.click(); // Memicu klik pada input file tersembunyi
        });
    }

    // 2. Menangani peristiwa 'change' pada input file (saat file dipilih)
    if (imageUpload) { // Tambahkan pengecekan untuk memastikan elemen ada
        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
    }


    // 3. Menangani fungsionalitas Drag & Drop pada area unggah
    if (uploadArea) { // Tambahkan pengecekan untuk memastikan elemen ada
        uploadArea.addEventListener('dragover', (event) => {
            event.preventDefault(); // Mencegah perilaku default browser (membuka file)
            uploadArea.classList.add('drag-over'); // Beri indikator visual
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over'); // Hapus indikator visual
        });

        uploadArea.addEventListener('drop', (event) => {
            event.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = event.dataTransfer.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
    }


    // --- Fungsi Penanganan Unggah Gambar ---
    function handleImageUpload(file) {
        // Validasi tipe file
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WebP.');
            resetUI();
            return;
        }

        // Validasi ukuran file (maks 5MB)
        const maxSize = 5 * 1024 * 1024; // 5 MB dalam bytes
        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            resetUI();
            return;
        }

        // Tampilkan loading dan reset UI sebelumnya
        processingMessage.classList.remove('hidden');
        errorWarning.classList.add('hidden');
        removedBgImage.src = ''; // Bersihkan gambar hasil sebelumnya
        removedBgImage.classList.add('hidden'); // Sembunyikan gambar hasil
        downloadButton.classList.add('hidden'); // Sembunyikan tombol download

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result; // Tampilkan gambar asli

            // Tampilkan section pratinjau
            previewSection.classList.remove('hidden');
            
            // --- SIMULASI PEMROSESAN (Karena tidak ada backend/AI di sini) ---
            // Dalam aplikasi nyata, di sinilah Anda akan mengirim gambar ke server
            // untuk diproses oleh algoritma AI penghapus background.
            setTimeout(() => {
                processingMessage.classList.add('hidden'); // Sembunyikan pesan proses
                
                // Simulasikan hasil: untuk demo, kita akan tampilkan gambar asli lagi atau placeholder.
                // Di aplikasi nyata, 'e.target.result' akan diganti dengan URL gambar hasil dari server.
                removedBgImage.src = e.target.result; // Ganti dengan gambar yang "sudah diproses"
                removedBgImage.classList.remove('hidden'); // Tampilkan gambar hasil
                downloadButton.classList.remove('hidden'); // Tampilkan tombol download

                // Contoh jika ada kegagalan (uncomment untuk melihat efeknya)
                // errorWarning.classList.remove('hidden');
                // removedBgImage.classList.add('hidden');
                // downloadButton.classList.add('hidden');

            }, 2000); // Simulasi waktu proses 2 detik
        };
        reader.readAsDataURL(file); // Baca file sebagai URL data
    }

    // --- Event Listener untuk Tombol Aksi ---

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            // Logika unduh
            if (removedBgImage.src && !removedBgImage.classList.contains('hidden')) {
                const link = document.createElement('a');
                link.href = removedBgImage.src;
                link.download = `removabg_output_${Date.now()}.png`; // Nama file output
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Tidak ada gambar yang siap diunduh.');
            }
        });
    }

    if (uploadNewButton) {
        uploadNewButton.addEventListener('click', () => {
            resetUI();
        });
    }

    // --- Fungsi Reset UI ---
    function resetUI() {
        if (previewSection) previewSection.classList.add('hidden');
        if (originalImage) originalImage.src = '';
        if (removedBgImage) removedBgImage.src = '';
        if (processingMessage) processingMessage.classList.add('hidden');
        if (errorWarning) errorWarning.classList.add('hidden');
        if (downloadButton) downloadButton.classList.add('hidden');
        if (imageUpload) imageUpload.value = ''; // Sangat penting untuk mereset input file agar bisa memilih file yang sama lagi
    }
});
