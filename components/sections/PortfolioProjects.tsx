"use client";

import { useState } from "react";
import Link from "next/link";
import { portfolioPageContent, portfolioProjects } from "@/content/portfolio";

export function PortfolioProjects() {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <div className="controls" role="group" aria-label="Filter projects">
        {portfolioPageContent.filters.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            className={`control${filter === id ? " control-active" : ""}`}
          data-filter={id === "all" ? "all" : `.${id}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="portfolio style-1">
        <div className="content">
          <div className="row mix-container">
            {portfolioProjects.map((project, index) => {
              const visible =
                filter === "all" || project.categories.includes(filter);
              return (
                <div
                  className={`col-lg-4 mix ${project.categories.join(" ")}`}
                  key={project.title}
                  hidden={!visible}
                >
                  <div className={`portfolio-card${index < 8 ? " mb-50" : ""}`}>
                    <div className="img">
                      <img src={project.image} alt="" />
                    </div>
                    <div className="info">
                      <h5>
                        <Link href="/projects/notero">{project.title}</Link>
                      </h5>
                      <small className="d-block color-main text-uppercase">
                        {project.type}
                      </small>
                      <div className="text">
                        {portfolioPageContent.cardDescription}
                      </div>
                      <div className="tags">
                        {project.tags.map((tag) => (
                          <a href="#" key={tag}>
                            {tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/portfolio"
            className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-30"
          >
            <span>Load More (24)</span>
          </Link>
        </div>
      </section>
    </>
  );
}
