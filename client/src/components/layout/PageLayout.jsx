import Navbar from './Navbar.jsx';

export default function PageLayout({ children, centered = false }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className={`main${centered ? ' main--centered' : ''}`}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
