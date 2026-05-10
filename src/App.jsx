// App.jsx
import { useState } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import SessionPage from "./components/SessionPage";
import AnnalesPage from "./components/AnnalesPage";
import ExamSimulationPage from "./components/ExamSimulationPage";
import Toast from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { useProgression } from "./hooks/useProgression";

// Utilisateur unique — pas de système d'authentification
const USER = {
  id: "dev-user-id",
  nom: "Sawadogo",
  prenom: "Candide",
  email: "candide@bepcmath.bf",
  xp: 0,
  niveau: 1,
};

export default function App() {
  const [activePage, setActivePage]         = useState("dashboard");
  const [currentChapter, setCurrentChapter] = useState("Probabilités");
  const [user, setUser]                     = useState(USER);
  const { toast, showToast }                = useToast();
  const { chapitres, stats, loading: progLoading, refetch } = useProgression();

  const handleXPUpdate = (newXP, newNiveau) => {
    setUser(prev => ({ ...prev, xp: newXP, niveau: newNiveau ?? prev.niveau }));
    showToast(`+XP — Total : ${newXP} XP 🎉`);
    refetch();
  };

  const goToChapter = (ch, isExam = false) => {
    setCurrentChapter(ch);
    if (isExam) {
      setActivePage("exam");
      showToast(`Simulation d'examen lancée : ${ch}`);
    } else {
      setActivePage("session");
      showToast(`Chapitre : ${ch}`);
    }
  };

  const exitExam = () => {
    setActivePage("annales");
    showToast("Examen terminé !");
  };

  return (
    <div className="app-root">
      <Nav activePage={activePage} setActivePage={setActivePage} />
      <Header xp={user.xp} user={user} />
      <main className="main-content">
        {activePage === "dashboard" && (
          <Dashboard
            onChapterClick={goToChapter}
            user={user}
            chapitres={chapitres}
            stats={stats}
            loading={progLoading}
          />
        )}
        {activePage === "session" && (
          <SessionPage
            currentChapter={currentChapter}
            setCurrentChapter={setCurrentChapter}
            onXPUpdate={handleXPUpdate}
            showToast={showToast}
            user={user}
            chapitres={chapitres}
          />
        )}
        {activePage === "annales" && (
          <AnnalesPage
            onStartExam={(ch) => goToChapter(ch, true)}
            showToast={showToast}
            chapitres={chapitres}
          />
        )}
        {activePage === "exam" && (
          <ExamSimulationPage
            chapter={currentChapter}
            onExit={exitExam}
            showToast={showToast}
            user={user}
          />
        )}
      </main>
      <Toast message={toast} />
    </div>
  );
}