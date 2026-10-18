import Link from "next/link";
import type { ReactNode } from "react";
import {
  footerContent,
  promotionContent,
  siteSettings,
} from "@/content/site";

export function TopPromotion() {
  return (
    <div className="top-navbar style-5">
      <div className="container">
        <div className="content text-white">
          <span className="btn sm-butn bg-white py-0 px-2 me-2 fs-10px">
            <small className="fs-10px">{promotionContent.badge}</small>
          </span>
          {"  "}
          <img
            src="/assets/img/icons/nav_icon/imoj_heart.png"
            alt=""
            className="icon-15"
          />
          {" "}
          <span className="fs-10px op-6">{promotionContent.lead}</span>
          {" "}
          <small className="op-10 fs-10px">{promotionContent.discount}</small>
          {" "}
          <span className="fs-10px op-6">{promotionContent.audience}</span>
          {" "}
          <Link
            href={promotionContent.cta.href}
            className="fs-10px text-decoration-underline ms-2"
          >
            {promotionContent.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({
  children,
  bordered = false,
}: {
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <footer className={`style-5${bordered ? " border-top brd-gray" : ""}`}>
      {children}
    </footer>
  );
}

export function FooterContent() {
  return (
    <div className="container">
      <div className="row gx-0 justify-content-between">
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div className="title">{footerContent.brandTitle}</div>
            <small className="text">
              {footerContent.descriptionLead}
              <br /> {footerContent.descriptionTail}
            </small>
            <div className="socail-icons">
              {footerContent.socialLinks.map((social, index) => (
                <a
                  href={social.href}
                  className={`icon-35 rounded-circle bg-gray overflow-hidden d-inline-flex align-items-center justify-content-center text-gray${index < footerContent.socialLinks.length - 1 ? " me-2" : ""}`}
                  target="_blank"
                  aria-label={social.label}
                  key={social.label}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
            {"\n \n "}
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="items">
            <div className="title">{footerContent.informationTitle}</div>
            <small className="text mb-10 d-block">
              {siteSettings.addressLines[0]}
              <br /> {siteSettings.addressLines[1]}
            </small>
            <small className="text mb-10 d-block">{siteSettings.phone}</small>
            <small className="text d-block">{siteSettings.email}</small>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="items">
            <div className="title">{footerContent.usefulLinksTitle}</div>
            <ul>
              {footerContent.usefulLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href}>{` ${label} `}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="items">
            <div className="title">{footerContent.resourceLinksTitle}</div>
            <ul>
              {footerContent.resourceLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href}>{` ${label} `}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="foot">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="logo">
              <img src={siteSettings.footerLogo} alt="" />
            </div>
          </div>
          <div className="col-lg-6">
            <small className="small">
              {footerContent.copyrightLabel}{" "}
              <a href="#" className="fw-bold text-decoration-underline">
                {footerContent.copyrightCompany}
              </a>
              {" All Rights Reserved. Designed by "}
              <a
                href={footerContent.designedBy.href}
                className="fw-bold text-decoration-underline"
              >
                {footerContent.designedBy.label}
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
