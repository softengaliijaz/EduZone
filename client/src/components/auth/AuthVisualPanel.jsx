import React from "react";
import { BookOpen, Compass, Sparkles } from "lucide-react";

const content = {
  login: {
    eyebrow: "A calmer way to keep learning",
    title: "Pick up where your curiosity left off.",
    description: "Your courses, lessons, and learning progress are ready when you are.",
    steps: ["Choose a direction", "Learn at your own pace", "Keep your momentum"],
  },
  signup: {
    eyebrow: "Make space for what’s next",
    title: "Turn a little curiosity into real progress.",
    description: "Create your learning space and build a routine around the skills you want to grow.",
    steps: ["Find a course that fits", "Learn in focused steps", "See your progress grow"],
  },
};

const AuthVisualPanel = ({ mode }) => {
  const copy = content[mode] || content.login;

  return (
    <aside className="auth-visual" aria-label="About learning with EduZone">
      <div className="auth-visual__topline">
        <span className="auth-visual__logo" aria-hidden="true">EZ</span>
        <span>EDUZONE</span>
        <span className="auth-visual__label">LEARNING PLATFORM</span>
      </div>

      <div className="auth-visual__copy">
        <p className="auth-visual__eyebrow"><Sparkles size={15} aria-hidden="true" />{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="auth-visual__description">{copy.description}</p>
        <ul className="auth-visual__steps">
          {copy.steps.map((step, index) => (
            <li key={step}><span aria-hidden="true">0{index + 1}</span>{step}</li>
          ))}
        </ul>
      </div>

      <div className="auth-visual__art" aria-hidden="true">
        <div className="auth-visual__orbit auth-visual__orbit--one" />
        <div className="auth-visual__orbit auth-visual__orbit--two" />
        <div className="auth-visual__tile auth-visual__tile--main"><BookOpen size={30} strokeWidth={1.5} /><span>LEARN</span></div>
        <div className="auth-visual__tile auth-visual__tile--small"><Compass size={20} strokeWidth={1.6} /></div>
        <div className="auth-visual__spark auth-visual__spark--one">✳</div>
        <div className="auth-visual__spark auth-visual__spark--two">✳</div>
      </div>

      <p className="auth-visual__footer">A thoughtful place to make your next move.</p>
    </aside>
  );
};

export default AuthVisualPanel;
