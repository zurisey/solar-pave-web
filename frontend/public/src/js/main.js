document.addEventListener("DOMContentLoaded", () => {
    initChart();

    const sliders = {
        silica: document.getElementById('silica'),
        eva: document.getElementById('eva'),
        bitumen: document.getElementById('bitumen'),
        lime: document.getElementById('lime')
    };

    const uiUpdates = ['val', 'res'].map(prefix => ({
        silica: document.getElementById(`${prefix}-silica`),
        eva: document.getElementById(`${prefix}-eva`),
        bitumen: document.getElementById(`${prefix}-bitumen`),
        lime: document.getElementById(`${prefix}-lime`)
    }));

    Object.keys(sliders).forEach(key => {
        sliders[key].addEventListener('input', (e) => {
            const val = parseFloat(e.target.value).toFixed(1) + '%';
            uiUpdates[0][key].innerText = val;
            uiUpdates[1][key].innerText = val;
        });
    });

    const btnOptimize = document.getElementById('btn-optimize');
    btnOptimize.addEventListener('click', async () => {
        btnOptimize.innerText = "Processing...";
        btnOptimize.disabled = true;

        const payload = {
            silica_glass: parseFloat(sliders.silica.value),
            eva_polymer: parseFloat(sliders.eva.value),
            bitumen: parseFloat(sliders.bitumen.value),
            hydrated_lime: parseFloat(sliders.lime.value)
        };

        try {
            // URL Fetch diubah menjadi relative agar mendukung deployment Render
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();

            document.getElementById('pred-marshall').innerText = data.Marshall_Stability;
            document.getElementById('pred-flow').innerText = data.Flow;
            document.getElementById('pred-vim').innerText = data.VIM + "%";
            document.getElementById('pred-vfb').innerText = data.VFB;
            document.getElementById('pred-stiffness').innerText = data.Stiffness_Modulus;

            updateChartOptimalPoint(payload.silica_glass, data.Marshall_Stability);

        } catch (error) {
            console.error(error);
            alert('Gagal mengambil prediksi. Pastikan server API sudah berjalan.');
        } finally {
            btnOptimize.innerText = "Run Optimization";
            btnOptimize.disabled = false;
        }
    });
});

// FITUR BARU: Auto-Optimize menggunakan AI
const btnAutoAI = document.getElementById('btn-auto-ai');
const formulationBox = document.getElementById('formulation-box');

if (btnAutoAI) {
    btnAutoAI.addEventListener('click', async () => {
        // Mengubah tampilan tombol menjadi status loading
        const originalText = btnAutoAI.innerHTML;
        btnAutoAI.innerHTML = '⏳ Menghitung 1000+ Formulasi...';
        btnAutoAI.disabled = true;
        btnAutoAI.classList.replace('bg-blue-600', 'bg-slate-400');
        
        // Memberikan efek animasi pada kotak hasil
        formulationBox.classList.add('bg-green-100', 'border-green-300');
        formulationBox.classList.remove('bg-blue-50', 'border-blue-100');

        try {
            // Memanggil API khusus optimasi di backend Python
            const response = await fetch('/api/optimize-mix');
            const data = await response.json();
            
            if (response.ok) {
                // 1. Menggerakkan slider secara otomatis ke angka terbaik
                document.getElementById('silica').value = data.recommended_mix.silica_glass;
                document.getElementById('eva').value = data.recommended_mix.eva_polymer;
                document.getElementById('bitumen').value = data.recommended_mix.bitumen;
                document.getElementById('lime').value = data.recommended_mix.hydrated_lime;
                
                // 2. Memperbarui angka teks di samping slider
                document.getElementById('val-silica').innerText = data.recommended_mix.silica_glass.toFixed(1) + '%';
                document.getElementById('val-eva').innerText = data.recommended_mix.eva_polymer.toFixed(1) + '%';
                document.getElementById('val-bitumen').innerText = data.recommended_mix.bitumen.toFixed(1) + '%';
                document.getElementById('val-lime').innerText = data.recommended_mix.hydrated_lime.toFixed(1) + '%';
                
                // 3. Menjalankan event klik tombol prediksi manual (untuk memicu update grafik & kotak prediksi bawaan Anda)
                document.getElementById('btn-optimize').click();
                
                // Mengubah judul kotak hasil menjadi "Resep Terbaik AI"
                formulationBox.querySelector('h3').innerText = "RESEP TERBAIK DITEMUKAN";
            } else {
                alert('Gagal melakukan optimasi otomatis. Pastikan server berjalan.');
            }
        } catch (error) {
            console.error('Error saat Optimasi AI:', error);
            alert('Terjadi kesalahan pada jaringan ke server AI.');
        } finally {
            // Mengembalikan tombol seperti semula
            btnAutoAI.innerHTML = originalText;
            btnAutoAI.disabled = false;
            btnAutoAI.classList.replace('bg-slate-400', 'bg-blue-600');
            
            // Mengembalikan warna kotak setelah 3 detik
            setTimeout(() => {
                formulationBox.classList.remove('bg-green-100', 'border-green-300');
                formulationBox.classList.add('bg-blue-50', 'border-blue-100');
                formulationBox.querySelector('h3').innerText = "FORMULASI SAAT INI";
            }, 3000);
        }
    });
}