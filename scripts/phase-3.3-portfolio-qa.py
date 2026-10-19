"""Focused portfolio visual evidence for Phase 3.3 (uses existing Python Playwright)."""

from __future__ import annotations

import argparse
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "phase-3.3"
WIDTHS = (1440, 1280, 768, 390)
HEIGHT = 960
ROUTES = (
    ("en-portfolio", "/en/portfolio", ".portfolio.style-1"),
    ("ar-portfolio", "/ar/portfolio", ".portfolio.style-1"),
    ("en-home", "/en", ".featured-work-strip"),
    ("ar-home", "/ar", ".featured-work-strip"),
)


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:5191")
    parser.add_argument("--stage", choices=("before", "after"), required=True)
    args = parser.parse_args()
    out_dir = EVIDENCE / args.stage
    out_dir.mkdir(parents=True, exist_ok=True)
    records: list[dict] = []
    interactions: dict = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(device_scale_factor=1)
        for key, route, target_selector in ROUTES:
            for width in WIDTHS:
                page = await context.new_page()
                await page.set_viewport_size({"width": width, "height": HEIGHT})
                errors: list[str] = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                response = await page.goto(args.base_url.rstrip("/") + route, wait_until="networkidle")
                await page.evaluate("document.fonts.ready")
                await page.wait_for_timeout(450)
                target = page.locator(target_selector).first
                await target.scroll_into_view_if_needed()
                await page.wait_for_timeout(150)
                metrics = await page.evaluate("""(selector) => {
                  const rect = (element) => {
                    const r = element.getBoundingClientRect();
                    const c = getComputedStyle(element);
                    return {x:Math.round(r.x), y:Math.round(r.y), width:Math.round(r.width), height:Math.round(r.height),
                      display:c.display, padding:c.padding, gap:c.gap, maxWidth:c.maxWidth, fontSize:c.fontSize};
                  };
                  const target = document.querySelector(selector);
                  const cards = [...document.querySelectorAll('.portfolio-card')];
                  const portfolioImages = [...document.querySelectorAll('.portfolio-card .portfolio-project-image')];
                  const homeCards = [...document.querySelectorAll('.featured-work-strip .swiper-slide')];
                  const images = [...document.querySelectorAll('.portfolio-card .portfolio-project-image img, .featured-work-strip img')];
                  const grid = document.querySelector('.portfolio.style-1 .mix-container');
                  const sample = (element) => ({...rect(element), className:element.className,
                    title:element.querySelector('h5')?.innerText || element.querySelector('strong')?.innerText || '',
                    category:element.querySelector('.info small')?.innerText || element.querySelector('small')?.innerText || '',
                    summary:element.querySelector('.info .text')?.innerText || '',
                    titleFontSize:element.querySelector('h5') ? getComputedStyle(element.querySelector('h5')).fontSize : null,
                    categoryFontSize:element.querySelector('.info small, small') ? getComputedStyle(element.querySelector('.info small, small')).fontSize : null,
                    summaryFontSize:element.querySelector('.info .text') ? getComputedStyle(element.querySelector('.info .text')).fontSize : null,
                    image:element.querySelector('img') ? {src:new URL(element.querySelector('img').getAttribute('src'), location.href).pathname,
                      ...rect(element.querySelector('img')), objectFit:getComputedStyle(element.querySelector('img')).objectFit,
                      naturalWidth:element.querySelector('img').naturalWidth, naturalHeight:element.querySelector('img').naturalHeight} : null});
                  return {viewport:{width:innerWidth,height:innerHeight}, documentWidth:document.documentElement.scrollWidth,
                    target:rect(target), grid:grid ? {...rect(grid), className:grid.className} : null,
                    cards:cards.slice(0,4).map(sample), cardCount:cards.length,
                    featuredCards:homeCards.slice(0,4).map(sample), featuredCount:homeCards.length,
                    imageContainerCount:portfolioImages.length,
                    images:images.map(img=>({complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})),
                    bootstrapColumns:[...document.querySelectorAll('.portfolio-card')].slice(0,3).map(card=>card.parentElement.className),
                    direction:document.documentElement.dir, language:document.documentElement.lang};
                }""", target_selector)
                shot = out_dir / f"{key}-{width}.png"
                await target.screenshot(path=str(shot), animations="disabled")
                records.append({"route":route,"width":width,"status":response.status if response else None,
                    "screenshot":shot.relative_to(EVIDENCE).as_posix(),"pageErrors":errors,**metrics})
                await page.close()

        page = await context.new_page()
        await page.set_viewport_size({"width": 1440, "height": HEIGHT})
        await page.goto(args.base_url.rstrip("/") + "/en/portfolio", wait_until="networkidle")
        group = page.get_by_role("group", name="Filter projects")
        filter_buttons = group.get_by_role("button")
        labels = [text.strip() for text in await filter_buttons.all_text_contents()]
        counts = {}
        for index, label in enumerate(labels):
            await filter_buttons.nth(index).click()
            counts[label] = await page.locator(".portfolio-card").count()
        await filter_buttons.first.click()
        first_card = page.locator(".portfolio-card").first
        image = first_card.locator(".portfolio-project-image img")
        initial_transform = await image.evaluate("element => getComputedStyle(element).transform")
        await first_card.hover()
        await page.wait_for_timeout(600)
        hover_transform = await image.evaluate("element => getComputedStyle(element).transform")
        first_project_href = await first_card.locator(".info h5 a").get_attribute("href")
        portfolio_unique_routes = sorted(set(await page.locator(".portfolio-card .info h5 a").evaluate_all("els => els.map(e => e.getAttribute('href'))")))
        interactions["portfolio"] = {"filters": counts, "allProjects": len(portfolio_unique_routes),
            "allLinksUnique": len(portfolio_unique_routes) == 9, "firstProjectHref": first_project_href,
            "hoverAnimationChangedTransform": initial_transform != hover_transform,
            "initialTransform": initial_transform, "hoverTransform": hover_transform}
        await page.locator(".portfolio-card .info h5 a").first.click()
        await page.wait_for_url("**/en/projects/schooly")
        interactions["englishProjectNavigation"] = {"url":page.url,
            "heading":await page.locator("h1").first.inner_text(),
            "passed":page.url.endswith("/en/projects/schooly")}
        await page.goto(args.base_url.rstrip("/") + "/ar/portfolio", wait_until="networkidle")
        await page.locator(".portfolio-card .info h5 a").first.click()
        await page.wait_for_url("**/ar/projects/schooly")
        interactions["arabicProjectNavigation"] = {"url":page.url,
            "heading":await page.locator("h1").first.inner_text(),
            "passed":page.url.endswith("/ar/projects/schooly")}

        await page.goto(args.base_url.rstrip("/") + "/en", wait_until="networkidle")
        featured = await page.evaluate("""() => [...new Set([...document.querySelectorAll('.featured-work-strip .featured-work-link')]
          .map(link => new URL(link.href).pathname))]""")
        interactions["featuredProjects"] = {"uniqueProjectRoutes": sorted(featured), "uniqueCount": len(featured)}

        for route, width in (("/en/portfolio", 768), ("/en/portfolio", 390), ("/ar/portfolio", 1440), ("/ar/portfolio", 390)):
            await page.set_viewport_size({"width":width,"height":HEIGHT})
            await page.goto(args.base_url.rstrip("/") + route, wait_until="networkidle")
            positions = await page.locator(".portfolio-card").evaluate_all("els => els.slice(0,2).map(e => {const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}})")
            interactions[f"{route}-{width}"] = {"dir":await page.locator("html").get_attribute("dir"),
                "scrollWidth":await page.evaluate("document.documentElement.scrollWidth"),
                "cardPositions":positions,"twoColumns":len(positions)>1 and positions[0]["y"]==positions[1]["y"],
                "oneColumn":len(positions)>1 and positions[0]["y"]<positions[1]["y"]}
        await page.close()
        await browser.close()

    result = {"stage":args.stage,"generatedAt":datetime.now(timezone.utc).isoformat(),
      "baseUrl":args.base_url,"viewportHeight":HEIGHT,"records":records,"interactions":interactions}
    (EVIDENCE / f"{args.stage}-metrics.json").write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps({"stage":args.stage,"captures":len(records),"metrics":str(EVIDENCE / f"{args.stage}-metrics.json")},indent=2))


if __name__ == "__main__":
    asyncio.run(main())
