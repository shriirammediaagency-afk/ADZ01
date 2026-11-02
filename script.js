(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preloader
  window.addEventListener('load', () => setTimeout(() => $('.preloader')?.classList.add('done'), 450));
  $('#year').textContent = new Date().getFullYear();

  // Mobile navigation
  const menuBtn = $('.menu-toggle'), navLinks = $('.nav-links');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false');
  }));

  // Sticky header and back-to-top
  const topBtn = $('.back-top');
  window.addEventListener('scroll', () => {
    $('.nav-wrap').classList.toggle('scrolled', scrollY > 25);
    topBtn.classList.toggle('show', scrollY > 550);
  }, {passive:true});
  topBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));

  // Reveal-on-scroll fallback; GSAP enhancement when available
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }), {threshold:.12});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));
  const gsapTry = () => {
    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      gsap.registerPlugin(ScrollTrigger);
      $$('.process-item').forEach((el,i)=>gsap.from(el,{opacity:0,x:-25,duration:.7,delay:i*.04,scrollTrigger:{trigger:el,start:'top 88%'}}));
    }
  };
  window.addEventListener('load', gsapTry);

  // Lightweight canvas particle field (no Three.js dependency)
  const canvas = $('#particles'), ctx = canvas.getContext('2d');
  let particles = [], w, h, raf;
  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=Array.from({length:Math.min(90,Math.floor(w/13))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.4}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(112,220,245,.65)';ctx.fill();
      for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<115){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(111,135,235,${(1-d/115)*.14})`;ctx.stroke();}}
    });
    if(!reduceMotion)raf=requestAnimationFrame(draw);
  }
  resize();draw();window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();});

  // Custom cursor on pointer devices
  if(matchMedia('(pointer:fine)').matches && !reduceMotion){
    const dot=$('.cursor-dot'),ring=$('.cursor-ring');let mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
    (function follow(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(follow)})();
    $$('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width='44px';ring.style.height='44px'});el.addEventListener('mouseleave',()=>{ring.style.width='28px';ring.style.height='28px'});});
  }

  // Portfolio filters and project details
  $$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    $$('.work-card').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter);
  }));
  const projects=[
    ['Performance with a point of view','Challenge: make a complex offer easier to understand. Approach: a focused message hierarchy, creative testing and a conversion-minded landing experience. Results: add verified campaign outcomes here before publication.'],
    ['A brand with room to grow','Challenge: create a recognisable identity across touchpoints. Approach: build a flexible visual language, clear typography and practical brand guidelines. Results: insert approved client feedback or measured impact.'],
    ['Stories made to travel','Challenge: earn attention in a fast-moving feed. Approach: develop a short-form content system with a strong opening, clear narrative and platform-native edits. Results: add verified reach and engagement data.']
  ];
  const modal=$('#projectModal');
  $$('.project-open').forEach(btn=>btn.addEventListener('click',()=>{
    const item=projects[Number(btn.dataset.project)];$('#modalTitle').textContent=item[0];$('#modalText').textContent=item[1];modal.hidden=false;$('.modal-close').focus();
  }));
  const closeModal=()=>modal.hidden=true;
  $('.modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('.chat-panel').hidden=true}});

  // Quote form front-end validation. Connect Formspree/CRM/backend before launch.
  $('#quoteForm').addEventListener('submit',e=>{
    e.preventDefault();const form=e.currentTarget;
    if(!form.reportValidity())return;
    $('.form-status',form).textContent='Thanks — your details are ready. Connect this form to your CRM or email endpoint to receive submissions.';
    $('.form-status',form).style.color='#8df4c5';form.reset();
  });

  // Ask Adzinox UI demo
  const chat=$('.chat-panel');
  $('.chat-launch').addEventListener('click',()=>chat.hidden=!chat.hidden);
  $('.chat-close').addEventListener('click',()=>chat.hidden=true);
  $$('.chat-options button').forEach(b=>b.addEventListener('click',()=>{chat.querySelector('p').textContent='Great choice. Send us a project enquiry and our team can take it forward.';$$('.chat-options button').forEach(x=>x.hidden=true)}));

  // Newsletter demo: validates locally; connect your mailing platform to store subscriptions.
  $('#newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    $('#newsletterStatus').textContent = 'Thanks for your interest. Connect an email platform to complete subscription.';
    $('#newsletterStatus').style.color = '#8df4c5';
    e.currentTarget.reset();
  });

  // Cookie notice — simple dismissal only; no cookie is written.
  $('.cookie-ok').addEventListener('click',()=>$('.cookie-banner').remove());
})();