import Link from "next/link";
import type { ReactNode } from "react";

export function TopPromotion() {
  return (
    <div className={"top-navbar style-5"}>
      {"\n        "}
      <div className={"container"}>
        {"\n            "}
        <div className={"content text-white"}>
          {"\n                "}
          <span className={"btn sm-butn bg-white py-0 px-2 me-2 fs-10px"}>
            {"\n                    "}
            <small className={"fs-10px"}>{"Special"}</small>
            {"\n                "}
          </span>
          {"\n                "}
          <img
            src={"/assets/img/icons/nav_icon/imoj_heart.png"}
            alt={""}
            className={"icon-15"}
          />
          {"\n                "}
          <span className={"fs-10px op-6"}>{"Get "}</span>
          {"\n                "}
          <small className={"op-10 fs-10px"}>{"20% Discount"}</small>
          {"\n                "}
          <span className={"fs-10px op-6"}>{"Get for New Account"}</span>
          {"\n                "}
          <Link
            href={"/contact"}
            className={"fs-10px text-decoration-underline ms-2"}
          >
            {"Register Now"}
          </Link>
          {"\n            "}
        </div>
        {"\n        "}
      </div>
      {"\n    "}
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
    <div className={"container"}>
      {"\n            "}
      <div className={"row gx-0 justify-content-between"}>
        {"\n                "}
        <div className={"col-lg-3 col-sm-6"}>
          {"\n                    "}
          <div className={"items"}>
            {"\n                        "}
            <div className={"title"}>
              {
                "\n                            Iteck - 1st eCommerce Dashboard\n                        "
              }
            </div>
            {"\n                        "}
            <small className={"text"}>
              {
                "\n                            Over 25 years working in IT services developing software applications and mobile apps for\n                            clients all over the world. For your very specific industry, "
              }
              <br />
              {
                " we have highly-tailored IT\n                            solutions.\n                        "
              }
            </small>
            {"\n                        "}
            <div className={"socail-icons"}>
              {"\n                            "}
              <a
                href={"https://twitter.com/"}
                className={
                  "icon-35 rounded-circle bg-gray overflow-hidden d-inline-flex align-items-center justify-content-center text-gray me-2"
                }
                target={"_blank"}
              >
                {"\n                                "}
                <i className={"fab fa-twitter"}></i>
                {"\n                            "}
              </a>
              {"\n                            "}
              <a
                href={"https://facebook.com/"}
                className={
                  "icon-35 rounded-circle bg-gray overflow-hidden d-inline-flex align-items-center justify-content-center text-gray me-2"
                }
                target={"_blank"}
              >
                {"\n                                "}
                <i className={"fab fa-facebook-f"}></i>
                {"\n                            "}
              </a>
              {"\n                            "}
              <a
                href={"https://instagram.com/"}
                className={
                  "icon-35 rounded-circle bg-gray overflow-hidden d-inline-flex align-items-center justify-content-center text-gray"
                }
                target={"_blank"}
              >
                {"\n                                "}
                <i className={"fab fa-instagram"}></i>
                {"\n                            "}
              </a>
              {"\n                        "}
            </div>
            {"\n                    "}
          </div>
          {"\n                "}
        </div>
        {"\n                "}
        <div className={"col-lg-3 col-sm-6"}>
          {"\n                    "}
          <div className={"items"}>
            {"\n                        "}
            <div className={"title"}>
              {
                "\n                            Information\n                        "
              }
            </div>
            {"\n                        "}
            <small className={"text mb-10 d-block"}>
              {"\n                            223 Thatcher Road St, Brookly, "}
              <br />
              {" Manhattan, NY 10463, US\n                        "}
            </small>
            {"\n                        "}
            <small className={"text mb-10 d-block"}>
              {
                "\n                            +031 5689 89 98\n                        "
              }
            </small>
            {"\n                        "}
            <small className={"text d-block"}>
              {
                "\n                            contact@Itecksolution.co\n                        "
              }
            </small>
            {"\n                    "}
          </div>
          {"\n                "}
        </div>
        {"\n                "}
        <div className={"col-lg-2"}>
          {"\n                    "}
          <div className={"items"}>
            {"\n                        "}
            <div className={"title"}>
              {
                "\n                            Useful Links\n                        "
              }
            </div>
            {"\n                        "}
            <ul>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/"}>{" Home "}</Link>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/about"}>{" About Iteck "}</Link>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/portfolio"}>{" Projects "}</Link>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/services/details"}>{" product "}</Link>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/portfolio"}>{" Blog "}</Link>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <Link href={"/contact"}>{" Contact "}</Link>
                {"\n                            "}
              </li>
              {"\n                        "}
            </ul>
            {"\n                    "}
          </div>
          {"\n                "}
        </div>
        {"\n                "}
        <div className={"col-lg-2"}>
          {"\n                    "}
          <div className={"items"}>
            {"\n                        "}
            <div className={"title"}>
              {
                "\n                            Resource\n                        "
              }
            </div>
            {"\n                        "}
            <ul>
              {"\n                            "}
              <li>
                {"\n                                "}
                <a href={"#"}>{" Online Documentation "}</a>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <a href={"#"}>{" Roadmap "}</a>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <a href={"#"}>{" Intergrations "}</a>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <a href={"#"}>{" FAQs "}</a>
                {"\n                            "}
              </li>
              {"\n                            "}
              <li>
                {"\n                                "}
                <a href={"#"}>{" Help Center "}</a>
                {"\n                            "}
              </li>
              {"\n                        "}
            </ul>
            {"\n                    "}
          </div>
          {"\n                "}
        </div>
        {"\n            "}
      </div>
      {"\n            "}
      <div className={"foot"}>
        {"\n                "}
        <div className={"row"}>
          {"\n                    "}
          <div className={"col-lg-3 col-sm-6"}>
            {"\n                        "}
            <div className={"logo"}>
              {"\n                            "}
              <img src={"/assets/img/logo_foot_home5.png"} alt={""} />
              {"\n                        "}
            </div>
            {"\n                    "}
          </div>
          {"\n                    "}
          <div className={"col-lg-6"}>
            {"\n                        "}
            <small className={"small"}>
              {"\n                            © 2023 Copyrights by "}
              <a href={"#"} className={"fw-bold text-decoration-underline"}>
                {"Iteck Co."}
              </a>
              {
                " All\n                            Rights Reserved. Designed by "
              }
              <a
                href={"https://themeforest.net/user/themescamp"}
                className={"fw-bold text-decoration-underline"}
              >
                {"ThemesCamp"}
              </a>
              {"\n                        "}
            </small>
            {"\n                    "}
          </div>
          {"\n                "}
        </div>
        {"\n            "}
      </div>
      {"\n        "}
    </div>
  );
}
