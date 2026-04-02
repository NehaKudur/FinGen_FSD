// ══════════════════════════════════════════════════════
//  FINGEN — main.js
//  Synthwave BG · Pixel Arcade Sprites · Ticker · FX
// ══════════════════════════════════════════════════════

function initSynthwaveBg() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let offset = 0;
  let starField = [];

  for (let i = 0; i < 180; i++) {
    starField.push({
      x: Math.random(),
      y: Math.random() * 0.65,
      r: Math.random() * 1.8 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      color: ['255,255,255','200,220,255','180,160,255'][Math.floor(Math.random()*3)]
    });
  }

  function drawBg() {
    const W = canvas.width;
    const H = canvas.height;
    const horizon = H * 0.52;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0,    '#0a0018');
    sky.addColorStop(0.35, '#130030');
    sky.addColorStop(0.65, '#1e0045');
    sky.addColorStop(0.85, '#2a005a');
    sky.addColorStop(1,    '#35006a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizon);

    // Stars
    starField.forEach(s => {
      s.twinkle += 0.015;
      const alpha = 0.5 + Math.sin(s.twinkle) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * horizon, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${alpha})`;
      ctx.fill();
    });

    // Horizon glow
    const horizGlow = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 60);
    horizGlow.addColorStop(0,    'rgba(180,0,255,0)');
    horizGlow.addColorStop(0.3,  'rgba(220,0,255,0.35)');
    horizGlow.addColorStop(0.48, 'rgba(255,0,200,0.75)');
    horizGlow.addColorStop(0.5,  'rgba(180,100,255,0.9)');
    horizGlow.addColorStop(0.52, 'rgba(255,0,200,0.75)');
    horizGlow.addColorStop(0.7,  'rgba(220,0,255,0.35)');
    horizGlow.addColorStop(1,    'rgba(180,0,255,0)');
    ctx.fillStyle = horizGlow;
    ctx.fillRect(0, horizon - 60, W, 120);

    // Floor
    const floor = ctx.createLinearGradient(0, horizon, 0, H);
    floor.addColorStop(0,    '#1a0040');
    floor.addColorStop(0.15, '#130035');
    floor.addColorStop(0.4,  '#0a0025');
    floor.addColorStop(0.7,  '#060015');
    floor.addColorStop(1,    '#030008');
    ctx.fillStyle = floor;
    ctx.fillRect(0, horizon, W, H - horizon);

    // ── GRID — more spacious, more dim ──────────────────────
    // Using 80px cell spacing on floor instead of tight lines
    offset = (offset + 0.35) % (H / 8);
    const VP = { x: W / 2, y: horizon };

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, horizon, W, H - horizon);
    ctx.clip();

    // Horizontal lines — fewer, more spaced, dimmer
    const numH = 14;  // was 28 — half as many = twice the spacing
    for (let i = 1; i <= numH; i++) {
      const prog = i / numH;
      const yFloor = horizon + Math.pow(prog, 1.8) * (H - horizon) + offset * Math.pow(prog, 1.5);
      if (yFloor > H || yFloor < horizon) continue;

      const r = Math.floor(0   + prog * 80);
      const g = Math.floor(200 + prog * 30);
      const b = Math.floor(255 - prog * 50);
      // ── Dimmer: max alpha was 0.9, now 0.45
      const alpha = (0.08 + prog * 0.37) * 0.75;

      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 0.4 + prog * 1.2;
      ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
      ctx.shadowBlur = 2 + prog * 6;
      ctx.beginPath();
      ctx.moveTo(0, yFloor);
      ctx.lineTo(W, yFloor);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Vertical lines — fewer, more spacious, dimmer
    const numV = 18;  // was 36 — half = twice the gap
    for (let i = 0; i <= numV; i++) {
      const t = i / numV;
      const xBot = t * W;
      const distFromCenter = Math.abs(t - 0.5) * 2;

      const r = Math.floor(distFromCenter * 100);
      const g = Math.floor(220 - distFromCenter * 80);
      const b = Math.floor(255);
      // ── Dimmer: was up to 0.7 alpha, now max 0.35
      const alpha = (0.06 + (1 - distFromCenter) * 0.29) * 0.75;

      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 0.4 + (1 - distFromCenter) * 0.8;
      ctx.shadowColor = `rgba(${r},${g},${b},0.25)`;
      ctx.shadowBlur = 2 + (1 - distFromCenter) * 7;
      ctx.beginPath();
      ctx.moveTo(VP.x, VP.y);
      ctx.lineTo(xBot, H);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    // ── CEILING GRID — dimmer
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, horizon);
    ctx.clip();
    ctx.globalAlpha = 0.35;  // was 0.75

    for (let i = 0; i <= numV; i++) {
      const t = i / numV;
      const xTop = t * W;
      const distFromCenter = Math.abs(t - 0.5) * 2;

      const r = Math.floor(distFromCenter * 80);
      const g = Math.floor(180 - distFromCenter * 60);
      const b = Math.floor(255);
      const alpha = 0.08 + (1 - distFromCenter) * 0.3;

      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 0.4 + (1 - distFromCenter) * 0.7;
      ctx.shadowColor = `rgba(${r},${g},${b},0.2)`;
      ctx.shadowBlur = 2 + (1 - distFromCenter) * 5;
      ctx.beginPath();
      ctx.moveTo(VP.x, VP.y);
      ctx.lineTo(xTop, 0);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    const numHC = 8;  // was 16
    for (let i = 1; i <= numHC; i++) {
      const prog = i / numHC;
      const yCeil = horizon - Math.pow(prog, 1.8) * horizon;
      if (yCeil < 0) continue;
      const alpha = 0.03 + (1 - prog) * 0.14;
      ctx.strokeStyle = `rgba(100,150,255,${alpha})`;
      ctx.lineWidth = 0.3 + (1 - prog) * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, yCeil);
      ctx.lineTo(W, yCeil);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();

    requestAnimationFrame(drawBg);
  }

  drawBg();
}

// ── PIXEL SPRITE DEFINITIONS ────────────────────────────────────────────────
const SPRITE_DEFS = {
  pacman: {
    size: 14,
    frames: [
      (ctx, s, col) => {
        ctx.fillStyle = col;
        const p = (x,y) => ctx.fillRect(x*s,y*s,s,s);
        [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
         [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
         [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],
         [0,3],[1,3],[2,3],[3,3],[4,3],
         [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
         [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
         [1,6],[2,6],[3,6],[4,6],[5,6],[6,6]
        ].forEach(([x,y])=>p(x,y));
        ctx.fillStyle='#fff'; p(4,1);
      },
      (ctx, s, col) => {
        ctx.fillStyle = col;
        const p = (x,y) => ctx.fillRect(x*s,y*s,s,s);
        [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
         [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
         [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
         [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
         [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
         [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
         [1,6],[2,6],[3,6],[4,6],[5,6],[6,6]
        ].forEach(([x,y])=>p(x,y));
        ctx.fillStyle='#fff'; p(4,1);
      }
    ]
  },
  ghost: {
    size: 10,
    draw: (ctx, s, bodyCol, eyeCol='#fff', pupilCol='#00aaff') => {
      ctx.fillStyle = bodyCol;
      const p = (x,y) => ctx.fillRect(x*s,y*s,s,s);
      [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
       [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
       [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
       [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
       [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
       [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],
       [0,6],[2,6],[3,6],[4,6],[5,6],[7,6],
       [0,7],[7,7]
      ].forEach(([x,y])=>p(x,y));
      ctx.fillStyle = eyeCol;
      [[1,2],[2,2],[5,2],[6,2],[1,3],[2,3],[5,3],[6,3]].forEach(([x,y])=>p(x,y));
      ctx.fillStyle = pupilCol;
      p(2,3); p(6,3);
    }
  },
  cherry: {
    size: 8,
    draw: (ctx, s) => {
      ctx.fillStyle = '#00aa44';
      [[2,0],[3,0],[4,0],[3,1],[2,2]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ff2222';
      [[0,3],[1,3],[2,3],[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ff2222';
      [[3,2],[4,2],[5,2],[3,3],[4,3],[5,3],[6,3],[3,4],[4,4],[5,4]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ff6666';
      ctx.fillRect(1*s,4*s,s,s); ctx.fillRect(4*s,3*s,s,s);
    }
  },
  star: {
    size: 8,
    draw: (ctx, s, col='#ffd700') => {
      ctx.fillStyle = col;
      [[2,0],[3,0],[1,1],[2,1],[3,1],[4,1],
       [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],
       [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],
       [1,4],[2,4],[3,4],[4,4],[0,5],[5,5],[1,6],[4,6]
      ].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
    }
  },
  strawberry: {
    size: 8,
    draw: (ctx, s) => {
      ctx.fillStyle = '#00aa44';
      [[3,0],[2,1],[3,1],[4,1]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ff3344';
      [[1,2],[2,2],[3,2],[4,2],[5,2],
       [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
       [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
       [1,5],[2,5],[3,5],[4,5],[5,5],[2,6],[3,6],[4,6],[3,7]
      ].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ffaaaa';
      [[2,3],[4,4]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
    }
  },
  coin: {
    size: 9,
    draw: (ctx, s) => {
      ctx.fillStyle = '#ffd700';
      [[1,0],[2,0],[3,0],[4,0],[5,0],
       [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
       [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
       [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
       [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
       [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
       [1,6],[2,6],[3,6],[4,6],[5,6]
      ].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#ffaa00';
      [[2,1],[3,1],[2,5],[3,5]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
      ctx.fillStyle = '#fff8aa';
      ctx.fillRect(2*s,2*s,s,s);
      ctx.fillStyle = '#cc7700';
      [[3,2],[3,3],[3,4]].forEach(([x,y])=>ctx.fillRect(x*s,y*s,s,s));
    }
  }
};

function buildSprite(defKey, options={}) {
  const def = SPRITE_DEFS[defKey];
  if (!def) return null;
  const s = options.scale || 3;
  let w, h;
  if (defKey==='pacman')     { w=7*s+s; h=7*s+s; }
  else if (defKey==='ghost') { w=8*s+s; h=8*s+s; }
  else if (defKey==='cherry'){ w=7*s;   h=8*s; }
  else if (defKey==='star')  { w=6*s;   h=7*s; }
  else if (defKey==='strawberry') { w=7*s; h=8*s; }
  else if (defKey==='coin')  { w=7*s;   h=7*s; }
  else { w=8*s; h=8*s; }

  if (defKey==='pacman') {
    return [0,1].map(fi => {
      const c=document.createElement('canvas');
      c.width=w; c.height=h;
      def.frames[fi](c.getContext('2d'), s, options.color||'#ffd700');
      return c;
    });
  }
  const c=document.createElement('canvas');
  c.width=w; c.height=h;
  const cx=c.getContext('2d');
  if (defKey==='ghost') def.draw(cx,s,options.bodyColor||'#ff0000','#fff',options.pupilColor||'#0055ff');
  else def.draw(cx,s,options.color);
  return c;
}

function createFloatingCoins() {
  const container = document.getElementById('floatingCoins');
  if (!container) return;

  const pacColors = ['#ffd700','#ffaa00','#ffe066'];
  pacColors.forEach((col, i) => {
    const frames = buildSprite('pacman', { scale:3, color:col });
    if (!frames) return;
    const el = document.createElement('img');
    el.style.cssText = `position:absolute;image-rendering:pixelated;top:${20+i*22}%;left:0;filter:drop-shadow(0 0 6px ${col});animation:walkRight ${14+i*4}s linear ${i*-4}s infinite;`;
    el.src = frames[0].toDataURL();
    container.appendChild(el);
    let frame=0;
    setInterval(()=>{ frame=1-frame; el.src=frames[frame].toDataURL(); },200);
  });

  const ghostConfigs = [
    {bodyColor:'#ff2222',pupilColor:'#0055ff',top:'10%',anim:'ghostFloat 3.2s ease-in-out infinite'},
    {bodyColor:'#00aaff',pupilColor:'#0022aa',top:'55%',anim:'ghostFloat 2.8s ease-in-out 0.5s infinite'},
    {bodyColor:'#ff66cc',pupilColor:'#660044',top:'35%',anim:'ghostFloat 3.5s ease-in-out 1s infinite'},
    {bodyColor:'#ff6600',pupilColor:'#661100',top:'72%',anim:'ghostFloat 2.6s ease-in-out 1.8s infinite'},
    {bodyColor:'#aaaaaa',pupilColor:'#334466',top:'20%',anim:'ghostFloat 4s ease-in-out 0.8s infinite'},
  ];
  ghostConfigs.forEach((cfg,i) => {
    const c=buildSprite('ghost',{scale:3,bodyColor:cfg.bodyColor,pupilColor:cfg.pupilColor});
    if (!c) return;
    const el=document.createElement('img');
    el.style.cssText=`position:absolute;image-rendering:pixelated;top:${cfg.top};left:${5+i*18}%;filter:drop-shadow(0 0 8px ${cfg.bodyColor});animation:${cfg.anim};opacity:0.85;`;
    el.src=c.toDataURL();
    container.appendChild(el);
  });

  [{bodyColor:'#ff2222',pupilColor:'#0055ff'},{bodyColor:'#b44fff',pupilColor:'#330066'}].forEach((cfg,i)=>{
    const c=buildSprite('ghost',{scale:4,bodyColor:cfg.bodyColor,pupilColor:cfg.pupilColor});
    if (!c) return;
    const el=document.createElement('img');
    el.style.cssText=`position:absolute;image-rendering:pixelated;top:${30+i*30}%;left:0;filter:drop-shadow(0 0 12px ${cfg.bodyColor});animation:zoomAcross ${8+i*5}s linear ${i*3}s infinite;opacity:0.9;`;
    el.src=c.toDataURL();
    container.appendChild(el);
  });

  [0,1].forEach(i=>{
    const c=buildSprite('cherry',{scale:3});
    if (!c) return;
    const el=document.createElement('img');
    el.style.cssText=`position:absolute;image-rendering:pixelated;top:${60+i*15}%;left:${10+i*55}%;filter:drop-shadow(0 0 6px #ff2222);animation:fruitBounce ${2.5+i*0.8}s ease-in-out ${i*0.5}s infinite;opacity:0.9;`;
    el.src=c.toDataURL();
    container.appendChild(el);
  });

  const straw=buildSprite('strawberry',{scale:3});
  if (straw){
    const el=document.createElement('img');
    el.style.cssText=`position:absolute;image-rendering:pixelated;top:75%;right:12%;filter:drop-shadow(0 0 6px #ff3344);animation:fruitBounce 2.2s ease-in-out 1.2s infinite;opacity:0.9;`;
    el.src=straw.toDataURL();
    container.appendChild(el);
  }

  for (let i=0;i<8;i++){
    const c=buildSprite('coin',{scale:2});
    if (!c) return;
    const el=document.createElement('img');
    el.style.cssText=`position:absolute;image-rendering:pixelated;left:${Math.random()*90+5}%;bottom:-60px;filter:drop-shadow(0 0 8px #ffd700);animation:floatCoinUp ${8+Math.random()*10}s linear ${Math.random()*12}s infinite;opacity:0;`;
    el.src=c.toDataURL();
    container.appendChild(el);
  }

  const starColors=['#ffd700','#00e5ff','#ff6ec7','#b44fff'];
  const starPositions=[{top:'8%',left:'5%'},{top:'12%',right:'8%'},{top:'45%',left:'2%'},{top:'38%',right:'3%'},{bottom:'25%',left:'6%'},{bottom:'30%',right:'5%'}];
  starPositions.forEach((pos,i)=>{
    const col=starColors[i%starColors.length];
    const c=buildSprite('star',{scale:3,color:col});
    if (!c) return;
    const el=document.createElement('img');
    let posStr='';
    Object.entries(pos).forEach(([k,v])=>posStr+=`${k}:${v};`);
    el.style.cssText=`position:absolute;image-rendering:pixelated;${posStr}filter:drop-shadow(0 0 8px ${col});animation:starTwinkle ${1.5+i*0.4}s ease-in-out ${i*0.3}s infinite;opacity:0.9;`;
    el.src=c.toDataURL();
    container.appendChild(el);
  });

  const style=document.createElement('style');
  style.textContent=`@keyframes floatCoinUp{0%{opacity:0;transform:translateY(0) rotate(0deg);}8%{opacity:0.9;}92%{opacity:0.9;}100%{opacity:0;transform:translateY(-110vh) rotate(360deg);}}`;
  document.head.appendChild(style);
}

// ── HERO TICKER LOADER ──────────────────────────────────────────────────────
function initHeroTicker() {
  const fill=document.getElementById('tickerFill');
  const pct=document.getElementById('tickerPct');
  if (!fill||!pct) return;
  let progress=0;
  const interval=setInterval(()=>{
    const step=progress<70?1.8:progress<90?0.8:0.3;
    progress=Math.min(progress+step,100);
    fill.style.width=progress+'%';
    pct.textContent=Math.floor(progress)+'%';
    if (progress>=100){
      clearInterval(interval);
      pct.style.color='#00ff88';
      setTimeout(()=>{pct.textContent='READY';pct.style.animation='none';},300);
    }
  },40);
}

// ── CARD HOVER PARTICLES ────────────────────────────────────────────────────
function initCardParticles() {
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mouseenter',(e)=>{
      for (let i=0;i<6;i++) spawnParticle(e.currentTarget,i*60);
    });
  });
}

function spawnParticle(card,delay) {
  const rect=card.getBoundingClientRect();
  const p=document.createElement('div');
  p.style.cssText=`position:fixed;width:4px;height:4px;border-radius:0;background:${Math.random()>0.5?'#ffd700':'#00aaff'};pointer-events:none;z-index:9998;left:${rect.left+Math.random()*rect.width}px;top:${rect.top+rect.height*0.8}px;box-shadow:0 0 4px currentColor;image-rendering:pixelated;`;
  document.body.appendChild(p);
  const dx=(Math.random()-0.5)*80;
  const dy=-(Math.random()*60+20);
  setTimeout(()=>{
    p.style.transition='all 0.7s ease-out';
    p.style.transform=`translate(${dx}px,${dy}px)`;
    p.style.opacity='0';
    setTimeout(()=>p.remove(),750);
  },delay);
}

// ── SCROLL REVEAL ───────────────────────────────────────────────────────────
function initScrollReveal() {
  const targets=document.querySelectorAll('.card,.feature,.section-header');
  targets.forEach(el=>{
    el.style.opacity='0';
    el.style.transform='translateY(30px)';
    el.style.transition='opacity 0.6s ease, transform 0.6s ease';
  });
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry,idx)=>{
      if (entry.isIntersecting){
        setTimeout(()=>{
          entry.target.style.opacity='1';
          entry.target.style.transform='translateY(0)';
        },idx*80);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  targets.forEach(el=>observer.observe(el));
}

// ── NAVBAR SCROLL ───────────────────────────────────────────────────────────
function initNavbarScroll() {
  const navbar=document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll',()=>{
    if (window.scrollY>40){
      navbar.style.background='rgba(5,0,15,0.97)';
      navbar.style.borderBottom='1px solid rgba(180,79,255,0.6)';
      navbar.style.boxShadow='0 0 40px rgba(139,0,255,0.25)';
    } else {
      navbar.style.background='rgba(10,0,25,0.93)';
      navbar.style.borderBottom='1px solid rgba(180,79,255,0.4)';
      navbar.style.boxShadow='0 0 30px rgba(139,0,255,0.2)';
    }
  });
}

// ── PIXEL CURSOR TRAIL ──────────────────────────────────────────────────────
function initCursorTrail() {
  const trail=[];
  const TRAIL_LEN=8;
  document.addEventListener('mousemove',(e)=>{
    const dot=document.createElement('div');
    dot.style.cssText=`position:fixed;left:${e.clientX-2}px;top:${e.clientY-2}px;width:4px;height:4px;border-radius:0;background:${Math.random()>0.5?'#00aaff':'#ffd700'};pointer-events:none;z-index:9997;image-rendering:pixelated;box-shadow:0 0 4px currentColor;`;
    document.body.appendChild(dot);
    trail.push(dot);
    setTimeout(()=>{dot.style.transition='opacity 0.3s';dot.style.opacity='0';setTimeout(()=>dot.remove(),300);},80);
    if (trail.length>TRAIL_LEN){const old=trail.shift();if(old.parentNode)old.remove();}
  });
}

// ── BUTTON RIPPLES ──────────────────────────────────────────────────────────
function initButtonRipples() {
  document.querySelectorAll('.cta-btn,.card-button,.nav-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      const rect=this.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      const ripple=document.createElement('span');
      ripple.style.cssText=`position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(0);width:120px;height:120px;background:rgba(255,255,255,0.2);border-radius:50%;pointer-events:none;animation:rippleOut 0.5s ease-out forwards;`;
      if (!['relative','absolute','fixed'].includes(getComputedStyle(this).position)) this.style.position='relative';
      this.style.overflow='hidden';
      this.appendChild(ripple);
      setTimeout(()=>ripple.remove(),500);
    });
  });
  if (!document.getElementById('rippleStyle')){
    const style=document.createElement('style');
    style.id='rippleStyle';
    style.textContent=`@keyframes rippleOut{to{transform:translate(-50%,-50%) scale(3);opacity:0;}}`;
    document.head.appendChild(style);
  }
}

// ── GLITCH EFFECT — turquoise static glitch ─────────────────────────────────
// Colors: shades of turquoise/teal — #00e5ff, #00ffcc, #40e0d0, #00b4d8, #7fffd4
function initGlitchEffect() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const teal1 = '#00e5ff';  // electric cyan-teal
  const teal2 = '#00ffcc';  // mint teal
  const teal3 = '#40e0d0';  // classic turquoise
  const teal4 = '#00b4d8';  // deep cyan
  const teal5 = '#7fffd4';  // aquamarine

  // Static persistent offset — always slightly skewed
  title.style.textShadow = `1px 0 ${teal4}, -1px 0 ${teal2}`;

  // Occasional strong glitch bursts
  function doGlitch() {
    const intensity = Math.random();

    if (intensity > 0.5) {
      // Strong glitch: big offset, strong colors
      const ox1 = (Math.random() - 0.5) * 10;
      const ox2 = (Math.random() - 0.5) * 8;
      const skew = (Math.random() - 0.5) * 2.5;

      title.style.textShadow = `${ox1}px 0 ${teal1}, ${ox2}px 0 ${teal3}, 0 0 12px ${teal2}`;
      title.style.transform  = `skewX(${skew}deg) translateX(${ox1 * 0.3}px)`;
      title.style.filter     = `brightness(1.3) hue-rotate(10deg)`;

      // Sub-flash within the glitch
      setTimeout(() => {
        title.style.textShadow = `${-ox2}px 0 ${teal5}, ${ox1*0.5}px 0 ${teal4}`;
        title.style.transform  = `skewX(${-skew*0.5}deg)`;
        title.style.filter     = `brightness(1.1)`;
      }, 60);

      setTimeout(() => {
        // Settle back to subtle static
        title.style.textShadow = `1px 0 ${teal4}, -1px 0 ${teal2}`;
        title.style.transform  = '';
        title.style.filter     = '';
      }, 120);

    } else {
      // Soft flicker — just a quick teal shadow shift
      const ox = (Math.random() - 0.5) * 4;
      title.style.textShadow = `${ox}px 0 ${teal3}, ${-ox}px 0 ${teal1}, 0 0 6px ${teal5}`;
      setTimeout(() => {
        title.style.textShadow = `1px 0 ${teal4}, -1px 0 ${teal2}`;
      }, 70);
    }

    // Schedule next glitch — random interval between 1.2s and 4s
    const next = 1200 + Math.random() * 2800;
    setTimeout(doGlitch, next);
  }

  // Start after a short delay
  setTimeout(doGlitch, 800);
}

// ── PARALLAX (minimal, no orbs) ─────────────────────────────────────────────
function initParallax() {}

// ── EASTER EGG ──────────────────────────────────────────────────────────────
let clickCount = 0;
function initEasterEgg() {
  const logo = document.querySelector('.logo-circle');
  if (!logo) return;
  logo.addEventListener('click', () => {
    clickCount++;
    spawnParticle(logo, 0);
    spawnParticle(logo, 100);
    spawnParticle(logo, 200);
    if (clickCount===5){
      showArcadeMessage('INSERT COIN ×5 — BONUS ROUND!');
      clickCount=0;
    }
  });
}

function showArcadeMessage(text) {
  const msg=document.createElement('div');
  msg.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background:rgba(0,5,20,0.95);border:2px solid #ffd700;color:#ffd700;font-family:'Press Start 2P',monospace;font-size:0.7rem;padding:24px 36px;text-align:center;box-shadow:0 0 40px rgba(255,215,0,0.5);animation:arcadeMsg 0.4s cubic-bezier(0.34,1.56,0.64,1);letter-spacing:1px;line-height:2;`;
  msg.textContent=text;
  document.body.appendChild(msg);
  if (!document.getElementById('arcadeMsgStyle')){
    const s=document.createElement('style');
    s.id='arcadeMsgStyle';
    s.textContent=`@keyframes arcadeMsg{from{transform:translate(-50%,-50%) scale(0.5);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}`;
    document.head.appendChild(s);
  }
  setTimeout(()=>{msg.style.transition='opacity 0.4s';msg.style.opacity='0';setTimeout(()=>msg.remove(),400);},2500);
}

// ── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSynthwaveBg();
  createFloatingCoins();
  initHeroTicker();
  initScrollReveal();
  initNavbarScroll();
  initCursorTrail();
  initButtonRipples();
  initGlitchEffect();
  initParallax();
  initCardParticles();
  initEasterEgg();
});