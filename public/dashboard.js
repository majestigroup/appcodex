const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('en-US');

function createCell(value) {
  const td = document.createElement('td');
  td.textContent = value;
  return td;
}

function populateTable(tableId, rows, mapper) {
  const tbody = document.querySelector(`${tableId} tbody`);
  tbody.innerHTML = '';

  rows.forEach((item) => {
    const tr = document.createElement('tr');
    mapper(item).forEach((value) => tr.appendChild(createCell(value)));
    tbody.appendChild(tr);
  });
}

function renderRevenueCards(revenueEstimates) {
  const container = document.getElementById('revenue-cards');
  const cards = [
    {
      title: 'Monthly Revenue',
      value: currency.format(revenueEstimates.monthlyRevenue)
    },
    {
      title: 'Growth Rate',
      value: `${revenueEstimates.growthPercent}%`
    },
    {
      title: 'Forecast (Next Month)',
      value: currency.format(revenueEstimates.monthlyRevenue * (1 + revenueEstimates.growthPercent / 100))
    }
  ];

  container.innerHTML = cards
    .map(
      (card) => `
      <article class="card metric-card">
        <p class="metric-title">${card.title}</p>
        <p class="metric-value">${card.value}</p>
      </article>
    `
    )
    .join('');
}

function renderSocialSummary(socialData) {
  const socialSummary = document.getElementById('social-summary');
  socialSummary.innerHTML = `
    <article class="card subtle">
      <p class="metric-title">Followers</p>
      <p class="metric-value">${number.format(socialData.followers)}</p>
    </article>
    <article class="card subtle">
      <p class="metric-title">Engagement Rate</p>
      <p class="metric-value">${socialData.engagementRate}%</p>
    </article>
  `;
}

function renderTrafficChart(trafficData) {
  const ctx = document.getElementById('traffic-chart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: trafficData.map((item) => item.day),
      datasets: [
        {
          label: 'Visits',
          data: trafficData.map((item) => item.visits),
          borderColor: '#5ca8ff',
          backgroundColor: 'rgba(92, 168, 255, 0.18)',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#d8e1ff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9fb0d9' },
          grid: { color: 'rgba(159, 176, 217, 0.12)' }
        },
        y: {
          ticks: { color: '#9fb0d9' },
          grid: { color: 'rgba(159, 176, 217, 0.12)' }
        }
      }
    }
  });
}

async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard-data');

    if (!response.ok) {
      window.location.href = '/login';
      return;
    }

    const data = await response.json();

    renderRevenueCards(data.revenueEstimates);
    renderSocialSummary(data.socialData);
    renderTrafficChart(data.trafficData);

    populateTable('#courses-table', data.topCourses, (item) => [
      item.title,
      number.format(item.enrollments),
      currency.format(item.revenue)
    ]);

    populateTable('#experts-table', data.topExperts, (item) => [
      item.name,
      item.rating.toFixed(1),
      number.format(item.totalStudents)
    ]);

    populateTable('#offers-table', data.offers, (item) => [item.name, `${item.conversionRate}%`]);

    populateTable('#landing-table', data.landingPages, (item) => [
      item.name,
      number.format(item.visitors),
      `${item.conversionRate}%`
    ]);
  } catch (error) {
    window.location.href = '/login';
  }
}

loadDashboard();
