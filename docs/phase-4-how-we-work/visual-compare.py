import asyncio
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
from playwright.async_api import async_playwright

BASE_URL = "http://127.0.0.1:5210"
ROOT = Path(__file__).parent
WIDTHS = (1440, 1280, 768, 390)


async def main():
    comparisons = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for locale in ("en", "ar"):
            for width in WIDTHS:
                page = await browser.new_page(viewport={"width": width, "height": 1000}, device_scale_factor=1)
                await page.goto(f"{BASE_URL}/{locale}", wait_until="domcontentloaded")
                await page.wait_for_timeout(300)
                insertion_top = await page.locator('section[aria-labelledby="how-we-work-home-title"]').evaluate(
                    "element => Math.round(element.getBoundingClientRect().top + window.scrollY)"
                )
                await page.close()

                before_path = ROOT / "screenshots" / "before" / f"{locale}-{width}.png"
                after_path = ROOT / "screenshots" / "after" / "home" / f"{locale}-{width}.png"
                with Image.open(before_path).convert("RGB") as before, Image.open(after_path).convert("RGB") as after:
                    height = min(insertion_top, before.height, after.height)
                    before_crop = before.crop((0, 0, before.width, height))
                    after_crop = after.crop((0, 0, after.width, height))
                    difference = ImageChops.difference(before_crop, after_crop)
                    stats = ImageStat.Stat(difference)
                    mae = sum(stats.mean) / len(stats.mean)
                    comparison = {
                        "route": f"/{locale}",
                        "viewportWidth": width,
                        "comparedRegion": f"0..{height}px before the new section",
                        "meanAbsoluteChannelDifference": round(mae, 4),
                        "changedPixelsBoundingBox": difference.getbbox(),
                    }
                    comparisons.append(comparison)
                    print(comparison)
        await browser.close()

    report = {
        "method": "Pixel comparison of the pre-insertion and final Home captures, cropped from the document top to the new How We Work section. The inserted section is excluded.",
        "baseline": "screenshots/before/",
        "after": "screenshots/after/home/",
        "comparisons": comparisons,
    }
    (ROOT / "visual-regression.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
