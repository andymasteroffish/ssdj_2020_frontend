import { useEffect } from "react";

const useScript = opts => {
  useEffect(() => {
    const script = document.createElement("script");
    const {
      url,
      async = false,
      integrity,
      crossOrigin,
      type = "text/javascript"
    } = opts;

    script.src = url;
    script.async = async;
    script.integrity = integrity;
    script.crossOrigin = crossOrigin;
    script.type = type;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [opts]);
};

export default useScript;
