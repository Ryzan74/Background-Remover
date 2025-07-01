document.addEventListener('DOMContentLoaded', () => {
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

    // --- Event Listener untuk Unggah Gambar ---

    // Mengklik tombol "Pilih Gambar" akan memicu input file tersembunyi
    uploadButton.addEventListener('click', () => {
        imageUpload.click();
    });

    // Menangani peristiwa perubahan pada input file (saat file dipilih)
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // Menangani fungsionalitas Drag & Drop
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
        const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
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
        imageUpload.value = ''; // Reset input file
    }
});
