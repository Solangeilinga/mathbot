import { useState } from "react";
import Sidebar from "./Sidebar";
import OwlTutor from "./OwlTutor";
import ChatArea from "./ChatArea";
export default function SessionPage({ currentChapter, setCurrentChapter, onXPUpdate, showToast, user, chapitres }) {
  const [isTalking, setIsTalking] = useState(false);
  return (
    <div className="session-layout" style={{animation:"fade-in .4s ease"}}>
      <Sidebar currentChapter={currentChapter} setCurrentChapter={setCurrentChapter} showToast={showToast} user={user} chapitres={chapitres}/>
      <div className="chat-column">
        <OwlTutor chapter={currentChapter} chapitres={chapitres} isTalking={isTalking}/>
        <ChatArea key={currentChapter} chapter={currentChapter} onXPUpdate={onXPUpdate} showToast={showToast} user={user} onTalkingChange={setIsTalking}/>
      </div>
    </div>
  );
}
