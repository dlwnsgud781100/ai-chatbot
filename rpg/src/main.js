import { GameBootstrap } from './core/game-bootstrap.js';

const showFatal=(error)=>{
  console.error('Ashenwild bootstrap failed',error);
  document.querySelector('#loading-screen')?.remove();
  let root=document.querySelector('#fatal-fallback');
  if(!root){root=document.createElement('section');root.id='fatal-fallback';root.className='fatal-fallback';root.dataset.testid='renderer-fallback';document.body.append(root);}
  root.innerHTML='<div><span class="eyebrow">ASHENWILD FRONTIER</span><h1>월드를 시작할 수 없습니다</h1><p>그래픽 기능 또는 필수 데이터를 준비하지 못했습니다.<br>브라우저를 새로고침한 뒤 다시 시도해 주세요.</p><button type="button" data-retry>다시 시도</button></div>';
  root.querySelector('[data-retry]').onclick=()=>location.reload();
};

try {
  const bootstrap=new GameBootstrap();
  bootstrap.initialize().catch(showFatal);
  // Intentional development seam: inspect only through an explicit query flag.
  if(new URLSearchParams(location.search).has('debug'))window.Ashenwild=bootstrap;
} catch(error) { showFatal(error); }

window.addEventListener('error',(event)=>{if(event.target?.tagName==='CANVAS'||/WebGL/i.test(event.message??''))showFatal(event.error??event.message);},{capture:true});
