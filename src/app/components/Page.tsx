import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
};

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function PageShell({ children, contentClassName }: PageShellProps) {
  return <div className={cx("app-page", contentClassName)}>{children}</div>;
}

export function PageHeader({ title, trailing }: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div className="app-page-header-inner">
        <div className="min-w-0">
          <h1 className="app-page-title">{title}</h1>
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </header>
  );
}

export function PageSection({ children, className }: PageSectionProps) {
  return <section className={cx("app-surface", className)}>{children}</section>;
}
