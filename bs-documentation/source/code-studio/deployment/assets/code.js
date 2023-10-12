const backendURL = dataiku.getWebAppBackendUrl(
  "fetch/bs_init?URL=" + getWebAppBackendUrl("")
);
window.onload = function () {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", backendURL);
  ifrm.setAttribute(
    "style",
    "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
  );
  document.body.appendChild(ifrm);
};
