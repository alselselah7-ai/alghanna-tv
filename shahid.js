/* تصميم على نمط تطبيقات البث (تخطيط وإحساس فقط): رأس شفاف فوق البانر، بانر كبير، أزرار دائرية، شريط تصنيفات عائم، تنقل سفلي داكن. للجوال فقط. */
(function(){
if(window.__shahidStyle)return;window.__shahidStyle=1;
var BG="#0e0f16",NAVBG="#181a24";
var css="@media(max-width:820px){"
+":root{--bg:"+BG+";--bg2:"+BG+";--band:transparent;--ln:rgba(255,255,255,.1);--hh:60px;--nv:66px}"
+"html,body{background:"+BG+"!important}body::before,body::after{display:none!important}"
/* الرأس: شفاف فوق البانر */
+"header{position:absolute!important;top:0;inset-inline:0;z-index:40;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0))!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 6px;height:auto;min-height:var(--hh)}"
+"header .brand small{display:none}header .brand b{font-size:14px;white-space:nowrap}header .brand{gap:6px;min-width:0}header .brand img{height:34px}"
+"header .mct,header .round,header .lang{border:0!important;background:transparent!important;box-shadow:none!important;width:36px;min-width:36px;height:36px;padding:0;color:#fff}header .mct svg{width:22px;height:22px}"
+"header .lang{width:auto;min-width:0;padding:0 6px;font-weight:700;font-size:13px}header .lang svg,header .lang .gl{display:none}"
+"#mpill{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 16px;border-radius:999px;background:#fff;color:#111;font:800 13.5px var(--f);white-space:nowrap}#mpill i{width:8px;height:8px;border-radius:50%;background:#e53935}"
+"#msrch{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;color:#fff}#msrch svg{width:24px;height:24px}"
+".page,#sbx,#rows:not(:first-child){scroll-margin-top:0}"
+"body:not([data-mr=home]){padding-top:calc(var(--hh) + 12px)}"
/* البانر */
+".hero{min-height:0!important;height:calc(100svh - var(--nv) - 150px);min-height:470px!important;max-height:620px!important;margin:0}"
+".hero .sl .bg{inset:0}.hero .sl .bg img{width:100%;height:100%;object-fit:cover;object-position:center 20%}"
+".hero .sl .bg::after,.hero .sl::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,15,22,0) 35%,rgba(14,15,22,.82) 72%,"+BG+" 100%);pointer-events:none}"
+".sl .in{position:absolute;inset-inline:0!important;max-width:none!important;bottom:56px!important;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 22px;z-index:3}"
+".sl h2{font-size:30px!important;line-height:1.25;font-weight:800;margin:0 0 8px!important;text-shadow:0 2px 14px rgba(0,0,0,.6)}"
+".sl .kick{order:3;font-size:13.5px!important;color:#f3b36b!important;font-weight:600;margin:6px 0 14px}.sl .meta{order:2;font-size:13px;color:#d4d6df}.sl p{display:none}"
+".sl .btn{order:4}.mhb{order:4;display:flex;align-items:center;justify-content:center;gap:12px;width:100%}"
+".mhb .btn,.sl .in>.btn{flex:1;max-width:none;height:50px!important;border-radius:999px!important;background:#fff!important;color:#14151c!important;font-weight:800;font-size:17px!important;padding:0 20px!important;border:0;display:inline-flex;align-items:center;justify-content:center;gap:8px}"
+".mhb .btn::after{content:'\\25B6';font-size:14px;order:-1;transform:scaleX(-1)}"
+".mc{flex:none;width:46px;height:46px;border-radius:50%;border:0;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.mc svg{width:22px;height:22px}"
+".dots{inset-inline:0!important;bottom:22px!important;display:flex;justify-content:center;gap:7px;z-index:4}.dots i,.dots button,.dots span{height:6px!important;border-radius:3px;background:rgba(255,255,255,.35)!important}.dots .on{background:#fff!important;width:30px!important}"
/* شريط البث */
+".mlive{margin:6px 14px 4px;background:#1a1c27!important;border:0!important;border-radius:14px;box-shadow:none!important;padding:12px 14px}.mlive b{font-size:16px}.mlive span.g{background:#fff;color:#111}"
/* الأقسام */
+".sec{padding:14px 0 4px}.sec h2{font-size:17px;font-weight:800;padding-inline:14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}"
+".sec h2 span::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ac);margin-inline-end:8px;vertical-align:middle;box-shadow:12px 0 0 #fff}"
+".sec h2 button.sa{color:#9ea1b0;font-size:13px;font-weight:600}"
+".rail{padding-inline:14px}.rail .arrow{display:none!important}.track{gap:10px;padding-bottom:6px;scroll-padding-inline:14px}"
+".card{width:min(44vw,176px)!important}.im{border-radius:10px!important}.im::after{display:none!important}.card b{font-size:13px!important;font-weight:600;color:#e8e9ef;margin-top:7px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.card small{font-size:11.5px;color:#9ea1b0}"
+".track.all .card{width:100%!important}"
+".info,footer{color:#9ea1b0}"
/* التصنيفات العائمة */
+"#mchips{position:fixed;z-index:49;inset-inline:0;bottom:calc(var(--nv) + env(safe-area-inset-bottom,0px) + 12px);margin:0 auto;width:max-content;max-width:calc(100vw - 28px);display:flex;align-items:center;padding:0 6px;height:46px;border-radius:999px;background:rgba(44,47,62,.92);backdrop-filter:blur(14px);box-shadow:0 6px 24px rgba(0,0,0,.5)}"
+"#mchips a{padding:0 14px;font-size:14px;font-weight:700;color:#fff;white-space:nowrap;position:relative}#mchips a+a::before{content:'';position:absolute;inset-inline-end:100%;top:50%;height:16px;width:1px;margin-top:-8px;background:rgba(255,255,255,.22)}"
+"body{padding-bottom:calc(var(--nv) + env(safe-area-inset-bottom,0px) + 70px)!important}"
/* التنقل السفلي */
+"#mnav{background:"+NAVBG+"!important;border-top:0!important;backdrop-filter:none;align-items:center;box-shadow:0 -1px 0 rgba(255,255,255,.04)}"
+"#mnav a,#mnav a.lv2{color:#8c8fa0!important;font-size:11.5px;gap:4px}#mnav a.on,#mnav a.on.lv2{color:#fff!important}#mnav a.on span{font-weight:800}"
+"#mnav a.lv2 i{width:auto;height:auto;margin:0;border:0;background:none!important;box-shadow:none;color:inherit;display:flex}#mnav a.lv2 i svg{width:26px;height:26px}#mnav a.lv2 span{margin:0}"
+"#mnav a.on svg{filter:drop-shadow(0 0 0 #fff)}"
+"#mtoast{background:#232636!important;border:0!important}"
+"}"
+"@media(min-width:821px){#mpill,#msrch,#mchips,.mhb,.mc{display:none!important}}"
+"body.inlive #mchips,body.inlive #mpill{display:none!important}body.inlive header{display:none!important}";
var st=document.createElement("style");st.id="mshahid";st.textContent=css;document.head.appendChild(st);

function g(i){return document.getElementById(i)}
function tr(k,d){try{var v=T(k);return v&&v!==k?v:d}catch(e){return d}}
var SH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';
var BELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
var SRCH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
var LIVEI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/></svg>';

function mr(){var h=(location.hash||"#home").slice(1)||"home";document.body.dataset.mr=h}mr();addEventListener("hashchange",mr);
/* الرأس: زر بث مباشر + بحث */
var hd=document.querySelector("header");
if(hd){var pill=document.createElement("a");pill.id="mpill";pill.href="#live";pill.innerHTML="<i></i><span></span>";
 var sr=document.createElement("a");sr.id="msrch";sr.href="#search";sr.setAttribute("aria-label","search");sr.innerHTML=SRCH;
 hd.appendChild(sr);hd.appendChild(pill)}
/* أيقونة البث في الشريط السفلي */
var lv=document.querySelector("#mnav a.lv2 i");if(lv)lv.innerHTML=LIVEI;
/* شريط التصنيفات العائم */
var ch=document.createElement("div");ch.id="mchips";document.body.appendChild(ch);
var CH=[["programs","programs","برامج"],["courses","courses","دروس"],["movies","movies","أفلام"],["live","liveTag","مباشر"]];
CH.forEach(function(x){var a=document.createElement("a");a.href="#"+x[0];a.dataset.k=x[1];ch.appendChild(a)});
function labels(){var p=g("mpill");if(p)p.querySelector("span").textContent=tr("liveTag","بث مباشر");
 CH.forEach(function(x,i){ch.children[i].textContent=tr(x[1],x[2])})}
labels();
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
/* أزرار البانر الدائرية: مشاركة وإشعارات */
function deco(){document.querySelectorAll("#slides .sl .in").forEach(function(inn){
 if(inn.querySelector(".mhb"))return;var b=inn.querySelector(".btn");if(!b)return;
 var w=document.createElement("div");w.className="mhb";
 var s=document.createElement("button");s.type="button";s.className="mc";s.setAttribute("aria-label","share");s.innerHTML=SH;
 s.onclick=function(e){e.stopPropagation();var t=(inn.querySelector("h2")||{}).textContent||"قناة الغنّاء",u="https://alghanna-tv.pages.dev/";
  if(navigator.share)navigator.share({text:t+" | قناة الغنّاء المحلية بتريم",url:u}).catch(function(){});else window.open("https://wa.me/?text="+encodeURIComponent(t+"\n"+u),"_blank","noopener")};
 var n=document.createElement("button");n.type="button";n.className="mc";n.setAttribute("aria-label","notifications");n.innerHTML=BELL;
 n.onclick=function(e){e.stopPropagation();var bl=g("mbell");if(bl)bl.click()};
 inn.insertBefore(w,b);w.appendChild(n);w.appendChild(b);w.appendChild(s)})}
deco();var sl=g("slides");if(sl)new MutationObserver(function(){deco()}).observe(sl,{childList:true,subtree:true});
})();
