/* Staff KPIs (staff/kpis.html) */
if (window.TGA) TGA.mount('staff/kpis');
else (function () {
  var r = document.getElementById('root');
  if (!r) return;
  r.innerHTML = '<div style="max-width:560px;margin:60px auto;padding:20px;font-family:Arial,sans-serif;background:#fff;border:1px solid #d5dae3;border-radius:10px">' +
    '<h1 style="font-size:20px;margin:0 0 10px">The TGA website did not load completely</h1>' +
    '<p>This happens for a minute or two after the website is updated, or when the internet connection drops while it loads.</p>' +
    '<p><button type="button" id="tga-reload" style="background:#12306b;color:#fff;border:0;border-radius:6px;padding:10px 18px;font-weight:bold;cursor:pointer">Reload the website</button></p></div>';
  document.getElementById('tga-reload').onclick = function () {
    var go = function () { window.location.reload(); };
    try {
      if (window.caches) caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).then(go, go);
      else go();
    } catch (e) { go(); }
  };
})();
