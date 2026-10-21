import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';
const html = new Trend('public_html_duration', true);
const assets = new Trend('public_asset_duration', true);
export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '15s', target: 25 },
    { duration: '15s', target: 50 },
    { duration: '5s', target: 0 },
  ],
  thresholds: { http_req_failed: ['rate<0.01'] },
};
const pages = ['/en','/en/about','/en/services','/en/services/details','/en/how-we-work','/en/portfolio','/en/contact','/en/projects/schooly','/en/projects/nora-store','/en/projects/edtech-platform','/en/projects/live-workshop','/en/projects/eduflow','/en/projects/legal-translation','/en/projects/gc-hardware','/en/projects/concord-crm','/en/projects/product-scraper','/ar','/ar/about','/ar/services','/ar/services/details','/ar/how-we-work','/ar/portfolio','/ar/contact','/ar/projects/schooly','/ar/projects/nora-store','/ar/projects/edtech-platform','/ar/projects/live-workshop','/ar/projects/eduflow','/ar/projects/legal-translation','/ar/projects/gc-hardware','/ar/projects/concord-crm','/ar/projects/product-scraper'];
export default function () {
  const base = __ENV.BASE_URL || 'http://127.0.0.1:5213';
  const path = pages[Math.floor(Math.random() * pages.length)];
  const response = http.get(`${base}${path}`, { tags: { kind: 'public_html', route: path } });
  html.add(response.timings.duration);
  const asset = http.get(`${base}/assets/rakmyat/brand/rakmyat-mark.webp`, { tags: { kind: 'public_asset' } });
  assets.add(asset.timings.duration);
  sleep(1 + Math.random() * 2);
}
/* global __ENV */
