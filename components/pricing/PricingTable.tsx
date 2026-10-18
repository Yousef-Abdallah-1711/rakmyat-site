import Link from "next/link";
import { PricingPeriodInput } from "@/components/sections/PricingPeriod";
import {
  pricingCopy,
  pricingFeatures,
  pricingPlans,
  type PricingValue,
} from "@/content/pricing";

export function PricingIntro() {
  return (
    <div className="section-head text-center mb-60 style-5">
      <h2 className="mb-20">
        {` ${pricingCopy.heading} `}
        <span>{` ${pricingCopy.headingAccent} `}</span>{" "}
      </h2>
      <p>{pricingCopy.description}</p>
    </div>
  );
}

export function PricingControls() {
  return (
    <div className="pricing-tabsHead text-center">
      <div className="price-radios">
        <div className="form-check form-check-inline">
          <PricingPeriodInput
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="monthly-input"
            value="option1"
          />
          <label className="form-check-label" htmlFor="monthly-input">
            {` ${pricingCopy.monthlyLabel} `}
          </label>
        </div>
        <div className="form-check form-check-inline">
          <PricingPeriodInput
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="yearly-input"
            value="option2"
          />
          <label className="form-check-label" htmlFor="yearly-input">
            {` ${pricingCopy.yearlyLabel} `}
            <small className="alert-danger text-danger rounded-pill ms-1">
              {pricingCopy.yearlyDiscount}
            </small>
          </label>
        </div>
      </div>
    </div>
  );
}

export function PricingPlanHeader() {
  return (
    <div className="price-head">
      <div className="price-headTitle">
        <img src="/assets/img/icons/price_s5.png" alt="" />
      </div>
      {pricingPlans.map((plan) => (
        <div
          className={`price-headItem${plan.featured ? " bg-gray5" : ""}`}
          key={plan.id}
        >
          <h6>{plan.desktopName}</h6>
          <h2 className={`monthly_price${plan.featured ? " color-blue5" : ""}`}>
            {plan.monthlyPrice} <span>/mo</span>
          </h2>
          <h2 className={`yearly_price${plan.featured ? " color-blue5" : ""}`}>
            {plan.yearlyPrice} <span>/yr</span>
          </h2>
          <small>{plan.caption}</small>
          <small>{plan.note}</small>
          {plan.featured && <div className="label">best choice</div>}
        </div>
      ))}
    </div>
  );
}

function FeatureValue({ value }: { value: PricingValue }) {
  if (value === true) return <i className="bi bi-check2"></i>;
  if (typeof value === "string") return <span>{value}</span>;
  return null;
}

export function PricingFeatureRows({
  variant,
}: {
  variant: "home" | "services";
}) {
  return (
    <div className="price-body">
      {pricingFeatures.map((feature) => (
        <div className="price-bodyItems" key={feature.id}>
          <div className="price-bodyTitle">
            {feature.label}
            {feature.tooltip &&
              (variant === "home" ? (
                <div className="pop-info">
                  <i className="fas fa-info-circle bttn-info"></i>
                  <div className="hidden_content">
                    <div className="title">{feature.label}</div>
                    <small className="small color-777 lh-5">
                      {feature.tooltip}
                    </small>
                  </div>
                </div>
              ) : (
                <i className="fas fa-info-circle"></i>
              ))}
          </div>
          {feature.values.map((value, index) => (
            <div
              className={`price-item${index === 1 ? " bg-gray5" : ""}`}
              key={pricingPlans[index].id}
            >
              <FeatureValue value={value} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function PricingPlanFooter() {
  return (
    <div className="price-foot">
      <div className="price-footTitle"></div>
      {pricingPlans.map((plan) => (
        <div
          className={`price-footItem${plan.featured ? " bg-gray5" : ""}`}
          key={plan.id}
        >
          <Link
            href="/contact"
            className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
          >
            <span>{` ${pricingCopy.planCta} `}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

export function PricingMobileTable() {
  return (
    <div className="mob-table d-block d-lg-none mt-5">
      <div className="mob-table-title">
        <div className="row gx-0">
          {pricingPlans.map((plan) => (
            <div className="col-4" key={plan.id}>
              <div className="title-item">
                <h6>{` ${plan.mobileName} `}</h6>
                <h4 className="monthly_price">
                  {` ${plan.monthlyPrice} `} <span>/mo</span>
                </h4>
                <h4 className="yearly_price">
                  {` ${plan.yearlyPrice} `} <span>/yr</span>
                </h4>
                <p>
                  {` ${plan.caption} `}
                  <br />
                  {` ${plan.note} `}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mob-table-body">
        {pricingFeatures.map((feature) => (
          <div className="table-row" key={feature.id}>
            <h5>{` ${feature.label} `}</h5>
            <div className="row gx-0">
              {feature.values.map((value, index) => (
                <div className="col-4" key={pricingPlans[index].id}>
                  <div className="price-item">
                    {value === true ? (
                      <i className="bi bi-check2"></i>
                    ) : typeof value === "string" ? (
                      <span>{` ${value} `}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mob-table-foot">
        <div className="row gx-0">
          {pricingPlans.map((plan) => (
            <div className="col-4" key={plan.id}>
              <div className="title-item">
                <h6>{` ${plan.mobileName} `}</h6>
                <Link
                  href="/contact"
                  className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                >
                  <span>{` ${pricingCopy.planCta} `}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
