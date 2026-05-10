import { useState } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import SessionPage from "./components/SessionPage";
import AnnalesPage from "./components/AnnalesPage";
import ExamSimulationPage from "./components/ExamSimulationPage";
import LoginPage from "./components/LoginPage";
import Toast from "./components/Toast";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./hooks/useToast";
import { useProgression } from "./hooks/useProgression";

export default function App() {
  const [activePage, setActivePage]         = useState("dashboard");
  const [currentChapter, setCurrentChapter] = useState("Probabilités");
  const [isExamMode, setIsExamMode]         = useState(false);
  const { user, authError, authLoading, login, register, logout, updateXP } = useAuth();
  const { toast, showToast } = useToast();
  const { chapitres, stats, loading: progLoading, refetch } = useProgression();

  const handleXPUpdate = (newXP, newNiveau) => {
    updateXP(newXP, newNiveau);
    showToast(`+XP — Total : ${newXP} XP 🎉`);
    refetch();
  };

  const goToChapter = (ch, isExam = false) => {
    setCurrentChapter(ch);
    setIsExamMode(isExam);
    if (isExam) {
      setActivePage("exam");
      showToast(`Simulation d'examen lancée : ${ch}`);
    } else {
      setActivePage("session");
      showToast(`Chapitre : ${ch}`);
    }
  };

  const exitExam = () => {
    setIsExamMode(false);
    setActivePage("annales");
    showToast("Examen terminé !");
  };

  if (!user) return (
    <>
      <LoginPage onLogin={login} onRegister={register} error={authError} loading={authLoading} />
      <Toast message={toast} />
    </>
  );

  return (
    <div className="app-root">
      <Nav activePage={activePage} setActivePage={setActivePage} />
      <Header xp={user.xp} user={user} onLogout={logout} />
      <main className="main-content">
        {activePage === "dashboard" && <Dashboard onChapterClick={goToChapter} user={user} chapitres={chapitres} stats={stats} loading={progLoading} />}
        {activePage === "session"   && <SessionPage currentChapter={currentChapter} setCurrentChapter={setCurrentChapter} onXPUpdate={handleXPUpdate} showToast={showToast} user={user} chapitres={chapitres} />}
        {activePage === "annales"   && <AnnalesPage onStartExam={(ch) => goToChapter(ch, true)} showToast={showToast} chapitres={chapitres} />}
        {activePage === "exam"      && <ExamSimulationPage chapter={currentChapter} onExit={exitExam} showToast={showToast} user={user} />}
      </main>
      <Toast message={toast} />
    </div>
  );
}
