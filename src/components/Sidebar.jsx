import MemoryCard from "./MemoryCard";
const CHAPTERS_ORDER = ["Probabilités","Géométrie","Algèbre","Fonctions","Statistiques","Trigonométrie"];
export default function Sidebar({ currentChapter, setCurrentChapter, showToast, user, chapitres }) {
  const initials = user ? `${user.prenom?.[0]??""}${user.nom?.[0]??""}`.toUpperCase() : "??";
  const xp = user?.xp||0; const niveau = user?.niveau||1;
  const getScore = (ch) => chapitres?.find(c=>c.name===ch)?.score??0;
  const pctClass = (s) => s>=75?"green":s>=55?"orange":"red";
  return (
    <aside className="sidebar">
      <div className="sidebar-user-circle">{initials}</div>
      <div className="sidebar-username">{user?.prenom} {user?.nom}</div>
      <div className="sidebar-level">Niveau {niveau} · {xp} XP</div>
      <div className="level-bar"><div className="level-fill" style={{width:`${xp%100}%`}}/></div>
      <div className="sidebar-section-label">Chapitres</div>
      {CHAPTERS_ORDER.map(ch => {
        const s = getScore(ch);
        return (
          <div key={ch} className={`sidebar-item ${currentChapter===ch?"active":""}`} onClick={() => { setCurrentChapter(ch); showToast(`Chapitre : ${ch}`); }}>
            <span>{ch}</span>
            <span className={`sidebar-pct ${currentChapter!==ch?pctClass(s):""}`}>{s}%</span>
          </div>
        );
      })}
      <MemoryCard currentChapter={currentChapter} />
    </aside>
  );
}
