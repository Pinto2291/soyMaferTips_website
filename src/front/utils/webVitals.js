import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals';
import { getBackendURL } from './api';

const BACKEND_URL = getBackendURL();

function sendToAnalytics(metric) {
  // Determine rating based on standard values
  let rating = 'good';
  const val = metric.value;
  const name = metric.name;

  if (name === 'LCP') {
    if (val > 4000) rating = 'poor';
    else if (val > 2500) rating = 'needs-improvement';
  } else if (name === 'FID') {
    if (val > 300) rating = 'poor';
    else if (val > 100) rating = 'needs-improvement';
  } else if (name === 'CLS') {
    if (val > 0.25) rating = 'poor';
    else if (val > 0.1) rating = 'needs-improvement';
  } else if (name === 'TTFB') {
    if (val > 1800) rating = 'poor';
    else if (val > 800) rating = 'needs-improvement';
  } else if (name === 'FCP') {
    if (val > 3000) rating = 'poor';
    else if (val > 1800) rating = 'needs-improvement';
  }

  const body = {
    metric_name: name,
    value: val,
    rating: rating
  };

  fetch(`${BACKEND_URL}/api/performance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => {
    if (!response.ok) {
      console.warn('Analytics logging failed:', response.statusText);
    }
  })
  .catch(err => {
    // Fail silently in production
    console.error('Analytics error:', err);
  });
}

export function startPerformanceMonitoring() {
  try {
    onLCP(sendToAnalytics);
    onFID(sendToAnalytics);
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    console.log('Web-Vitals performance monitoring initialized.');
  } catch (e) {
    console.warn('Performance monitoring failed to start:', e);
  }
}
