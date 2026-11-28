/* تصميم الجوال: شريط تنقل سفلي، بث مباشر بشاشة كاملة، مشاركة واتساب، جودة منخفضة. لا يؤثر على سطح المكتب. */
(function(){
var MQ=matchMedia("(max-width:820px)");
var css="@media(max-width:820px){"
+":root{--hh:58px;--nv:64px}"
+"html{scroll-padding-top:70px}body,body.adm{padding-bottom:calc(var(--nv) + env(safe-area-inset-bottom,0px) + 10px)}"
+"body.inlive{overflow:hidden}"
+"header{min-height:var(--hh);height:var(--hh);flex-wrap:nowrap;gap:8px;padding:6px 12px}"
+"header .pill,header>a.btn,#auth{display:none!important}"
+".brand img{height:38px}.brand b{font-size:16px}.brand small{font-size:11px}"
+".round{height:38px;min-width:38px;justify-content:center;padding:0 12px}"
+".mct{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--ln);background:rgba(255,255,255,.07);color:#fff}.mct svg{width:18px;height:18px}"
+".hero{min-height:62vh;max-height:560px}.sl .in{bottom:16%;max-width:92%;inset-inline-start:5%}.sl h2{font-size:27px;margin-bottom:10px}.sl .btn{height:48px;padding:0 26px;font-size:17px;border-radius:999px}.dots{bottom:5%;inset-inline-start:5%}.kick{font-size:14px}"
+".mlive{display:flex;align-items:center;gap:12px;margin:-6px 4% 6px;padding:14px 16px;border-radius:16px;background:linear-gradient(135deg,#0d4a3a,#07201a);border:1px solid var(--ac);position:relative;z-index:5;box-shadow:0 6px 24px rgba(0,0,0,.4)}"
+".mlive .d{width:12px;height:12px;border-radius:50%;background:#ff4d4d;box-shadow:0 0 0 0 rgba(255,77,77,.7);animation:mp 1.6s infinite}@keyframes mp{70%{box-shadow:0 0 0 12px rgba(255,77,77,0)}100%{box-shadow:0 0 0 0 rgba(255,77,77,0)}}"
+".mlive b{display:block;font-size:18px;line-height:1.2}.mlive small{color:var(--mu);font-size:13px}.mlive span.g{margin-inline-start:auto;background:var(--ac);color:var(--ac-tx);font-weight:800;padding:9px 18px;border-radius:999px;font-size:15px}"
+".sec{padding:18px 0}.sec h2{font-size:19px;margin-bottom:10px}.sec h2 button{font-size:14px;padding:8px 0}"
+".track{gap:12px;padding-bottom:8px}.card{width:min(62vw,250px)}.card b{font-size:15px;margin-top:8px}.card small{font-size:12.5px}"
+".track.all{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 10px;overflow:visible}.track.all .card{width:100%}"
+".im{border-radius:12px}.im::after{content:'\\25B6';inset:auto;bottom:8px;inset-inline-end:8px;width:34px;height:34px;border-radius:50%;font-size:13px;opacity:1;background:rgba(3,32,21,.72);border:1px solid rgba(255,255,255,.25)}.card:hover .im img{transform:none}"
+".page{min-height:50vh}.sbox{margin:16px 4% 8px}.sbox input{height:50px;font-size:16px}"
+".info{margin:16px 4% 0;gap:20px;padding-top:20px}.info a{padding:10px 0;font-size:16px}footer{margin:18px 4% 0;font-size:13px}"
+"#dlg[open]{display:flex;flex-direction:column;width:100vw;height:100dvh;max-width:none;max-height:none;border-radius:0;background:#05140f}"
+"#dlg .dh{padding:10px 12px;gap:8px}#dlg .dh span{flex:1;font-size:15px;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}#dlg .dh button{min-width:40px;height:40px}"
+"#dlg .fr{width:100%;flex:none}#dlg .dn{padding:14px 16px;font-size:15px}#dlg .dn a{display:inline-block;padding:10px 0}"
+".wab{background:#25d366!important;color:#032015!important;border-radius:999px!important;font:700 14px var(--f)!important;padding:0 14px!important;height:36px!important;display:inline-flex;align-items:center;gap:6px;font-size:14px!important}"
+"#ab{bottom:calc(var(--nv) + env(safe-area-inset-bottom,0px));padding:8px 3%}"
+"#ed{width:100vw;max-width:none;margin:auto 0 0;border-radius:18px 18px 0 0;max-height:90dvh;overflow:auto}#ed input,#ed select{height:48px;font-size:16px}#ed .btn{height:46px}"
/* شريط التنقل السفلي */
+"#mnav{position:fixed;inset-inline:0;bottom:0;z-index:50;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;height:calc(var(--nv) + env(safe-area-inset-bottom,0px));padding-bottom:env(safe-area-inset-bottom,0px);background:rgba(5,20,15,.96);backdrop-filter:blur(12px);border-top:1px solid var(--ln)}"
+"#mnav a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;height:var(--nv);color:#9fb9ae;font-size:11.5px;font-weight:500;-webkit-tap-highlight-color:transparent}"
+"#mnav a svg{width:24px;height:24px}#mnav a.on{color:var(--ac)}#mnav a.on span{font-weight:700}"
+"#mnav a.lv2{color:#fff}#mnav a.lv2 i{display:flex;align-items:center;justify-content:center;width:54px;height:54px;margin-top:-22px;border-radius:50%;background:var(--ac);color:var(--ac-tx);border:4px solid #05140f;box-shadow:0 4px 16px rgba(40,200,120,.45)}#mnav a.lv2 i svg{width:26px;height:26px}#mnav a.lv2 span{margin-top:-2px}"
+"body.inlive #mnav{display:none}#live{z-index:70;padding:0}"
/* البث بشاشة كاملة */
+"#lb{position:fixed;inset:0;z-index:70;margin:0;padding:0;border:0;border-radius:0;background:#000;display:block}"
+"#lb .lt{display:none}#lb .lv{position:absolute;inset:calc(54px + env(safe-area-inset-top,0px)) 0 40px 0;aspect-ratio:auto;border-radius:0}#lb .lvx{display:none}"
+"#lb .lvl{position:absolute;inset-inline:0;bottom:0;height:40px;padding:9px;background:#05140f;z-index:3;font-size:13px}"
+"#mlbar{display:flex;position:absolute;top:0;inset-inline:0;z-index:5;height:calc(54px + env(safe-area-inset-top,0px));padding:env(safe-area-inset-top,0px) 8px 0;align-items:center;gap:6px;background:#05140f;border-bottom:1px solid var(--ln)}"
+"#mlbar button{height:38px;min-width:38px;border-radius:999px;border:1px solid var(--ln);background:rgba(255,255,255,.1);color:#fff;font:600 13px var(--f);padding:0 12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px}"
+"#mlbar button.on{background:var(--ac);color:var(--ac-tx);border-color:var(--ac)}#mlbar button.wab{border:0}"
+"#mlbar .t{flex:1;display:flex;align-items:center;gap:7px;font-weight:700;font-size:15px;min-width:0}#mlbar .t i{width:9px;height:9px;border-radius:50%;background:#ff4d4d;flex:none}"
+"#mtoast{position:fixed;inset-inline:12px;bottom:calc(var(--nv) + env(safe-area-inset-bottom,0px) + 12px);z-index:90;background:#0b241d;border:1px solid var(--ac);color:#fff;padding:12px 14px;border-radius:12px;font-size:14px;text-align:center}"
/* ملء الشاشة الحقيقي: فيديو فقط بدون شريط المزوّد والإطار */
+"#lb:fullscreen{background:#000}"
+"#lb:fullscreen #mlbar,#lb:fullscreen .lvl,#lb:fullscreen .lvx{display:none!important}"
+"#lb:fullscreen .lv{position:absolute;inset:0;overflow:hidden;background:#000;border-radius:0;aspect-ratio:auto}"
+"#lb:fullscreen .lv iframe{position:absolute;border:0;width:980px;height:760px;max-width:none;transform-origin:0 0;clip-path:inset(68px 64px 212px 64px)}"
+"}"
/* قصّ إطار المزوّد: صفحته بعرض 980، البانر 70px والفيديو 852x480 بالمنتصف */

/* خارج الجوال: إخفاء عناصر الجوال */
+"@media(min-width:821px){#mnav,#mlbar,.mlive,.mct,#mtoast{display:none!important}}";
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

function g(i){return document.getElementById(i)}
function tr(k,d){try{var v=T(k);return v&&v!==k?v:d}catch(e){return d}}
var SITE="https://alghanna-tv.pages.dev/";
function wa(text){return "https://wa.me/?text="+encodeURIComponent(text)}
function share(text,url){var full=text+"\n"+url;
 if(navigator.share){navigator.share({text:text,url:url}).catch(function(){})}else window.open(wa(full),"_blank","noopener")}
function toast(m){var t=g("mtoast");if(!t){t=document.createElement("div");t.id="mtoast";document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(function(){t.hidden=true},4000)}
var IC={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 live:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
 prog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
 browse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'};
var WA='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>';

/* شريط التنقل السفلي */
var nav=document.createElement("nav");nav.id="mnav";nav.setAttribute("aria-label","main");
var ITEMS=[["home","home","home","الرئيسية"],["programs","prog","programs","برامج"],["live","live","liveTag","مباشر"],["browse","browse","browse","تصفح"],["search","search","search","البحث"]];
ITEMS.forEach(function(x){var a=document.createElement("a");a.href="#"+x[0];a.dataset.k=x[0];if(x[0]==="live")a.className="lv2";
 a.innerHTML=(x[0]==="live"?"<i>"+IC[x[1]]+"</i>":IC[x[1]])+"<span></span>";nav.appendChild(a)});
document.body.appendChild(nav);
function labels(){ITEMS.forEach(function(x,i){nav.children[i].querySelector("span").textContent=tr(x[2],x[3])});
 var b=g("mlbT");if(b)b.textContent=tr("live","البث المباشر")}

/* زر الاتصال في الرأس */
var hd=document.querySelector("header"),lang=hd.querySelector(".lang");
var ct=document.createElement("a");ct.className="mct";ct.href="#contact";ct.setAttribute("aria-label","contact");ct.innerHTML=IC.phone;hd.insertBefore(ct,lang);

/* شريط البث المباشر على الرئيسية */
var ml=document.createElement("a");ml.className="mlive";ml.href="#live";ml.dataset.r="home";
ml.innerHTML='<i class="d"></i><div><b id="mlbT">البث المباشر</b><small>القناة على الهواء</small></div><span class="g">شاهد</span>';
var hero=g("hero");hero.parentNode.insertBefore(ml,hero.nextSibling);
/* شريط أعلى شاشة البث */
var lb=g("lb"),bar=document.createElement("div");bar.id="mlbar";
bar.innerHTML='<button type="button" id="mlb1" aria-label="back">&#10095;</button><div class="t"><i></i><span>مباشر</span></div><button type="button" id="mlq">جودة أقل</button><button type="button" id="mlf" aria-label="fullscreen">&#9974;</button><button type="button" class="wab" id="mlw">'+WA+' واتساب</button>';
lb.insertBefore(bar,lb.firstChild);

var prev=null,cur=location.hash;
window.addEventListener("hashchange",function(){prev=cur;cur=location.hash;sync()});
g("mlb1").onclick=function(){if(prev&&prev!=="#live")history.back();else location.replace("#home")};
g("mlw").onclick=function(){share("قناة الغنّاء المحلية بتريم، البث المباشر الآن",SITE+"#live")};
/* ملء الشاشة الحقيقي عند الضغط على البث المباشر (يتطلب نقرة المستخدم) */
function liveFS(){if(!MQ.matches)return;var f=lb.requestFullscreen||lb.webkitRequestFullscreen;if(!f)return;
 try{var p=f.call(lb);if(p&&p.catch)p.catch(function(){})}catch(x){}}
document.addEventListener("click",function(e){if(!MQ.matches)return;var t=e.target,tA=t&&t.closest?t.closest('a[href="#live"]'):null;if(!tA)return;
 if(document.fullscreenElement===lb||document.webkitFullscreenElement===lb)return;
 liveFS()},true);
g("mlf").onclick=liveFS;
/* قصّ: صفحة المزوّد تُعرض بعرض 980 ثم تُكبَّر بحيث يملأ الفيديو (852x480 عند 64,68) الشاشة */
function fitFS(){var f=document.querySelector("#lv iframe");if(!f)return;
 var fs=document.fullscreenElement===lb||document.webkitFullscreenElement===lb||lb.classList.contains("fsdbg");
 if(!fs){f.style.transform=f.style.left=f.style.top="";return}
 var W=innerWidth,H=innerHeight,k=Math.min(W/852,H/480);
 f.style.transform="scale("+k+")";f.style.left=(W/2-490*k)+"px";f.style.top=(H/2-308*k)+"px"}
["fullscreenchange","webkitfullscreenchange","resize","orientationchange"].forEach(function(n){addEventListener(n,function(){setTimeout(fitFS,60)});document.addEventListener(n,function(){setTimeout(fitFS,60)})});
document.addEventListener("fullscreenchange",function(){if(document.fullscreenElement===lb){try{screen.orientation.lock("landscape").catch(function(){})}catch(x){}}});

/* جودة منخفضة (HLS بأقل مستوى). عند الفشل نرجع للبث الأساسي */
var lowQ=false,mh=null,ltok=0;
function killLow(){ltok++;if(mh){try{mh.destroy()}catch(e){}mh=null}}
function normalLive(){killLow();lowQ=false;g("mlq").classList.remove("on");if(typeof startLive==="function")startLive()}
function lowLive(){if(typeof stopLive==="function")stopLive();killLow();var tok=ltok,box=g("lv");lb.classList.add("playing");
 var v=document.createElement("video");v.controls=true;v.autoplay=true;v.muted=false;v.playsInline=true;v.style.cssText="width:100%;height:100%;background:#000";box.appendChild(v);
 var fail=function(){if(tok!==ltok)return;toast("الجودة المنخفضة غير متاحة الآن، رجعنا للبث العادي");normalLive()};
 var go=function(){if(tok!==ltok)return;if(window.Hls&&Hls.isSupported()){mh=new Hls({startLevel:0,autoStartLoad:true,capLevelToPlayerSize:true});
   mh.on(Hls.Events.MANIFEST_PARSED,function(){mh.autoLevelCapping=0;mh.currentLevel=0;var p=v.play();if(p&&p.catch)p.catch(function(){})});
   mh.on(Hls.Events.ERROR,function(e,d){if(d&&d.fatal)fail()});mh.loadSource(LIVE_HLS);mh.attachMedia(v);setTimeout(function(){if(tok===ltok&&v.readyState===0)fail()},9000)}
  else if(v.canPlayType("application/vnd.apple.mpegurl")){v.src=LIVE_HLS}else fail()};
 if(window.Hls)go();else{var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js";s.onload=go;s.onerror=fail;document.head.appendChild(s)}}
g("mlq").onclick=function(){lowQ=!lowQ;this.classList.toggle("on",lowQ);if(lowQ){toast("جودة منخفضة: توفير للإنترنت");lowLive()}else normalLive()};

/* زر مشاركة في نافذة الفيديو */
var dh=document.querySelector("#dlg .dh"),dx=g("dx"),sb=document.createElement("button");sb.type="button";sb.className="wab";sb.innerHTML=WA+" مشاركة";
sb.onclick=function(){share((g("dt").textContent||"قناة الغنّاء")+" | قناة الغنّاء المحلية بتريم",g("dl").href)};dh.insertBefore(sb,dx);
var sbShow=function(){sb.style.display=MQ.matches?"":"none"};

/* تنبيه عدم الاتصال */
addEventListener("offline",function(){toast("أنت غير متصل بالإنترنت. بعض المحتوى قد لا يظهر")});
addEventListener("online",function(){toast("رجع الاتصال")});

function sync(){var h=(location.hash||"#home").slice(1);if(["home","live","programs","courses","movies","browse","contact","search"].indexOf(h)<0)h="home";
 var on=MQ.matches&&h==="live";document.body.classList.toggle("inlive",on);
 if(h!=="live"&&(lowQ||mh)){killLow();lowQ=false;g("mlq").classList.remove("on")}
 Array.prototype.forEach.call(nav.children,function(a){var k=a.dataset.k;a.classList.toggle("on",k===h||(k==="browse"&&(h==="courses"||h==="movies")))});
 sbShow()}
MQ.addEventListener?MQ.addEventListener("change",sync):MQ.addListener(sync);
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
labels();sync();
})();
