import type { ReactNode } from "react";

import { cn } from "./ui/utils";

type PageShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, contentClassName }: PageShellProps) {
  return <div className={cn("app-page", contentClassName)}>{children}</div>;
}

export function PageHeader({ title, subtitle, leading, trailing }: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div className="app-page-header-inner">
        <div className="flex min-w-0 items-center gap-2">
          {leading}
          {title ? (
            <div className="min-w-0">
              <h1 className="app-page-title truncate">{title}</h1>
              {subtitle ? <p className="app-page-subtitle truncate">{subtitle}</p> : null}
            </div>
          ) : null}
        </div>
        {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
      </div>
    </header>
  );
}

export function PageSection({ children, className }: PageSectionProps) {
  return <section className={cn("app-surface", className)}>{children}</section>;
}