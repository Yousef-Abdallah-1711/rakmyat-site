"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const loader = document.getElementById("preloader");
    loader?.classList.remove("isdone");
    const loaderTimer = window.setTimeout(
      () => loader?.classList.add("isdone"),
      reduceMotion ? 0 : 350,
    );

    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      document
        .querySelectorAll<HTMLElement>(".navbar")
        .forEach((nav) => nav.classList.toggle("nav-scroll", scrollTop > 200));
      document
        .querySelectorAll<HTMLElement>(".to_top")
        .forEach((button) => button.classList.toggle("show", scrollTop > 700));
    };
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );
    document
      .querySelectorAll<HTMLElement>(".wow")
      .forEach((node) => {
        if (reduceMotion) node.classList.add("animated");
        else revealObserver.observe(node);
      });

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          const destination = Number.parseInt(
            node.textContent?.replace(/[^0-9]/g, "") ?? "0",
            10,
          );
          if (reduceMotion) {
            node.textContent = String(destination);
            observer.unobserve(node);
            continue;
          }
          if (destination) {
            const duration = 2000;
            const started = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - started) / duration, 1);
              node.textContent = String(Math.floor(destination * progress));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 },
    );
    document
      .querySelectorAll<HTMLElement>(".counter")
      .forEach((node) => counterObserver.observe(node));

    return () => {
      window.clearTimeout(loaderTimer);
      window.removeEventListener("scroll", updateScrollState);
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div id="preloader" aria-hidden="true">
      <div id="loading-wrapper" className="show">
        <div id="loading-text">
          <img src="/assets/img/logo_loading.png" alt="" />
        </div>
        <div id="loading-content" />
      </div>
    </div>
  );
}
