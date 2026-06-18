const COLUMNS = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'];
const COLUMN_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
};

const calculateMetrics = (jobs) => {
  const totalJobs = jobs.length;
  const counts = COLUMNS.reduce((acc, col) => {
    acc[col] = jobs.filter((j) => j.status === col).length;
    return acc;
  }, {});
  const conversionRate = totalJobs
    ? (((counts.interviewing + counts.offer) / totalJobs) * 100).toFixed(1)
    : 0;
  const rejectionRate = totalJobs
    ? ((counts.rejected / totalJobs) * 100).toFixed(1)
    : 0;
  return { totalJobs, counts, conversionRate, rejectionRate };
};

const renderAnalytics = (currentState) => {
  const analyticsSection = document.getElementById('analytics-section');
  const jobs = currentState.getJobs();
  const { totalJobs, counts, conversionRate, rejectionRate } = calculateMetrics(jobs);
  const maxCount = Math.max(...Object.values(counts), 1);

  analyticsSection.innerHTML = `
    <div class="analytics-stats">
      <div class="stat-card">
        <span class="stat-value">${totalJobs}</span>
        <span class="stat-label">Total Applications</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${conversionRate}%</span>
        <span class="stat-label">Conversion Rate</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${rejectionRate}%</span>
        <span class="stat-label">Rejection Rate</span>
      </div>
    </div>
    <div class="analytics-chart">
      <h3 class="chart-title">Applications by Stage</h3>
      <div class="bar-chart">
        ${COLUMNS.map(
          (col) => `
          <div class="bar-group">
            <div class="bar-wrap">
              <span class="bar-count">${counts[col]}</span>
              <div class="bar bar--${col}" style="height: ${(counts[col] / maxCount) * 100}%"></div>
            </div>
            <span class="bar-label">${COLUMN_LABELS[col]}</span>
          </div>
        `,
        ).join('')}
      </div>
    </div>
  `;
};

export { renderAnalytics };
