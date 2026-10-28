'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
const ease = n => 1-Math.pow(1-clamp(n),3);
// Original conceptual architecture; this illustration is not a project render.
function sceneMarkup(prefix){
  const floors=Array.from({length:5},(_,i)=>`<g class="scene-floor" data-floor="${i}" transform="translate(0 ${-i*42})">
    <path d="M350 373L530 408L530 450L350 415Z" fill="#f4f9fc" stroke="#8db2c8" stroke-width=".8"/>
    <path d="M530 408L650 348L650 390L530 450Z" fill="#91bdd7" stroke="#6e9fbf" stroke-width=".8"/>
    <path d="M350 373L470 313L650 348L530 408Z" fill="#daeaf4" stroke="#8db2c8" stroke-width=".8"/>
    <path d="M362 385L394 391L394 414L362 408ZM405 393L437 399L437 422L405 416ZM448 401L480 407L480 430L448 424ZM491 409L520 415L520 438L491 432Z" fill="#2c6386"/>
    <path d="M541 411L565 399L565 422L541 434ZM575 394L600 381L600 404L575 417ZM610 376L636 363L636 386L610 399Z" fill="#24597b"/>
    <path d="M343 409L530 445L657 382L657 389L530 453L343 417Z" fill="#fff" stroke="#90b6cd" stroke-width=".8"/>
    <path d="M351 403L530 438L650 378M360 405v10m30-4v10m30-4v10m30-4v10m30-4v10m30-4v10m42-10v10m25-23v10m25-22v10m25-23v10m25-23v10" fill="none" stroke="#a1bdce" stroke-width=".9"/>
  </g>`).join('');
  const lattice=Array.from({length:8},(_,i)=>`M216 ${130+i*36}l27 36m-27 0l27-36`).join('');
  const jib=Array.from({length:14},(_,i)=>`M${140+i*38} 107l19-19 19 19`).join('');
  return `<svg viewBox="0 0 900 580" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs><radialGradient id="${prefix}-halo"><stop stop-color="#a5d7f3" stop-opacity=".42"/><stop offset="1" stop-color="#a5d7f3" stop-opacity="0"/></radialGradient><linearGradient id="${prefix}-ground" x2="1" y2="1"><stop stop-color="#c7deec"/><stop offset="1" stop-color="#eff7fb"/></linearGradient></defs>
    <ellipse cx="475" cy="285" rx="350" ry="250" fill="url(#${prefix}-halo)"/>
    <g class="scene-outline"><path d="M70 400L440 215L830 290M70 440L440 255L830 330M70 480L440 295L830 370M70 520L440 335L830 410M210 555L580 370L830 420M160 340L650 500M230 300L720 460M300 270L790 430"/></g>
    <path d="M280 430L475 332L716 397L521 502Z" fill="url(#${prefix}-ground)" stroke="#b4d0e0"/>
    <path d="M280 430L521 502L716 397V404L521 510L280 438Z" fill="#afcbdc"/>
    <ellipse cx="485" cy="451" rx="143" ry="27" fill="#3a7396" opacity=".12"/>
    <g class="scene-outline"><path d="M350 415V164L470 104L650 139V390M350 164L530 199L650 139M530 199V450"/></g>
    <g class="scene-crane" fill="none" stroke="#317ba5" stroke-width="2"><path d="M216 420V107H243V427M216 130H243M216 166H243M216 202H243M216 238H243M216 274H243M216 310H243M216 346H243M216 382H243"/><path d="${lattice}" stroke-width="1.2"/><path d="M140 107H675V88H140ZM230 88V48L140 88M230 48L590 88"/><path d="${jib}" stroke-width="1.1"/><path d="M204 424L252 433L271 423L223 415Z" fill="#c4d9e6"/><path d="M139 108H181V128H139Z" fill="#1a506f"/><path d="M245 109H268V129H245Z" fill="#bddff3"/></g>
    <g class="scene-building">${floors}</g>
    <g class="scene-rig" fill="none" stroke="#3b7494" stroke-width="1.4"><path class="cable" d="M500 107V300"/><path class="slings" d="M500 300L420 355M500 300L590 360"/><rect class="trolley" x="490" y="101" width="20" height="10" rx="2" fill="#1e5b7f"/></g>
    <g class="scene-detail"><path d="M330 445L510 483M330 439v12m180 26v12M681 395L681 176m-5 219h12m-12-219h12"/></g>
    <g fill="#4c7c98" font-family="Arial,sans-serif" font-size="8" letter-spacing="1.5"><text x="355" y="486">EDIL FORTE / VISIONE IN COSTRUZIONE</text><text x="697" y="290" transform="rotate(-90 697 290)">DAL SEGNO ALLO SPAZIO</text></g></svg>`;
}
function createScene(container,prefix){
  container.innerHTML=sceneMarkup(prefix);
  const floors=[...container.querySelectorAll('.scene-floor')],rig=container.querySelector('.scene-rig'),cable=container.querySelector('.cable'),slings=container.querySelector('.slings'),trolley=container.querySelector('.trolley');
  return(progress,animated=true)=>{
    const phase=clamp(progress)*5,active=Math.min(4,Math.floor(phase)),local=clamp(phase-active);
    floors.forEach((floor,i)=>{const p=ease(clamp(phase-i));floor.style.opacity=phase>=i?String(clamp(p*4)):'0';floor.setAttribute('transform',`translate(${(1-p)*75} ${-i*42-(1-p)*42})`);});
    const p=ease(local),x=500+(1-p)*75,y=Math.max(110,315-active*42-(1-p)*42);
    rig.style.opacity=animated&&progress<.99?'1':'0';cable.setAttribute('d',`M${x} 107V${y}`);slings.setAttribute('d',`M${x} ${y}L${x-80} ${y+40}M${x} ${y}L${x+90} ${y+45}`);trolley.setAttribute('x',String(x-10));
  };
}
const intro=document.querySelector('.intro'),drawIntro=createScene(document.querySelector('.intro-scene'),'intro'),drawBlueprint=createScene(document.querySelector('.blueprint-scene'),'blueprint'),replay=document.querySelector('.replay');
let introFrame=0,safetyTimer=0,closeTimer=0,introOrigin=null,returnFocus=null;
function closeIntro(immediate=false){
  if(!intro.open)return;
  cancelAnimationFrame(introFrame);clearTimeout(safetyTimer);clearTimeout(closeTimer);intro.classList.add('is-closing');
  const finish=()=>{intro.close();intro.classList.remove('is-closing');document.body.classList.remove('intro-open');document.body.classList.add('hero-enter');if(returnFocus){returnFocus.focus({preventScroll:true});returnFocus=null;}};
  if(immediate||reducedMotion.matches)finish();else closeTimer=setTimeout(finish,600);
}
function openIntro(isReplay=false){
  if(reducedMotion.matches||typeof intro.showModal!=='function')return;
  clearTimeout(closeTimer);cancelAnimationFrame(introFrame);clearTimeout(safetyTimer);returnFocus=isReplay?replay:null;introOrigin=null;drawIntro(0);intro.classList.remove('is-closing');document.body.classList.add('intro-open');document.body.classList.remove('hero-enter');intro.showModal();
  try{sessionStorage.setItem('edilforte-intro-v2','seen');}catch{}
  const labels=['Le fondamenta','La struttura','La forma','I dettagli','Nuove prospettive'];
  const tick=now=>{if(!intro.open)return;if(introOrigin===null)introOrigin=now;const elapsed=now-introOrigin,progress=clamp((elapsed-180)/3900);drawIntro(progress);const phase=Math.min(4,Math.floor(progress*5));document.querySelector('.intro-status').textContent=labels[phase];document.querySelector('.intro-count').textContent=`0${phase+1} — 05`;document.querySelector('.intro-track span').style.transform=`scaleX(${progress})`;if(elapsed>=4600)closeIntro();else introFrame=requestAnimationFrame(tick);};
  introFrame=requestAnimationFrame(tick);safetyTimer=setTimeout(()=>closeIntro(true),6500);
}
document.querySelector('.skip-intro').addEventListener('click',()=>closeIntro());intro.addEventListener('cancel',e=>{e.preventDefault();closeIntro(true);});replay.addEventListener('click',()=>openIntro(true));
let seen=false;try{seen=sessionStorage.getItem('edilforte-intro-v2')==='seen';}catch{}
if(!seen)openIntro();else document.body.classList.add('hero-enter');
// Reveal only below the fold: document content stays accessible without JS.
let revealObserver;
if(!reducedMotion.matches&&'IntersectionObserver'in window){revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');revealObserver.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.profile-copy>*,.portrait,.section-heading,.project,.heritage-top,.timeline article,.contact>h2,.contact-bottom').forEach(node=>{if(node.getBoundingClientRect().top>window.innerHeight){node.classList.add('reveal-ready');revealObserver.observe(node);}});}
const construction=document.querySelector('.construction'),steps=[...document.querySelectorAll('.build-step')],hero=document.querySelector('.hero'),readingProgress=document.querySelector('.reading-progress');
let scrollFrame=0;
function updateScroll(){scrollFrame=0;const max=document.documentElement.scrollHeight-window.innerHeight;readingProgress.style.transform=`scaleX(${max>0?clamp(window.scrollY/max):0})`;if(reducedMotion.matches){drawBlueprint(1,false);return;}const heroRect=hero.getBoundingClientRect();if(window.innerWidth>760&&heroRect.bottom>0)hero.style.setProperty('--hero-offset',`${clamp(-heroRect.top,0,900)*.12}px`);const rect=construction.getBoundingClientRect();if(rect.bottom>0&&rect.top<window.innerHeight){const travel=Math.max(1,construction.offsetHeight-window.innerHeight),p=clamp((window.innerHeight*.12-rect.top)/(travel+window.innerHeight*.12));drawBlueprint(.14+p*.86,p<.98);steps.forEach((step,i)=>step.style.setProperty('--step-progress',String(clamp(p*3-i))));}}
function requestScroll(){if(!scrollFrame&&!document.hidden)scrollFrame=requestAnimationFrame(updateScroll);}
function configureMotion(){construction.classList.toggle('motion-scroll',!reducedMotion.matches);if(reducedMotion.matches){closeIntro(true);revealObserver?.disconnect();document.querySelectorAll('.reveal-ready').forEach(n=>n.classList.add('in-view'));hero.style.removeProperty('--hero-offset');steps.forEach(s=>s.style.setProperty('--step-progress','1'));}drawBlueprint(1,false);requestScroll();}
window.addEventListener('scroll',requestScroll,{passive:true});window.addEventListener('resize',requestScroll,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){closeIntro(true);cancelAnimationFrame(scrollFrame);scrollFrame=0;}else requestScroll();});reducedMotion.addEventListener('change',configureMotion);configureMotion();
const secondPhoto=document.querySelectorAll('.project-photo')[1];const note=document.createElement('small');note.className='image-caption';note.textContent='RENDER DI PROGETTO';secondPhoto.append(note);
