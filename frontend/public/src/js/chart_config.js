let optimChart = null;

function initChart() {
    const ctx = document.getElementById('optimizationChart').getContext('2d');
    
    const trainingDataPoints = [
        {x: 5, y: 10}, {x: 8, y: 6}, {x: 10, y: 14}, 
        {x: 13, y: 12.8}, {x: 15, y: 9.8}, {x: 19, y: 8.5}, {x: 20, y: 2}
    ];

    const predictionCurveData = [];
    for(let i=0; i<=22; i+=2) {
        predictionCurveData.push({x: i, y: 10.5 + Math.sin(i/6) * 1.5});
    }

    optimChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Lab Data',
                    data: trainingDataPoints,
                    backgroundColor: 'transparent',
                    borderColor: '#cbd5e1',
                    borderWidth: 2,
                    pointRadius: 5,
                    type: 'scatter'
                },
                {
                    label: 'SVR Trendline',
                    data: predictionCurveData,
                    borderColor: '#64748b',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.4,
                    type: 'line',
                    fill: false
                },
                {
                    label: 'Optimized Mix',
                    data: [{x: 12.0, y: 11.8}],
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    type: 'scatter'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                x: {
                    min: 0, max: 25,
                    title: { display: true, text: 'Silica Glass Replacement (%)', color: '#64748b', font: {family: 'Inter', size: 11} },
                    grid: { color: '#f1f5f9' }
                },
                y: {
                    min: 0, max: 20,
                    title: { display: true, text: 'Marshall Stability (kN)', color: '#64748b', font: {family: 'Inter', size: 11} },
                    grid: { color: '#f1f5f9' }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8, font: {family: 'Inter'} }
                }
            }
        }
    });
}

function updateChartOptimalPoint(glassPercentage, stabilityValue) {
    if (optimChart) {
        optimChart.data.datasets[2].data = [{x: glassPercentage, y: stabilityValue}];
        optimChart.update();
    }
}