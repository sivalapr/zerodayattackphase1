// ==========================================================================
// ZERO-DAY ATTACK DETECTION INTERACTIVE ENGINE
// Integrated with line-charts-9 Composed Curve & Miro Design Spec
// ==========================================================================

const slider = document.getElementById("threshold");
const tval = document.getElementById("threshold-value");
const loadingEl = document.getElementById("loading");
const statsEl = document.getElementById("stats");
const emptyStateEl = document.getElementById("empty-state");
const runBtn = document.getElementById("runBtn");

let chartInstance = null;
let currentResults = [];
let currentFilter = "all";

// Real-time slider update
if (slider && tval) {
    slider.oninput = () => {
        const val = parseFloat(slider.value).toFixed(2);
        tval.innerText = val;
        updatePresetButtons(val);
        if (chartInstance && currentResults.length > 0) {
            updateThresholdLine(parseFloat(slider.value));
        }
    };
}

// Preset button handlers
function setPreset(val) {
    if (!slider) return;
    slider.value = val;
    tval.innerText = parseFloat(val).toFixed(2);
    updatePresetButtons(val);
    if (chartInstance && currentResults.length > 0) {
        updateThresholdLine(parseFloat(val));
    }
}

function updatePresetButtons(currentVal) {
    document.querySelectorAll(".preset-btn").forEach(btn => {
        const pVal = parseFloat(btn.getAttribute("data-preset"));
        if (Math.abs(pVal - parseFloat(currentVal)) < 0.05) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function updateThresholdLine(thresholdVal) {
    if (!chartInstance) return;
    
    // Update cutoff line dataset
    chartInstance.data.datasets[1].data = Array(currentResults.length).fill(thresholdVal);
    
    // Re-evaluate statuses
    let normalCount = 0;
    let anomalyCount = 0;
    currentResults.forEach(r => {
        if (r.score > thresholdVal) {
            anomalyCount++;
            r.status = "Anomaly";
        } else {
            normalCount++;
            r.status = "Normal";
        }
    });

    chartInstance.update('none');

    // Update telemetry tiles
    document.getElementById("normal-count").innerText = normalCount;
    document.getElementById("anomaly-count").innerText = anomalyCount;
    
    // Update line-charts-9 header metrics
    updateChartMetrics(currentResults, thresholdVal, anomalyCount);
    renderTable();
}

function updateChartMetrics(results, thresholdVal, anomalyCount) {
    if (!results || results.length === 0) return;
    const scores = results.map(r => r.score);
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);
    
    const peakEl = document.getElementById("peak-loss-val");
    if (peakEl) peakEl.innerText = maxVal.toFixed(4);

    const trendBadge = document.getElementById("chart-trend-badge");
    const trendText = document.getElementById("trend-text");
    if (trendBadge && trendText) {
        if (anomalyCount > 0) {
            trendBadge.className = "line-chart-trend anomaly-detected";
            trendText.innerText = `+${anomalyCount} Anomalies Active`;
        } else {
            trendBadge.className = "line-chart-trend";
            trendText.innerText = "Nominal Baseline";
        }
    }

    const metaBuffer = document.getElementById("meta-buffer-count");
    if (metaBuffer) metaBuffer.innerText = `${results.length} packets`;

    const metaPercent = document.getElementById("meta-anomaly-percent");
    if (metaPercent) {
        const pct = ((anomalyCount / results.length) * 100).toFixed(1);
        metaPercent.innerText = `${pct}% flagged`;
    }

    const metaHigh = document.getElementById("meta-high-val");
    if (metaHigh) metaHigh.innerText = maxVal.toFixed(4);

    const metaLow = document.getElementById("meta-low-val");
    if (metaLow) metaLow.innerText = minVal.toFixed(4);

    const metaCutoff = document.getElementById("meta-cutoff-val");
    if (metaCutoff) metaCutoff.innerText = thresholdVal.toFixed(2);
}

// Create Composed Smooth Curve Chart (based on line-charts-9)
function createAnomalyChart(results) {
    const canvas = document.getElementById('anomalyChart');
    if (!canvas) return;

    const thresholdLine = parseFloat(slider.value);
    const labels = results.map(r => `#${r.index}`);
    const scores = results.map(r => r.score);
    const anomalyCount = results.filter(r => r.score > thresholdLine).length;

    // Update the Line Chart 9 Metrics Header
    updateChartMetrics(results, thresholdLine, anomalyCount);

    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Soft area gradient under the curve (line-charts-9 areaGradient)
    const areaGradient = ctx.createLinearGradient(0, 0, 0, 320);
    areaGradient.addColorStop(0, 'rgba(124, 58, 237, 0.22)'); // Purple glow
    areaGradient.addColorStop(0.65, 'rgba(124, 58, 237, 0.05)');
    areaGradient.addColorStop(1, 'rgba(124, 58, 237, 0.00)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Reconstruction Loss (MSE)',
                    data: scores,
                    borderColor: '#7c3aed', // Purple line matching line-charts-9
                    borderWidth: 2.2,
                    fill: true,
                    backgroundColor: areaGradient,
                    tension: 0.38, // Smooth monotone curve
                    cubicInterpolationMode: 'monotone',
                    // Dots on anomalies and high peaks
                    pointRadius: function(context) {
                        const val = context.raw;
                        return val > thresholdLine ? 5.5 : 0;
                    },
                    pointBackgroundColor: function(context) {
                        return '#ff6b6b';
                    },
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7.5,
                    pointHoverBackgroundColor: '#dc2626',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2.5,
                    order: 2
                },
                {
                    label: `Anomaly Cutoff (${thresholdLine.toFixed(2)})`,
                    data: Array(results.length).fill(thresholdLine),
                    borderColor: '#4262ff', // Miro brand blue
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            animation: {
                duration: 750,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: false // We use our custom legend
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#1c1c1e',
                    padding: 14,
                    cornerRadius: 10,
                    titleColor: '#a5a8b5',
                    titleFont: {
                        family: '-apple-system, sans-serif',
                        size: 11,
                        weight: '500'
                    },
                    bodyColor: '#ffffff',
                    bodyFont: {
                        family: '-apple-system, sans-serif',
                        size: 13,
                        weight: '600'
                    },
                    borderColor: '#e0e2e8',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        title: function(items) {
                            if (!items.length) return '';
                            return `Packet Sample ${items[0].label}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 1) {
                                return `Cutoff Threshold: ${context.parsed.y.toFixed(4)}`;
                            }
                            const val = context.parsed.y.toFixed(4);
                            const isAnomaly = context.parsed.y > parseFloat(slider.value);
                            const statusStr = isAnomaly ? "🚨 ZERO-DAY OUTLIER" : "🟢 Benign Traffic";
                            return [
                                `MSE Error: ${val}`,
                                `Status: ${statusStr}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1.05,
                    grid: {
                        color: 'rgba(224, 226, 232, 0.65)',
                        drawBorder: false,
                        borderDash: [4, 6]
                    },
                    ticks: {
                        color: '#6b6f7e',
                        font: { size: 11, family: '-apple-system, sans-serif' },
                        callback: function(val) {
                            return val.toFixed(2);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Loss (MSE)',
                        color: '#1c1c1e',
                        font: { size: 12, weight: '600' }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6f7e',
                        font: { size: 10 },
                        maxTicksLimit: 15
                    },
                    title: {
                        display: true,
                        text: 'Analyzed Packet Sequence',
                        color: '#1c1c1e',
                        font: { size: 12, weight: '600' }
                    }
                }
            }
        }
    });
}

// Table Filter
function setTableFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-tab").forEach(tab => {
        if (tab.getAttribute("data-filter") === filter) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
    renderTable();
}

function renderTable() {
    const tbody = document.querySelector("#results tbody");
    if (!tbody) return;

    const filtered = currentResults.filter(r => {
        if (currentFilter === "anomaly") return r.status === "Anomaly";
        if (currentFilter === "normal") return r.status === "Normal";
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No packets matching "${currentFilter}" filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    filtered.forEach((row, idx) => {
        const tr = document.createElement("tr");
        const isAnomaly = row.status === "Anomaly";
        const badgeClass = isAnomaly ? "Anomaly" : "Normal";
        const badgeIcon = isAnomaly ? "⚠️" : "✓";

        tr.innerHTML = `
            <td><strong>#${row.index}</strong></td>
            <td><code>${row.score.toFixed(4)}</code></td>
            <td>
                <span class="badge-status ${badgeClass}">
                    ${badgeIcon} ${row.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Main Detection Runner
async function runDetection() {
    try {
        if (!loadingEl || !runBtn) return;
        loadingEl.classList.add("show");
        runBtn.disabled = true;

        const response = await fetch(`/detect?threshold=${slider.value}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch detection results");
        }

        currentResults = Array.isArray(data) ? data : (data.results || []);

        if (currentResults.length === 0) {
            const tbody = document.querySelector("#results tbody");
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No packet traffic detected</td></tr>';
            statsEl.style.display = "none";
            emptyStateEl.style.display = "block";
            return;
        }

        const anomalyCount = currentResults.filter(r => r.status === "Anomaly").length;
        const normalCount = currentResults.filter(r => r.status === "Normal").length;

        document.getElementById("normal-count").innerText = normalCount;
        document.getElementById("anomaly-count").innerText = anomalyCount;
        statsEl.style.display = "grid";
        emptyStateEl.style.display = "none";

        createAnomalyChart(currentResults);
        renderTable();

    } catch (err) {
        console.error("Detection Error:", err);
        const tbody = document.querySelector("#results tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="3" class="empty-state" style="color: #600000;">❌ Error: ${err.message}</td></tr>`;
        }
    } finally {
        loadingEl.classList.remove("show");
        runBtn.disabled = false;
    }
}

// FAQ Accordion Toggle
function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle("open");
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    if (runBtn) {
        runBtn.addEventListener("click", runDetection);
    }
});
