import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).parent
before = json.loads((ROOT / "before-captures.json").read_text(encoding="utf-8"))
after = json.loads((ROOT / "after-captures.json").read_text(encoding="utf-8"))
comparisons = []

for old in before["captures"]:
    new = next(item for item in after["captures"] if item["route"] == old["route"] and item["viewportWidth"] == old["viewportWidth"] and item["kind"] == old["kind"])
    old_path = ROOT / old["path"]
    new_path = ROOT / new["path"]
    if old["kind"] == "hero":
        row = {"route": old["route"], "width": old["viewportWidth"], "region": "hero", "intentionalDifference": True, "beforeHeight": old["heroHeight"], "afterHeight": new["heroHeight"]}
        with Image.open(old_path) as old_img, Image.open(new_path) as new_img:
            row["beforeDimensions"] = list(old_img.size)
            row["afterDimensions"] = list(new_img.size)
            row["pixelMetric"] = "not compared; both hero design and copy are intentionally swapped"
        comparisons.append(row)
        continue

    with Image.open(old_path).convert("RGB") as old_img, Image.open(new_path).convert("RGB") as new_img:
        old_bottom = old["heroTop"] + old["heroHeight"]
        new_bottom = new["heroTop"] + new["heroHeight"]
        old_crop = old_img.crop((0, old_bottom, old_img.width, old_img.height))
        new_crop = new_img.crop((0, new_bottom, new_img.width, new_img.height))
        same_size = old_crop.size == new_crop.size
        if not same_size:
            height = min(old_crop.height, new_crop.height)
            old_crop = old_crop.crop((0, 0, old_crop.width, height))
            new_crop = new_crop.crop((0, 0, new_crop.width, height))
        diff = ImageChops.difference(old_crop, new_crop)
        channel_means = ImageStat.Stat(diff).mean
        comparisons.append({
            "route": old["route"],
            "width": old["viewportWidth"],
            "region": "page content below hero, aligned to each hero's bottom edge",
            "intentionalDifference": False,
            "beforeHeroHeight": old["heroHeight"],
            "afterHeroHeight": new["heroHeight"],
            "beforeCropSize": [old_img.width, old_img.height - (old["heroTop"] + old["heroHeight"])],
            "afterCropSize": [new_img.width, new_img.height - (new["heroTop"] + new["heroHeight"])],
            "sameCropSize": same_size,
            "comparedSize": list(old_crop.size),
            "meanAbsoluteChannelDifference": round(sum(channel_means) / len(channel_means), 5),
        })

report = {
    "method": "Full-page screenshots were cropped at each page's hero bottom; post-hero regions are aligned and compared independently of intentional hero height changes. Hero screenshots are retained for visual review and are not pixel-compared because their content/design is intentionally swapped.",
    "viewports": [1440, 1280, 768, 390],
    "comparisons": comparisons,
}
(ROOT / "visual-comparison.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
for item in comparisons:
    if item["region"].startswith("page content"):
        print(item["route"], item["width"], "MAE", item["meanAbsoluteChannelDifference"], "same-sized", item["sameCropSize"])
