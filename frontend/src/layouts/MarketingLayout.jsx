import { Outlet } from "react-router-dom";
import { SiteHeader } from "../components/nav/SiteHeader.jsx";

export function MarketingLayout() {
  return (
    <div className="min-h-full bg-[var(--vv-bg)] text-[var(--vv-text)]">
      <SiteHeader />
      <main className="pt-[72px]">
        <Outlet />
      </main>
    </div>
  );
}
