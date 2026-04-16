import './Header.css';

export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__text">
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header__glow" />
    </header>
  );
}
