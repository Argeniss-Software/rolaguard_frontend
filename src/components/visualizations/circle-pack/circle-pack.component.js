import React, { useRef, useState, useEffect } from "react";
import CirclePackD3 from "./CirclePack";
import EmptyComponent from "../../utils/empty.component";

const CirclePack = (props) => {
  const refElement = useRef(null);
  const [show, setShow] = useState(true);
  const [viz, setViz] = useState(null)
  const size = useWindowSize();

  const filteredData = props.data.filter((item) => !item.selected);

  useEffect(() => {
    if (viz !== null) {
      viz.remove();
    }
    setShow(false);
    if (props.data && filteredData.length && refElement && refElement.current) {
      const aux = new CirclePackD3(refElement.current, {
        data: props.data,
        width: refElement.current.parentNode.clientWidth,
        height: refElement.current.parentNode.clientHeight,
        handler: props.handler,
        type: props.type
      });

      setViz(aux);
    }
    setShow(true);
  }, [ props.data, size ]);

  return (
    <React.Fragment>
      { show && filteredData.length === 0 && 
          (<EmptyComponent emptyMessage="No more items to show" />)
      }
      { show && props.data.length > 0 && 
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
