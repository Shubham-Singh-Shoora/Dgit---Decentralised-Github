import { useState, useEffect, useRef } from "react";
import "./App.css";

const VerticalLine = ({ active }) => {
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

export default App;
