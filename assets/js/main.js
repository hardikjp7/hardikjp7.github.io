/* ══════════════════════════════════
   PROJECT DATA
══════════════════════════════════ */
const PD = [
  {id:1,title:"Applytic",cat:"cloud-native",img:"./assets/images/p13.png",link:"https://github.com/hardikjp7/applytic",desc:"A serverless, AI-driven job application tracker built on AWS that leverages real-time pattern analytics and personalized coaching to optimize your job search."},
  {id:2,title:"GeminiPro ChatBot",cat:"chatbot",img:"./assets/images/p2.png",link:"https://github.com/hardikjp7/GeminiPro-ChatBot",desc:"A conversational chatbot powered by Google's Gemini Pro LLM. Supports multi-turn dialogue with context retention and a clean, responsive web interface."},
  {id:3,title:"AI Research Assistant",cat:"chatbot",img:"./assets/images/p3.png",link:"https://github.com/hardikjp7/Ai-Research-Assistant",desc:"An agentic AI assistant that helps users discover, summarize, and synthesize research papers using LLM-powered retrieval and reasoning."},
  {id:4,title:"Diabetes Prediction With Deployment",cat:"end-to-end",img:"./assets/images/p1.png",link:"https://github.com/hardikjp7/Diabetes-Prediction-With-Deployment",desc:"A full end-to-end ML pipeline for diabetes prediction with live web deployment. Features data preprocessing, model training with hyperparameter tuning, and a Flask interface for real-time predictions."},
  {id:5,title:"ResumeMatcher ATS",cat:"chatbot",img:"./assets/images/p4.png",link:"https://github.com/hardikjp7/ResumeMatcher-ATS",desc:"An ATS clone that uses NLP to score and match resumes against job descriptions, helping candidates optimize their applications with AI-driven feedback."},
  {id:6,title:"Movies Recommender System",cat:"end-to-end",img:"./assets/images/p5.png",link:"https://github.com/hardikjp7/Movies-Recommender-System",desc:"Content-based and collaborative filtering movie recommendation engine with a Streamlit deployment, leveraging cosine similarity on the TMDB dataset."},
  {id:7,title:"GeminiNutri AI",cat:"gen-ai",img:"./assets/images/p6.png",link:"https://github.com/hardikjp7/GeminiNutri-AI",desc:"A generative AI nutrition advisor powered by Gemini. Analyzes food images and text inputs to provide personalized nutritional insights and meal recommendations."},
  {id:8,title:"Fraudulent Transactions Prediction",cat:"end-to-end",img:"./assets/images/p7.png",link:"https://github.com/hardikjp7/Fraudulent-Transactions-Prediction",desc:"An end-to-end fraud detection system using ensemble ML models on highly imbalanced financial transaction data, featuring SMOTE oversampling and CI/CD deployment."},
  {id:9,title:"DeepSeek-R1: RAG for Document Q&A",cat:"gen-ai",img:"./assets/images/p10.png",link:"https://github.com/hardikjp7/DeepSeek-R1-RAG-for-Document-QA",desc:"A Retrieval-Augmented Generation pipeline using DeepSeek-R1 for intelligent document question-answering with vector embeddings and semantic search."},
  {id:10,title:"Groq Multi Chat",cat:"chatbot",img:"./assets/images/p11.png",link:"https://github.com/hardikjp7/GroqMultiChat",desc:"A multi-model chat interface leveraging Groq's ultra-fast inference API letting users compare responses from multiple LLMs side-by-side in real time."},
  {id:11,title:"Blog Gen LLM App",cat:"gen-ai",img:"./assets/images/p12.png",link:"https://github.com/hardikjp7/Blog-Generation-LLM-App",desc:"An LLM-powered blog generation tool that creates structured, well-formatted articles from a topic and keywords using prompt engineering and LangChain."},
];
const CL = {"end-to-end":"End-to-End","gen-ai":"Gen AI","chatbot":"Chatbot / Agents","cloud-native":"Cloud Native"};

/* ══════════════════════════════════
   FADE-IN OBSERVER
══════════════════════════════════ */
const obs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      obs.unobserve(e.target);
    }
  });
}, { threshold: .08 });

function observeAll() {
  document.querySelectorAll('.fi').forEach(el => obs.observe(el));
}
observeAll();

/* ══════════════════════════════════
   GITHUB API HELPERS
══════════════════════════════════ */

// Cache keyed by full "owner/repo" string
const ghCache = {};

// Extract "owner/repo" from a GitHub URL
function repoName(link) {
  // link format: https://github.com/hardikjp7/Repo-Name
  const match = link.match(/github\.com\/(.+)/);
  return match ? match[1] : null;
}

// Fetch repo details — returns { stars } or null on failure
async function fetchRepoData(link) {
  const repo = repoName(link);
  if (!repo) return null;
  if (ghCache[repo]) return ghCache[repo];
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}`);
    if (!r.ok) throw new Error('not ok');
    const d = await r.json();
    const data = { stars: d.stargazers_count };
    ghCache[repo] = data;
    return data;
  } catch {
    return null;
  }
}

// Fetch commit count via commits endpoint — returns length of array
async function fetchCommitCount(link) {
  const repo = repoName(link);
  if (!repo) return '—';
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}/commits?sha=main&per_page=100`);
    if (!r.ok) throw new Error('not ok');
    const d = await r.json();
    return Array.isArray(d) ? d.length : '—';
  } catch {
    return '—';
  }
}

/* ══════════════════════════════════
   RENDER PROJECT CARDS
══════════════════════════════════ */
function renderP(filter) {
  const grid = document.getElementById('pg');
  grid.innerHTML = '';
  const list = filter === 'all' ? PD : PD.filter(p => p.cat === filter);

  list.forEach(p => {
    const c = document.createElement('div');
    c.className = 'pcard fi';
    c.innerHTML = `
      <div class="pthumb">
        <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.style.display='none'"/>
        <div class="pover"></div>
      </div>
      <div class="pbody">
        <div class="pcat">${CL[p.cat] || p.cat}</div>
        <div class="ptitle">
          ${p.title}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        
      </div>`;

    c.addEventListener('click', () => openM(p));
    grid.appendChild(c);
    setTimeout(() => obs.observe(c), 20);

    // Fetch stars — reference the DOM node directly (not by ID) to avoid stale lookups
    const starSpan = c.querySelector('.star-count');
    fetchRepoData(p.link).then(data => {
      if (data) {
        starSpan.textContent = data.stars;
        p.stars = data.stars; // cache on project object for modal reuse
      }
    });
  });
}

/* ══════════════════════════════════
   FILTER BUTTONS
══════════════════════════════════ */
document.getElementById('fb').addEventListener('click', e => {
  const b = e.target.closest('.fbtn');
  if (!b) return;
  document.querySelectorAll('.fbtn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  renderP(b.dataset.f);
});
renderP('all');

/* ══════════════════════════════════
   MODAL — open / close
══════════════════════════════════ */
function openM(p) {
  const mi = document.getElementById('mi');
  mi.style.display = '';
  mi.src = p.img;
  mi.onerror = () => { mi.style.display = 'none'; };

  document.getElementById('mcat').textContent = CL[p.cat] || p.cat;
  document.getElementById('mtitle').textContent = p.title;
  document.getElementById('mdesc').textContent = p.desc;
  document.getElementById('mlink').href = p.link;

  // Stars: already stored on p.stars from card fetch; fallback to live fetch if missing
  const mstarsEl = document.getElementById('mstars');
  if (p.stars != null) {
    mstarsEl.textContent = p.stars;
  } else {
    mstarsEl.textContent = '…';
    fetchRepoData(p.link).then(data => {
      mstarsEl.textContent = data ? data.stars : '—';
      if (data) p.stars = data.stars;
    });
  }

  // Commits: always fetch fresh on modal open
  const mcommitsEl = document.getElementById('mcommits');
  mcommitsEl.textContent = 'loading…';
  fetchCommitCount(p.link).then(n => { mcommitsEl.textContent = n; });

  document.getElementById('mb').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeM() {
  document.getElementById('mb').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('mc').addEventListener('click', closeM);
document.getElementById('mb').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeM();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

/* ══════════════════════════════════
   TYPED ANIMATION
══════════════════════════════════ */
const phrases = ["AI / ML Engineer", "Cloud ML Engineer", "Generative AI Builder", "MLOps Enthusiast"];
let pi = 0, ci = 0, del = false;
const tw = document.getElementById('tw');
function type() {
  const ph = phrases[pi];
  tw.textContent = del ? ph.slice(0, --ci) : ph.slice(0, ++ci);
  if (!del && ci === ph.length) { del = true; setTimeout(type, 1900); return; }
  if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, del ? 50 : 82);
}
type();

/* ══════════════════════════════════
   PARTICLES
══════════════════════════════════ */
const cv = document.getElementById('pcvs'), cx = cv.getContext('2d');
let pts = [];
function rsz() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
rsz();
window.addEventListener('resize', () => { rsz(); initPts(); });
function initPts() {
  pts = [];
  const n = Math.floor(cv.width * cv.height / 16000);
  for (let i = 0; i < n; i++)
    pts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.3 + .4, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, a: Math.random() * .5 + .15 });
}
initPts();
function aniPts() {
  cx.clearRect(0, 0, cv.width, cv.height);
  const dark = document.documentElement.dataset.theme !== 'light';
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
    if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fillStyle = dark ? `rgba(127,255,110,${p.a * .6})` : `rgba(0,100,50,${p.a * .3})`;
    cx.fill();
  });
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 95) {
      cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y);
      cx.strokeStyle = dark ? `rgba(127,255,110,${.07 * (1 - d / 95)})` : `rgba(0,120,60,${.05 * (1 - d / 95)})`;
      cx.lineWidth = .55; cx.stroke();
    }
  }
  requestAnimationFrame(aniPts);
}
aniPts();

/* ══════════════════════════════════
   CURSOR GLOW
══════════════════════════════════ */
const cgEl = document.getElementById('cg');
document.addEventListener('mousemove', e => {
  cgEl.style.left = e.clientX + 'px';
  cgEl.style.top = e.clientY + 'px';
});

/* ══════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════ */
const sb = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  sb.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
});

/* ══════════════════════════════════
   BACK TO TOP
══════════════════════════════════ */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt.classList.toggle('vis', window.scrollY > 400));

/* ══════════════════════════════════
   ACTIVE NAV LINK
══════════════════════════════════ */
const secs = document.querySelectorAll('[id]'), nas = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  nas.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* ══════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════ */
document.getElementById('hb').addEventListener('click', () =>
  document.getElementById('nl').classList.toggle('open')
);
nas.forEach(a => a.addEventListener('click', () =>
  document.getElementById('nl').classList.remove('open')
));

/* ══════════════════════════════════
   THEME TOGGLE
══════════════════════════════════ */
const ttBtn = document.getElementById('tt');
const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunSVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  ttBtn.innerHTML = theme === 'light' ? moonSVG : sunSVG;
  localStorage.setItem('hptheme', theme);
}
ttBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
const saved = localStorage.getItem('hptheme');
if (saved) applyTheme(saved);

/* ══════════════════════════════════
   GITHUB LIVE STATS (Resume section)
══════════════════════════════════ */
async function ghStats() {
  const g = document.getElementById('ghg');
  try {
    const [ur, rr] = await Promise.all([
      fetch('https://api.github.com/users/hardikjp7'),
      fetch('https://api.github.com/users/hardikjp7/repos?per_page=100')
    ]);
    if (!ur.ok) throw new Error('not ok');
    const u = await ur.json();
    const repos = await rr.json();
    const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = repos.reduce((s, r) => s + r.forks_count, 0);
    g.innerHTML = `
      <div class="ghc fi"><span class="ghn">${u.public_repos}</span><div class="ghl">Public Repos</div></div>
      <div class="ghc fi"><span class="ghn">${stars}</span><div class="ghl">Total Stars</div></div>
      <div class="ghc fi"><span class="ghn">${forks}</span><div class="ghl">Total Forks</div></div>
      <div class="ghc fi"><span class="ghn">${u.followers}</span><div class="ghl">Followers</div></div>
      <div class="ghc fi"><span class="ghn">${u.following}</span><div class="ghl">Following</div></div>
      <div class="ghc fi"><span class="ghn">${repos.length}</span><div class="ghl">Repositories</div></div>`;
    g.querySelectorAll('.fi').forEach(el => obs.observe(el));
  } catch {
    g.innerHTML = `<div class="gh-msg"><a href="https://github.com/hardikjp7" target="_blank" style="color:var(--accent)">View GitHub Profile ↗</a></div>`;
  }
}
ghStats(); // ← was missing () in original — this was the bug causing stats not to load
