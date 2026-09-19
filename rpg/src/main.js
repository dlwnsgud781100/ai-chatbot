import { GameBootstrap } from './core/game-bootstrap.js';

const bootstrap=new GameBootstrap();
bootstrap.initialize().catch((error)=>{
  console.error('Ashenwild bootstrap failed',error);
  const loader=document.querySelector('#loading-screen');
  if(loader)loader.innerHTML='<div class="loader-mark">!</div><strong>월드 초기화에 실패했습니다</strong><span>브라우저 콘솔에서 상세 오류를 확인해 주세요.</span>';
});

// Intentional development seam: inspect only through an explicit query flag.
if(new URLSearchParams(location.search).has('debug')) window.Ashenwild=bootstrap;
