/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const base = (__ENV.BASE_URL || 'http://127.0.0.1:5214').replace(/\/$/, '');
const htmlDuration = new Trend('public_html_duration', true);
const assetDuration = new Trend('public_asset_duration', true);
const routeFailures = new Counter('public_route_failures');
const routes = [
  '/en', '/en/about', '/en/services', '/en/services/details', '/en/how-we-work', '/en/portfolio', '/en/contact',
  '/en/projects/schooly', '/en/projects/nora-store', '/en/projects/edtech-platform', '/en/projects/live-workshop',
  '/en/projects/eduflow', '/en/projects/legal-translation', '/en/projects/gc-hardware', '/en/projects/concord-crm', '/en/projects/product-scraper',
  '/ar', '/ar/about', '/ar/services', '/ar/services/details', '/ar/how-we-work', '/ar/portfolio', '/ar/contact',
  '/ar/projects/schooly', '/ar/projects/nora-store', '/ar/projects/edtech-platform', '/ar/projects/live-workshop',
  '/ar/projects/eduflow', '/ar/projects/legal-translation', '/ar/projects/gc-hardware', '/ar/projects/concord-crm', '/ar/projects/product-scraper',
];
const assets = ['/assets/rakmyat/brand/rakmyat-mark.webp', '/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYMZg.woff2'];

export const options = {
  scenarios: {
    browser_journeys: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '20s', target: 50 },
        { duration: '30s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '30s', target: 100 },
        { duration: '20s', target: 200 },
        { duration: '30s', target: 200 },
        { duration: '20s', target: 350 },
        { duration: '30s', target: 350 },
        { duration: '30s', target: 500 },
        { duration: '90s', target: 500 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    public_html_duration: ['p(95)<500'],
    public_route_failures: ['count==0'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  const route = routes[Math.floor(Math.random() * routes.length)];
  const isArabic = route.startsWith('/ar');
  const page = http.get(`${base}${route}`, { tags: { kind: 'html', route } });
  htmlDuration.add(page.timings.duration);
  const pageOk = check(page, {
    'public route returns 200': (r) => r.status === 200,
    'HTML locale matches route': (r) => r.body.includes(`lang="${isArabic ? 'ar' : 'en'}"`),
  });
  if (!pageOk) routeFailures.add(1);

  const asset = assets[Math.floor(Math.random() * assets.length)];
  const response = http.get(`${base}${asset}`, { tags: { kind: 'asset', asset } });
  assetDuration.add(response.timings.duration);
  if (!check(response, { 'asset returns 200': (r) => r.status === 200 })) routeFailures.add(1);

  sleep(2 + Math.random() * 2);
}
