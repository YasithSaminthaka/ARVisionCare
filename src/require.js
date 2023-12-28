const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const split = urlParams.get('split') == null ? "horizontal" : urlParams.get('split');
  const hfov = urlParams.get('hfov') == null ? 174.6 : urlParams.get('hfov');
  const vfov = urlParams.get('vfov') == null ? 116 : urlParams.get('vfov');
  const circleRadius = urlParams.get('circleRadius') == null ? 0.21 : urlParams.get('circleRadius');
  const leftVideoSchema = "eye:left;mode:toLens;split:" + split + "; hfov:" + hfov + "; vfov:" + vfov + "; circleRadius:" + circleRadius + ";";
  const rightVideoSchema = "eye:right;mode:toLens;split:" + split + "; hfov:" + hfov + "; vfov:" + vfov + "; circleRadius:" + circleRadius + ";";
  console.log("url", window.location.search);

  SetParametersForCanvas();

  function SetParametersForCanvas() {
    var queryString;

    if (window.location.search.includes("split") & window.location.search.includes("hfov") & window.location.search.includes("vfov") & window.location.search.includes("circleRadius")) {
      queryString = window.location.search;
    } else {
      //
      queryString = window.location.protocol + "//" + window.location.host + window.location.pathname + "?split=horizontal&hfov=185&vfov=130&circleRadius=0.2";
    }
    const urlParams = new URLSearchParams(queryString);
    const split = urlParams.get('split') == null ? "horizontal" : urlParams.get('split');
    const hfov = urlParams.get('hfov') == null ? 180 : urlParams.get('hfov');
    const vfov = urlParams.get('vfov') == null ? 130 : urlParams.get('vfov');
    const circleRadius = urlParams.get('circleRadius') == null ? 0.2 : urlParams.get('circleRadius');
    const leftVideoSchema = "eye:left;mode:toLens;split:" + split + "; hfov:" + hfov + "; vfov:" + vfov + "; circleRadius:" + circleRadius + ";";
    const rightVideoSchema = "eye:right;mode:toLens;split:" + split + "; hfov:" + hfov + "; vfov:" + vfov + "; circleRadius:" + circleRadius + ";";

    //end

  }