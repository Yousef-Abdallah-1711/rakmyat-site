"""Phase 3.2 screenshot, image-integrity, route, and interaction checks.

Requires the machine's existing Python Playwright, Pillow, and Chromium install.
It deliberately adds no npm or application runtime dependencies.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image
from playwright.async_api import async_playwright


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PORTFOLIO = Path(r"C:\Users\yosea\Desktop\BDA\rakmyat-landing\public\portfolio")
PUBLIC_PORTFOLIO = ROOT / "public" / "assets" / "rakmyat" / "portfolio"
CONTENT_FILE = ROOT / "content" / "portfolio.ts"
EVIDENCE = ROOT / "docs" / "phase-3.2"
SCREENSHOTS = EVIDENCE / "screenshots"

PROJECTS = [
    "schooly", "nora-store", "edtech-platform", "live-workshop", "eduflow",
    "legal-translation", "gc-hardware", "concord-crm", "product-scraper",
]
CORE_ROUTES = [
    "", "/about", "/services", "/services/details", "/portfolio", "/contact",
]
VIEWPORTS = [1440, 1280, 768, 390]
HEIGHT = 960

ASSET_REVIEW = {
    "schooly": "Public directory, comparison, and school profile captures. School names and public listing details are visible; no private student records observed in selected views.",
    "nora-store": "Public storefront and product captures. Product brands and photography remain client or third-party material; confirm reuse permission before deployment.",
    "edtech-platform": "Public academy and course captures. Public brand and people/photography are visible; confirm reuse permission before deployment.",
    "live-workshop": "Selected course feature views only. Promotional performance, attendance, and sales statements from other captures were excluded from this website copy and from the copied asset set where identifiable.",
    "eduflow": "Public course screenshots, including one Arabic and one English interface. Authenticated screens were not accessed; confirm course-media permissions before deployment.",
    "legal-translation": "Public service-site hero capture. It includes client identity and promotional/certification content; confirm the client's permission and claims before external production use.",
    "gc-hardware": "Public catalog and product captures. Product trademarks, prices, and photography are visible; confirm client and third-party permissions before deployment.",
    "concord-crm": "No project screenshot supplied; no UI image copied.",
    "product-scraper": "No project screenshot supplied; no UI image copied.",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def audit_assets() -> dict:
    source_files = sorted(path for path in PUBLIC_PORTFOLIO.rglob("*") if path.is_file())
    if not source_files:
        raise RuntimeError("No curated portfolio assets found.")

    source_refs = set(re.findall(r'asset\("([^\"]+)"\s*,\s*"([^\"]+)"\)', CONTENT_FILE.read_text(encoding="utf-8")))
    source_refs.update(("live-workshop", "feature-mobile.webp"))
    records = []
    digests: dict[str, list[str]] = defaultdict(list)
    for target in source_files:
        relative = target.relative_to(PUBLIC_PORTFOLIO)
        slug = relative.parts[0]
        source = SOURCE_PORTFOLIO / relative
        if not source.is_file():
            raise RuntimeError(f"Missing source image for {relative}")
        target_hash = sha256(target)
        source_hash = sha256(source)
        if target_hash != source_hash:
            raise RuntimeError(f"Copied asset differs from its source: {relative}")
        with Image.open(target) as image:
            image.verify()
        with Image.open(target) as image:
            width, height = image.size
            fmt = image.format
        if fmt not in {"WEBP", "JPEG", "PNG"}:
            raise RuntimeError(f"Unexpected image format for {relative}: {fmt}")
        digests[target_hash].append(relative.as_posix())
        records.append({
            "project": slug,
            "source": str(source),
            "destination": f"public/assets/rakmyat/portfolio/{relative.as_posix()}",
            "bytes": target.stat().st_size,
            "format": fmt,
            "width": width,
            "height": height,
            "sha256": target_hash,
            "copyIntegrity": "byte-identical",
            "assetReview": ASSET_REVIEW.get(slug, "Review pending"),
        })

    target_refs = {tuple(ref) for ref in re.findall(r'asset\("([^\"]+)"\s*,\s*"([^\"]+)"\)', CONTENT_FILE.read_text(encoding="utf-8"))}
    target_refs.update({("live-workshop", "feature-mobile.webp")})
    unreferenced = [record["destination"] for record in records if (record["project"], Path(record["destination"]).name) not in target_refs]
    duplicate_groups = [paths for paths in digests.values() if len(paths) > 1]
    result = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": str(SOURCE_PORTFOLIO),
        "target": "public/assets/rakmyat/portfolio/",
        "assetCount": len(records),
        "totalBytes": sum(record["bytes"] for record in records),
        "allImagesDecode": True,
        "allCopiedFilesMatchSourceSha256": True,
        "duplicateImageGroups": duplicate_groups,
        "unreferencedFiles": unreferenced,
        "records": records,
    }
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    (EVIDENCE / "asset-review.json").write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return result


async def matrix(base_url: str) -> dict:
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    records = []
    console_errors = []
    page_errors = []
    failed_local_requests = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(device_scale_factor=1)
        for locale in ("en", "ar"):
            routes = [(route, route.strip("/").replace("/", "-") or "home") for route in CORE_ROUTES]
            routes.extend((f"/projects/{slug}", slug) for slug in PROJECTS)
            for width in VIEWPORTS:
                for route, key in routes:
                    path = f"/{locale}{route}"
                    url = base_url.rstrip("/") + path
                    page = await context.new_page()
                    await page.set_viewport_size({"width": width, "height": HEIGHT})
                    local_errors = []
                    local_page_errors = []
                    local_failed = []
                    page.on("console", lambda message, out=local_errors: out.append(message.text) if message.type == "error" else None)
                    page.on("pageerror", lambda error, out=local_page_errors: out.append(str(error)))
                    page.on("requestfailed", lambda request, out=local_failed: out.append({"url": request.url, "failure": request.failure}) if urlparse(request.url).hostname in {"127.0.0.1", "localhost"} and request.failure != "net::ERR_ABORTED" else None)
                    response = None
                    try:
                        response = await page.goto(url, wait_until="networkidle", timeout=30000)
                        await page.wait_for_function("document.getElementById('preloader')?.classList.contains('isdone')", timeout=5000)
                        await page.evaluate("document.fonts.ready")
                        await page.wait_for_timeout(100)
                        image_result = await page.evaluate("""async () => {
                          const imgs = [...document.images];
                          imgs.forEach((img) => { img.loading = 'eager'; });
                          await Promise.all(imgs.map((img) => img.decode().catch(() => null)));
                          return imgs.map((img) => ({src: new URL(img.currentSrc || img.src, location.href).pathname, ok: img.complete && img.naturalWidth > 0, width: img.naturalWidth, height: img.naturalHeight}));
                        }""")
                        metrics = await page.evaluate("""() => {
                          const bounds = [...document.querySelectorAll('h1,h2,h3')].filter((el) => !el.closest('.swiper,.table-responsive')).map((el) => {
                            const r = el.getBoundingClientRect();
                            return {text: el.innerText.trim().slice(0, 80), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth};
                          });
                          return {
                            viewport: innerWidth,
                            documentWidth: document.documentElement.scrollWidth,
                            bodyWidth: document.body.scrollWidth,
                            documentHeight: document.documentElement.scrollHeight,
                            lang: document.documentElement.lang,
                            dir: document.documentElement.dir,
                            title: document.title,
                            h1: document.querySelector('main h1')?.innerText?.trim() || document.querySelector('h1')?.innerText?.trim() || '',
                            headings: bounds,
                            mobileMenuButton: Boolean(document.querySelector('.navbar-toggler')),
                            projectCardCount: document.querySelectorAll('.portfolio-card').length,
                            projectLinks: [...document.querySelectorAll('a[href*="/projects/"]')].map((a) => a.getAttribute('href')),
                          };
                        }""")
                        screenshot_name = f"{locale}-{width}-{key}.jpg"
                        screenshot_path = SCREENSHOTS / screenshot_name
                        await page.screenshot(path=str(screenshot_path), type="jpeg", quality=84, full_page=False, animations="disabled")
                        expected_status = 200
                        record = {
                            "locale": locale,
                            "route": path,
                            "width": width,
                            "height": HEIGHT,
                            "httpStatus": response.status if response else None,
                            "expectedStatus": expected_status,
                            "screenshot": screenshot_name,
                            "langCorrect": metrics["lang"] == locale,
                            "directionCorrect": metrics["dir"] == ("rtl" if locale == "ar" else "ltr"),
                            "horizontalOverflow": metrics["documentWidth"] > width,
                            "bodyOverflow": metrics["bodyWidth"] > width,
                            "brokenImages": [img for img in image_result if not img["ok"]],
                            "headingsOutsideViewport": [heading for heading in metrics["headings"] if heading["left"] < -1 or heading["right"] > width + 1],
                            "title": metrics["title"],
                            "h1": metrics["h1"],
                            "documentHeight": metrics["documentHeight"],
                            "projectCardCount": metrics["projectCardCount"],
                            "projectLinks": metrics["projectLinks"],
                            "consoleErrors": local_errors,
                            "pageErrors": local_page_errors,
                            "failedLocalRequests": local_failed,
                        }
                        records.append(record)
                        console_errors.extend({"route": path, "width": width, "message": item} for item in local_errors)
                        page_errors.extend({"route": path, "width": width, "message": item} for item in local_page_errors)
                        failed_local_requests.extend({"route": path, "width": width, **item} for item in local_failed)
                    except Exception as error:
                        records.append({"locale": locale, "route": path, "width": width, "httpStatus": response.status if response else None, "error": str(error)})
                    finally:
                        await page.close()
        await browser.close()

    result = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "baseUrl": base_url,
        "tooling": {"python": sys.version.split()[0], "playwright": "Python package installed outside app dependencies", "browser": "Playwright Chromium"},
        "routesPerLocale": len(CORE_ROUTES) + len(PROJECTS),
        "locales": ["en", "ar"],
        "viewports": VIEWPORTS,
        "requiredCaptureCount": (len(CORE_ROUTES) + len(PROJECTS)) * 2 * len(VIEWPORTS),
        "actualCaptureCount": sum(1 for record in records if record.get("screenshot")),
        "consoleErrors": console_errors,
        "pageErrors": page_errors,
        "failedLocalRequests": failed_local_requests,
        "records": records,
    }
    (EVIDENCE / "visual-qa.json").write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (EVIDENCE / "captures.json").write_text(json.dumps({"screenshots": [record["screenshot"] for record in records if record.get("screenshot")]}, indent=2) + "\n", encoding="utf-8")
    return result


async def interactions(base_url: str) -> dict:
    checks = []
    browser_errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": HEIGHT})
        page.on("pageerror", lambda error: browser_errors.append(str(error)))

        await page.goto(base_url.rstrip("/") + "/en/portfolio", wait_until="networkidle")
        await page.wait_for_function("document.getElementById('preloader')?.classList.contains('isdone')")
        all_count = await page.locator(".portfolio-card").count()
        await page.get_by_role("button", name="Education", exact=True).click()
        education_count = await page.locator(".portfolio-card").count()
        edu_links = await page.locator(".portfolio-card a[href*='/projects/']").evaluate_all("els => els.map(el => el.getAttribute('href'))")
        checks.append({"name": "portfolio count and education filter", "allProjects": all_count, "educationProjects": education_count, "projectLinks": edu_links})

        category_counts = {"Education": education_count}
        for label in ("E-commerce", "Business systems", "Automation & integrations"):
            await page.get_by_role("button", name=label, exact=True).click()
            category_counts[label] = await page.locator(".portfolio-card").count()
        await page.get_by_role("button", name="All projects", exact=True).click()
        checks.append({"name": "all portfolio category filters", "counts": category_counts, "returnsToAll": await page.locator(".portfolio-card").count() == all_count})

        await page.get_by_role("link", name="View project: Schooly").first.click()
        await page.wait_for_url("**/en/projects/schooly")
        related_links = page.locator(".project-related a[href*='/projects/']")
        related_count = await related_links.count()
        if related_count:
            related_target = await related_links.first.get_attribute("href")
            await related_links.first.click()
            await page.wait_for_url(f"**{related_target}")
            await page.goto(base_url.rstrip("/") + "/en/projects/schooly", wait_until="networkidle")
        checks.append({"name": "related project navigation", "relatedLinks": related_count, "target": related_target if related_count else None, "navigated": bool(related_count)})
        switch = page.locator("a[lang='ar']").first
        await switch.click()
        await page.wait_for_url("**/ar/projects/schooly")
        await page.wait_for_function("document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl'")
        lang_state = await page.evaluate("({lang:document.documentElement.lang,dir:document.documentElement.dir})")
        checks.append({"name": "project card navigation and slug-preserving locale switch", "url": page.url, **lang_state})

        image_link = page.locator("a[data-fancybox='gallery']").first
        if await image_link.count():
            await image_link.click()
            dialog_open = await page.get_by_role("dialog").count() == 1
            await page.keyboard.press("Escape")
            dialog_closed = await page.get_by_role("dialog").count() == 0
            checks.append({"name": "project gallery lightbox and Escape dismissal", "opened": dialog_open, "closedWithEscape": dialog_closed})

        await page.set_viewport_size({"width": 390, "height": HEIGHT})
        await page.goto(base_url.rstrip("/") + "/ar/projects/nora-store", wait_until="networkidle")
        menu = page.get_by_role("button", name="فتح أو إغلاق القائمة")
        await menu.click()
        menu_open = "show" in (await page.locator(".navbar-collapse").get_attribute("class") or "")
        await page.keyboard.press("Escape")
        menu_closed = "show" not in (await page.locator(".navbar-collapse").get_attribute("class") or "")
        focused_menu = await menu.evaluate("el => document.activeElement === el")
        checks.append({"name": "mobile navigation and Escape focus restoration", "opened": menu_open, "closedWithEscape": menu_closed, "focusRestored": focused_menu})

        await page.goto(base_url.rstrip("/") + "/en/services", wait_until="networkidle")
        service_project_slugs = await page.locator(".service-project-links a").evaluate_all("els => els.map(el => new URL(el.href).pathname)")
        service_slides = await page.locator(".services-slider .swiper-slide").count()
        checks.append({"name": "service carousel and service-to-project links", "slides": service_slides, "links": service_project_slugs})

        await page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        await page.wait_for_timeout(150)
        await page.locator(".to_top").click()
        await page.wait_for_function("window.scrollY < 2")
        checks.append({"name": "back-to-top scroll control", "returnedToTop": await page.evaluate("window.scrollY < 2")})

        await page.goto(base_url.rstrip("/") + "/en/contact", wait_until="networkidle")
        form_valid = await page.locator("form").first.evaluate("form => form.checkValidity()")
        checks.append({"name": "contact empty required email validation", "emptyFormValid": form_valid})

        unknown_status = (await page.goto(base_url.rstrip("/") + "/en/projects/no-such-project", wait_until="networkidle")).status
        unknown_noindex = await page.locator("meta[name='robots']").evaluate_all("els => els.map(el => el.content)")
        notero_status = (await page.goto(base_url.rstrip("/") + "/projects/notero", wait_until="networkidle")).status
        checks.append({"name": "unknown and retired project routes", "unknownStatus": unknown_status, "unknownRobots": unknown_noindex, "unknownNoindex": any("noindex" in value for value in unknown_noindex), "noteroStatus": notero_status})

        for alias in ["/home-saas-technology.html", "/page-about-5.html", "/page-contact-5.html", "/page-portfolio-5.html", "/page-services-5.html", "/page-services-details-5.html", "/page-single-project-5.html"]:
            response = await page.goto(base_url.rstrip("/") + alias, wait_until="networkidle")
            checks.append({"name": "legacy alias", "route": alias, "status": response.status if response else None, "finalUrl": page.url})

        metadata_failures = []
        for locale in ("en", "ar"):
            for slug in PROJECTS:
                route = f"/{locale}/projects/{slug}"
                response = await page.goto(base_url.rstrip("/") + route, wait_until="domcontentloaded")
                title = await page.title()
                description = await page.locator("meta[name='description']").get_attribute("content")
                og_title = await page.locator("meta[property='og:title']").get_attribute("content")
                og_description = await page.locator("meta[property='og:description']").get_attribute("content")
                languages = await page.locator("link[rel='alternate'][hreflang]").evaluate_all("els => els.map(el => ({lang:el.hreflang,href:el.href}))")
                if not response or response.status != 200 or not title or not description or not og_title or not og_description or {item["lang"] for item in languages} != {"en", "ar"}:
                    metadata_failures.append({"route": route, "status": response.status if response else None, "title": bool(title), "description": bool(description), "openGraph": bool(og_title and og_description), "languages": languages})
        checks.append({"name": "localized metadata for all project routes", "routesChecked": len(PROJECTS) * 2, "failures": metadata_failures, "productionCanonicalConfigured": bool(__import__("os").environ.get("NEXT_PUBLIC_SITE_URL"))})

        await browser.close()
    return {"generatedAt": datetime.now(timezone.utc).isoformat(), "checks": checks, "pageErrors": browser_errors}


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:5192")
    parser.add_argument("--skip-matrix", action="store_true")
    parser.add_argument("--skip-interactions", action="store_true")
    args = parser.parse_args()

    assets = audit_assets()
    print(f"Asset audit: {assets['assetCount']} byte-identical images, {assets['totalBytes']} bytes; duplicate groups: {len(assets['duplicateImageGroups'])}")
    results = {}
    if not args.skip_matrix:
        results["matrix"] = await matrix(args.base_url)
        print(f"Viewport matrix: {results['matrix']['actualCaptureCount']}/{results['matrix']['requiredCaptureCount']} captures; console errors: {len(results['matrix']['consoleErrors'])}; failed local requests: {len(results['matrix']['failedLocalRequests'])}")
    if not args.skip_interactions:
        results["interactions"] = await interactions(args.base_url)
        (EVIDENCE / "interaction-qa.json").write_text(json.dumps(results["interactions"], indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Interaction checks: {len(results['interactions']['checks'])}; browser errors: {len(results['interactions']['pageErrors'])}")


if __name__ == "__main__":
    asyncio.run(main())
