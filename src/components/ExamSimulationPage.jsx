import { useState, useEffect, useRef } from "react";
import { subjectAPI, examAPI } from "../utils/api";

const EXAM_DURATION = 2 * 60 * 60; // 2 heures

export default function ExamSimulationPage({ chapter, onExit, showToast, user }) {
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [finished, setFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState("");
  const [correction, setCorrection] = useState(null);
  const [note, setNote] = useState(null);
  const [isCorrectingAI, setIsCorrectingAI] = useState(false);
  const timerRef = useRef(null);
  const textAreaRef = useRef(null);

  // Charger le sujet depuis la base de données
  useEffect(() => {
    const loadSubject = async () => {
      try {
        setLoading(true);
        // Récupérer le sujet de la session 2025, chapitre Mixte
        const subjectData = await subjectAPI.getSubject("2025", "Mixte");
        setSubject(subjectData);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        showToast(`❌ Erreur: ${err.message}`);
        onExit();
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [showToast, onExit]);

  // Chronomètre
  useEffect(() => {
    if (!subject || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          showToast("Temps écoulé ! Envoi pour correction...");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [subject, finished, showToast]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const submitForCorrection = async () => {
    if (!studentAnswers.trim()) {
      showToast("⚠️ Veuillez écrire vos réponses");
      return;
    }

    try {
      setIsCorrectingAI(true);
      setShowResults(true);
      
      const result = await subjectAPI.correctSubject(
        subject.sujet,
        studentAnswers
      );

      setNote(result.note);
      setCorrection(result.correction);

      // Enregistrer le résultat
      await examAPI.logResults("Mixte", result.note, 20, timeLeft);
      
      showToast(`✅ Correction complète : ${result.note}/20`);
    } catch (err) {
      console.error("Erreur de correction:", err);
      showToast(`❌ Erreur IA: ${err.message}`);
    } finally {
      setIsCorrectingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="exam-loading">
        <div className="loading-spinner">⏳</div>
        <p>Chargement du sujet BEPC 2025...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="exam-error">
        <p>❌ Sujet non trouvé</p>
        <button className="btn-secondary" onClick={onExit}>Retour</button>
      </div>
    );
  }

  if (showResults && correction) {
    return (
      <div className="exam-results" style={{ animation: "fade-in .4s ease" }}>
        <div className="results-card">
          <div className="results-header">
            <h1>📊 Correction par l'IA</h1>
            <p className="results-note">Note : {note}/20 ({Math.round((note / 20) * 100)}%)</p>
          </div>

          <div className="score-display">
            <div className={`score-circle ${note >= 14 ? "excellent" : note >= 10 ? "good" : "needs-work"}`}>
              <div className="score-number">{note}</div>
              <div className="score-label">/20</div>
            </div>
          </div>

          <div className="correction-text">
            <h3>Commentaires :</h3>
            <div className="correction-content">
              {correction.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          <div className="results-actions">
            <button className="btn-primary" onClick={() => { 
              setShowResults(false); 
              setStudentAnswers(""); 
              setFinished(false); 
              setTimeLeft(EXAM_DURATION); 
              setCorrection(null); 
            }}>🔄 Recommencer</button>
            <button className="btn-secondary" onClick={onExit}>← Retour aux annales</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-simulation" style={{ animation: "fade-in .4s ease" }}>
      <div className="exam-header">
        <div className="exam-info">
          <h2>BEPC 2025 — Sujet Blanc</h2>
          <p>Session : 2025</p>
        </div>
        <div className="exam-timer" style={{ color: timeLeft < 600 ? "#ff6b6b" : "#2ecc71" }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="exam-content-subject">
        <div className="subject-text">
          {subject.sujet.split("\n").map((line, idx) => (
            <div key={idx} className="subject-line">{line}</div>
          ))}
        </div>

        <div className="answer-box">
          <h3>Vos réponses :</h3>
          <textarea
            ref={textAreaRef}
            className="answer-textarea"
            value={studentAnswers}
            onChange={(e) => setStudentAnswers(e.target.value)}
            placeholder="Écrivez vos réponses ici..."
            disabled={finished || isCorrectingAI}
          />
          <div className="answer-count">
            {studentAnswers.length} caractères
          </div>
        </div>
      </div>

      <div className="exam-footer">
        {!finished ? (
          <>
            <button 
              className="btn-finish" 
              onClick={submitForCorrection}
              disabled={isCorrectingAI || !studentAnswers.trim()}
            >
              {isCorrectingAI ? "⏳ Correction en cours..." : "✅ Soumettre pour correction"}
            </button>
            <button className="btn-secondary" onClick={onExit}>← Annuler</button>
          </>
        ) : (
          <div className="exam-footer-msg">
            ⏳ Envoi pour correction IA en cours...
          </div>
        )}
      </div>
    </div>
  );
}
