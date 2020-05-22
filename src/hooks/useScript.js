import { useEffect } from "react";

const useScript = opts => {
  useEffect(() => {
    const script = document.createElement("script");
    const { url, async = true, integrity, crossorigin } = opts;
    script.src = url;
    script.async = async;
    script.integrity = integrity;
    script.crossOrigin = crossorigin;
    script.type = "text/javascript";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [opts]);
};

export default useScript;
