"use client";

import {
  createContext,
  InputHTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type Period = "monthly" | "yearly";
const PricingPeriodContext = createContext<{
  period: Period;
  setPeriod: (period: Period) => void;
} | null>(null);

export function PricingPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>("yearly");
  const pathname = usePathname();
  useEffect(() => setPeriod("yearly"), [pathname]);
  return (
    <PricingPeriodContext.Provider value={{ period, setPeriod }}>
      <div className={`pricing-period pricing-period--${period}`}>
        {children}
      </div>
    </PricingPeriodContext.Provider>
  );
}

type PeriodInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "onChange"
> & { id: "monthly-input" | "yearly-input" };
export function PricingPeriodInput({ id, ...props }: PeriodInputProps) {
  const context = useContext(PricingPeriodContext);
  if (!context)
    throw new Error(
      "PricingPeriodInput must be rendered inside PricingPeriodProvider",
    );
  const period = id === "monthly-input" ? "monthly" : "yearly";
  return (
    <input
      {...props}
      id={id}
      checked={context.period === period}
      onChange={() => context.setPeriod(period)}
    />
  );
}
