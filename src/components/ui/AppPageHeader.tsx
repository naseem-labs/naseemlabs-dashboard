interface AppPageHeaderProps {
  title: string;
  subtitle: string;
}

export function AppPageHeader({ title, subtitle }: AppPageHeaderProps) {
  return (
    <header className="app-page-header">
      <h1 className="app-page-header__title">{title}</h1>
      <p className="app-page-header__subtitle">{subtitle}</p>
    </header>
  );
}
