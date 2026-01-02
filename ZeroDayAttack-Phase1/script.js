const slider = document.getElementById("threshold");
const tval = document.getElementById("threshold-value");
const loadingEl = document.getElementById("loading");
const statsEl = document.getElementById("stats");
const emptyStateEl = document.getElementById("empty-state");
const runBtn = document.getElementById("runBtn");

let chartInstance = null;

// Update threshold value in real-time
slider.oninput = () => {
    tval.innerText = parseFloat(slider.value).toFixed(2);
};

function createAnomalyChart(results) {
    const ctx = document.getElementById('anomalyChart');
    
    if (!ctx) return;

    // Prepare data
    const labels = results.map(r => `${r.index}`);
    const scores = results.map(r => r.score);
    const colors = results.map(r => r.status === "Anomaly" ? "#dc2626" : "#16a34a");
    const thresholdLine = parseFloat(slider.value);

    // Destroy previous chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Anomaly Score',
                    data: scores,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 4,
                    tension: 0.1,
                },
                {
                    label: 'Threshold',
                    type: 'line',
                    data: Array(results.length).fill(thresholdLine),
                    borderColor: '#2563eb',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        color: '#374151'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(4);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1.0,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Anomaly Score',
                        color: '#374151',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 10
                        },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 20
                    },
                    title: {
                        display: true,
                        text: 'Sample Index',
                        color: '#374151',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
}

async function runDetection() {
    try {
        // Show loading state
        loadingEl.classList.add("show");
        runBtn.disabled = true;

        const response = await fetch(`/detect?threshold=${slider.value}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch detection results");
        }

        // Populate results table
        const tbody = document.querySelector("#results tbody");
        tbody.innerHTML = "";

        const results = Array.isArray(data) ? data : (data.results || []);

        if (results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="no-data">No results found</td></tr>';
            statsEl.style.display = "none";
            emptyStateEl.style.display = "block";
            return;
        }

        // Count anomalies and normal
        const anomalyCount = results.filter(r => r.status === "Anomaly").length;
        const normalCount = results.filter(r => r.status === "Normal").length;

        // Update stats
        document.getElementById("normal-count").innerText = normalCount;
        document.getElementById("anomaly-count").innerText = anomalyCount;
        statsEl.style.display = "grid";
        emptyStateEl.style.display = "none";

        // Create chart
        createAnomalyChart(results);

        // Populate table rows with smooth animation
        results.forEach((row, index) => {
            const tr = document.createElement("tr");
            const statusClass = row.status === "Anomaly" ? "Anomaly" : "Normal";
            tr.innerHTML = `
                <td>${row.index}</td>
                <td>${row.score.toFixed(4)}</td>
                <td><span class="status-badge ${statusClass}">${row.status}</span></td>
            `;
            tr.style.opacity = "0";
            tr.style.animation = `slideIn 0.3s ease forwards`;
            tr.style.animationDelay = `${index * 10}ms`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error:", err);
        const tbody = document.querySelector("#results tbody");
        tbody.innerHTML = `<tr><td colspan="3" class="no-data">❌ Error: ${err.message}</td></tr>`;
        statsEl.style.display = "none";
        emptyStateEl.style.display = "block";
    } finally {
        // Hide loading state
        loadingEl.classList.remove("show");
        runBtn.disabled = false;
    }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
