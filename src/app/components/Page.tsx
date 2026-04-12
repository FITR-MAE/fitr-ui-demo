import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
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

export function PageHeader({ title, leading, trailing }: PageHeaderProps) {
  return <header className="app-page-header"></header>;
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <div>
      {children}
      {/* <section className={cx("app-surface", className)}></section>; */}
    </div>
  );
}
