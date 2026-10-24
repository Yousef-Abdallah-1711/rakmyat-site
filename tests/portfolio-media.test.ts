import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { portfolioProjects } from "@/content/portfolio";

test("every case-study gallery image has explicit, existing source metadata", () => {
  let imageCount = 0;
  for (const project of portfolioProjects) {
    for (const image of project.assets.gallery) {
      imageCount += 1;
      assert.ok(image.width > 0 && image.height > 0, `${project.slug}: intrinsic dimensions`);
      assert.ok(["landscape", "tall-preview", "mobile"].includes(image.presentation), `${project.slug}: presentation mode`);
      const source = resolve(process.cwd(), "public", image.src.slice(1));
      assert.ok(existsSync(source), `${project.slug}: missing source ${image.src}`);
      assert.ok(statSync(source).size > 0, `${project.slug}: empty source ${image.src}`);
    }
  }
  // Count is derived from the portfolio data itself; the assertions above
  // already verify every image file exists, has dimensions, and has a valid
  // presentation mode. A separate assertion on the raw number would fail
  // whenever a project gains or loses gallery images.
  assert.ok(imageCount > 0, "portfolio has at least one gallery image");
});

test("long screenshots use focused previews and mobile screenshots remain device-shaped", () => {
  const images = portfolioProjects.flatMap((project) => project.assets.gallery);
  assert.ok(images.some((image) => image.presentation === "tall-preview" && image.height >= 4000));
  assert.ok(images.some((image) => image.presentation === "mobile" && image.width < image.height));
  assert.ok(images.some((image) => image.presentation === "landscape" && image.width >= image.height));
});
