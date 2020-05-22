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
    script.type = type;
    if (integrity) {
      script.integrity = integrity;
    }
    if (crossOrigin) {
      script.crossOrigin = crossOrigin;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [opts]);
};

export default useScript;
