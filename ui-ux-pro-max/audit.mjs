// 사용: node audit.mjs <작업 폴더> <조건-번호...>  (Chrome --remote-debugging-port=9348 필요)
import fs from 'fs';
const P=9348,[,,W,...runs]=process.argv;
const JS=`(()=>{const parse=s=>{const m=s.match(/[\\d.]+/g);return m?m.map(Number):[0,0,0,0]};const lum=c=>{const a=c.map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
const bgOf=e=>{while(e){const b=parse(getComputedStyle(e).backgroundColor);if(b.length<4||b[3]>.9)return b.slice(0,3);if(getComputedStyle(e).backgroundImage!='none')return null;e=e.parentElement}return[255,255,255]};
const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n,tot=0,low=0,small=0,sizes={},minC=99,fams={};
while(n=w.nextNode()){const t=n.textContent.trim();if(!t)continue;const e=n.parentElement;if(['SCRIPT','STYLE'].includes(e.tagName))continue;const r=e.getBoundingClientRect();if(!r.width)continue;const s=getComputedStyle(e);if(s.visibility=='hidden')continue;const f=parseFloat(s.fontSize),L=t.length;tot+=L;sizes[f]=(sizes[f]||0)+L;fams[s.fontFamily.split(',')[0]]=(fams[s.fontFamily.split(',')[0]]||0)+L;if(f<12)small+=L;const bg=bgOf(e);if(bg){const a=lum(parse(s.color).slice(0,3)),b=lum(bg),c=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);minC=Math.min(minC,c);const lg=f>=24||(f>=18.66&&+s.fontWeight>=700);if(c<(lg?3:4.5))low+=L}}
const ctl=[...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button]')].filter(e=>e.getBoundingClientRect().width>0);const tiny=ctl.filter(e=>{const r=e.getBoundingClientRect();return r.height<44||r.width<44}).length;
const fields=[...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')];const unl=fields.filter(e=>!(e.labels&&e.labels.length)&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).length;
const css=[...document.querySelectorAll('style')].map(s=>s.textContent).join('\\n'),b=getComputedStyle(document.body),main=Object.entries(sizes).sort((x,y)=>y[1]-x[1])[0];
const ps=[...document.querySelectorAll('p,li')].filter(e=>e.textContent.trim());const p0=ps[0]?getComputedStyle(ps[0]):b;
const hexes={};(css.match(/#[0-9a-fA-F]{6}\\b/g)||[]).forEach(x=>{x=x.toUpperCase();hexes[x]=(hexes[x]||0)+1});
return {bg:b.backgroundColor,fontTop:Object.entries(fams).sort((x,y)=>y[1]-x[1]).slice(0,2).map(x=>x[0]),fontLoaded:!!document.querySelector('link[href*="font"]')||/@import[^;]*font|@font-face/.test(css),mainSize:main&&+main[0],lh:+(parseFloat(p0.lineHeight)/parseFloat(p0.fontSize)).toFixed(2),lowContrastPct:+(low/tot*100).toFixed(1),minContrast:+minC.toFixed(2),under12pct:+(small/tot*100).toFixed(1),overflowX:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,viewport:!!document.querySelector('meta[name=viewport]'),controls:ctl.length,tinyControls:tiny,fields:fields.length,unlabeled:unl,cssVars:(css.match(/--[\\w-]+\\s*:/g)||[]).length,darkMode:/prefers-color-scheme:\\s*dark/.test(css),reducedMotion:/prefers-reduced-motion/.test(css),focusVisible:/focus-visible/.test(css),emoji:(document.body.innerText.match(/\\p{Extended_Pictographic}/gu)||[]).length,svg:document.querySelectorAll('svg').length,hexes:Object.keys(hexes).length,topHex:Object.entries(hexes).sort((x,y)=>y[1]-x[1]).slice(0,6).map(x=>x[0])}})()`;
const out={};
for(const r of runs){out[r]={};for(const [mode,w] of [['desktop',1280],['phone',390]]){
 const t=await (await fetch(`http://127.0.0.1:${P}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(x=>ws.onopen=x);let id=0;const pd={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(pd[m.id])pd[m.id](m)};
 const send=(m,p={})=>new Promise(x=>{const i=++id;pd[i]=x;ws.send(JSON.stringify({id:i,method:m,params:p}))});
 await send('Page.enable');await send('Runtime.enable');await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]});await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:mode=='phone'});
 await send('Page.navigate',{url:`file://${W}/${r}/index.html`});await new Promise(x=>setTimeout(x,2500));
 await send('Runtime.evaluate',{expression:`window.scrollTo(0,document.body.scrollHeight)`});await new Promise(x=>setTimeout(x,700));await send('Runtime.evaluate',{expression:`window.scrollTo(0,0)`});await new Promise(x=>setTimeout(x,500));
 out[r][mode]=(await send('Runtime.evaluate',{expression:JS,returnByValue:true})).result.result.value;
 const s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.mkdirSync(`${W}/shots`,{recursive:true});fs.writeFileSync(`${W}/shots/${r}-${mode}.png`,Buffer.from(s.result.data,'base64'));
 await fetch(`http://127.0.0.1:${P}/json/close/${t.id}`);ws.close();
}}
console.log(JSON.stringify(out,null,1));process.exit(0)
