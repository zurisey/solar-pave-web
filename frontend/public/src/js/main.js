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