const form = document.getElementById('stock-form');
const symbolInput = document.getElementById('symbol');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const stockTitle = document.getElementById('stock-title');
const stockPrice = document.getElementById('stock-price');
const stockSummary = document.getElementById('stock-summary');

const chartContext = document.getElementById('stock-chart');
let stockChart;

function drawChart(symbol, history) {
  const labels = history.map((_, i) => `T${i + 1}`);

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `${symbol} Price`,
          data: history,
          borderColor: '#111',
          borderWidth: 4,
          backgroundColor: '#f9ff00',
          pointBackgroundColor: '#111',
          pointRadius: 4,
          fill: false,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#111',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#111'
          },
          grid: {
            color: '#111'
          }
        },
        y: {
          ticks: {
            color: '#111'
          },
          grid: {
            color: '#111'
          }
        }
      }
    }
  });
}

async function loadStock(symbol) {
  statusEl.textContent = 'Loading...';

  try {
    const response = await fetch(`/api/stock/${encodeURIComponent(symbol)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to load stock data');
    }

    stockTitle.textContent = data.symbol;
    stockPrice.textContent = `Price: $${Number(data.price).toFixed(2)}`;
    stockSummary.textContent = `Summary: ${data.summary}`;
    resultEl.classList.remove('hidden');

    drawChart(data.symbol, data.history);

    statusEl.textContent = `Loaded ${data.symbol}.`;
  } catch (error) {
    resultEl.classList.add('hidden');
    statusEl.textContent = error.message;
    if (stockChart) {
      stockChart.destroy();
      stockChart = null;
    }
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const symbol = symbolInput.value.trim().toUpperCase();

  if (!symbol) {
    statusEl.textContent = 'Please enter a symbol.';
    return;
  }

  loadStock(symbol);
});
