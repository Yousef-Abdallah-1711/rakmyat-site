"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

type NavItem = { href: string; label: string; icon: ReactNode };

const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: <svg {...iconProps}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>,
  },
  {
    href: "/admin/blog",
    label: "Blog Posts",
    icon: <svg {...iconProps}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
  },
  {
    href: "/admin/media",
    label: "Media Library",
    icon: <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>,
  },
  {
    href: "/admin/blog/categories",
    label: "Categories",
    icon: <svg {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  },
  {
    href: "/admin/blog/tags",
    label: "Tags",
    icon: <svg {...iconProps}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" /><circle cx="7" cy="7" r="1.5" /></svg>,
  },
];

// The blog index is only "current" on its own route; /admin/blog/* sub-pages highlight their own link.
function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return href !== "/admin/blog" && pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-frame">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link href="/admin/inquiries" className="admin-sidebar-brand">
          <img src="/assets/rakmyat/brand/rakmyat-mark.webp" alt="" width="32" height="32" />
          <span>Rakmyat Admin</span>
        </Link>
        <p className="admin-sidebar-label">Management</p>
        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={`admin-sidebar-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <AdminSignOutButton />
        </div>
      </aside>
      <main className="admin-content admin-shell">{children}</main>
    </div>
  );
}
