import React, { useRef, useState, useEffect } from "react";
import CirclePackD3 from "./CirclePack";

const CirclePack = (props) => {
  const refElement = useRef(null);
  const [show, setShow] = useState(true);
  const [viz, setViz] = useState(null)
  const size = useWindowSize();

  useEffect(() => {
    if (viz !== null) {
      viz.remove();
    }
    setShow(false);
    if (props.data && props.data.length && refElement && refElement.current) {
      const aux = new CirclePackD3(refElement.current, {
        data: props.data,
        width: refElement.current.parentNode.parentNode.clientWidth * 0.9,
        height: refElement.current.parentNode.parentNode.clientWidth * 0.6,
        handler: props.handler,
      });

      setViz(aux);
    }
    setShow(true);
  }, [ props.data, size ]);

  return (
    <React.Fragment>
      { show && 
        <div
          className={props.isLoading ? "hide" : "animated fadeIn"}
          id="vis-container"
          ref={refElement}
        />
      }
    </React.Fragment>
  );
};

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default CirclePack;
