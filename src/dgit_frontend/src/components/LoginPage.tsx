import React, { useState, useEffect, useRef } from "react";
import "./LoginPage.css";

type LoginPageProps = {
  onLogin?: () => void;
};

const VerticalLine = ({ active } : { active: boolean}) => {
  const lineRef = useRef(null);

  useEffect(() => {
    let animationTimeout, removeTimeout;

    if (active && lineRef.current) {
      animationTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          lineRef.current.classList.add("expand");
        });

        removeTimeout = setTimeout(() => {
          lineRef.current.classList.remove("expand");
        }, 750);
      }, 100); 
    }

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(removeTimeout);
    };
  }, [active]);

  if (!active) return null;

  return <div className="vertical-line" ref={lineRef}></div>;
};

function App() {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [panelsGone, setPanelsGone] = useState(false);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    let slideTimeout, showTimeout;
    if (animationStarted) {
      slideTimeout = setTimeout(() => setPanelsGone(true), 1000);
      showTimeout = setTimeout(() => setShowMain(true), 2000);
    }
    return () => {
      clearTimeout(slideTimeout);
      clearTimeout(showTimeout);
    };
  }, [animationStarted]);

  return (
    <>
      {!showMain && (
        <div className="panels-container">
          <div className={`left-panel ${animationStarted && panelsGone ? "slide-left" : ""}`}>
            <div className="panel-content" />
          </div>
          <div className={`right-panel ${animationStarted && panelsGone ? "slide-right" : ""}`}>
            <div className="panel-content" />
          </div>

          <div className="button-container">
            <VerticalLine active={animationStarted} />
            {!animationStarted && (
              <button onClick={() => setAnimationStarted(true)} className="glow-button">
                <span className="big-d">Login</span>
                <span className="small-d">
                  <span className="any">To</span>
                  <br />
                  Internet Identity
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {showMain && <div className="main-content">Main Content</div>}
    </>
  );
}


function LoginPage({ onLogin }: LoginPageProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [panelsGone, setPanelsGone] = useState(false);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    let slideTimeout, showTimeout;
    if (animationStarted) {
      slideTimeout = setTimeout(() => setPanelsGone(true), 1000);
      showTimeout = setTimeout(() => {
        setShowMain(true);
        if (onLogin) onLogin(); // Notify parent after animation
      }, 2000);
    }
    return () => {
      clearTimeout(slideTimeout);
      clearTimeout(showTimeout);
    };
  }, [animationStarted, onLogin]);

  if (showMain) return null; // Don't render after login

  return (
    <>
      <div className="panels-container">
        <div className={`left-panel ${animationStarted && panelsGone ? "slide-left" : ""}`}>
          <div className="panel-content" />
        </div>
        <div className={`right-panel ${animationStarted && panelsGone ? "slide-right" : ""}`}>
          <div className="panel-content" />
        </div>

        <div className="button-container">
          <VerticalLine active={animationStarted} />
          {!animationStarted && (
            <button onClick={() => setAnimationStarted(true)} className="glow-button">
              <span className="big-d">Login</span>
              <span className="small-d">
                <span className="any">To</span>
                <br />
                Internet Identity
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginPage;
export { App as LoginPage, VerticalLine }; // Export both components

