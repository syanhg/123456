// Generate sample data
function generateData(days) {
    const data = [];
    const upperData = [];
    const labels = [];
    const startDate = new Date('2024-11-10');
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        labels.push(date);
        
        // Generate realistic fluctuating data
        let baseValue = 35;
        let variation = Math.sin(i / 5) * 5 + Math.random() * 5;
        
        // Add trends
        if (i > days * 0.4) baseValue += 5;
        if (i > days * 0.7) baseValue += 10;
        if (i > days * 0.85) baseValue += 15;
        
        let value = baseValue + variation;
        data.push(Math.max(20, Math.min(75, value)));
        upperData.push(Math.max(30, Math.min(85, value + 20)));
    }
    
    return { labels, data, upperData };
}

const datasets = {
    '1d': generateData(1),
    '1w': generateData(7),
    '2m': generateData(60),
    'all': generateData(90)
};

let currentPeriod = '2m';

const ctx = document.getElementById('predictionChart').getContext('2d');

const config = {
    type: 'line',
    data: {
        labels: datasets[currentPeriod].labels,
        datasets: [
            {
                label: 'Upper Bound',
                data: datasets[currentPeriod].upperData,
                backgroundColor: 'rgba(134, 239, 172, 0.3)',
                borderColor: 'transparent',
                borderWidth: 0,
                fill: '+1',
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4
            },
            {
                label: 'Prediction',
                data: datasets[currentPeriod].data,
                backgroundColor: 'rgba(134, 239, 172, 0.3)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2.5,
                fill: 'origin',
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(34, 197, 94)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 14,
                displayColors: false,
                bodyFont: {
                    size: 14,
                    weight: '600'
                },
                titleFont: {
                    size: 12,
                    weight: '500'
                },
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 1) {
                            return Math.round(context.parsed.y) + '%';
                        }
                        return null;
                    },
                    title: function(context) {
                        const date = new Date(context[0].parsed.x);
                        return date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                        });
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM dd'
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    maxRotation: 0,
                    autoSkipPadding: 40
                },
                border: {
                    display: false
                }
            },
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: 'rgba(229, 231, 235, 0.8)',
                    drawBorder: false,
                    lineWidth: 1
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    callback: function(value) {
                        return value + '%';
                    },
                    stepSize: 20,
                    padding: 10
                },
                border: {
                    display: false
                }
            }
        }
    }
};

const chart = new Chart(ctx, config);

// Filter buttons functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        currentPeriod = this.dataset.period;
        chart.data.labels = datasets[currentPeriod].labels;
        chart.data.datasets[0].data = datasets[currentPeriod].upperData;
        chart.data.datasets[1].data = datasets[currentPeriod].data;
        chart.update('active');
    });
});
