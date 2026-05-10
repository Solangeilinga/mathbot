export default function Header({ xp, user, onLogout }) {
  const initials = user ? `${user.prenom?.[0]??""}${user.nom?.[0]??""}`.toUpperCase() : "??";
  return (
    <header className="header">
      <div className="header-logo"><span className="bepc">BEPC</span><span className="math">Math AI</span></div>
      <div className="header-right">
        <div className="xp-badge">⬡ <span>{xp??0}</span> XP</div>
        <div className="user-info">
          <span className="user-name-text">{user?.prenom}</span>
          <div className="avatar">{initials}</div>
        </div>
        {onLogout && <button className="logout-btn" onClick={onLogout} title="Déconnexion">⎋</button>}
      </div>
    </header>
  );
}
