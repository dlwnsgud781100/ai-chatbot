export class NotificationUI {
  constructor(events) { this.root=document.querySelector('#toast-region');events.on('ui:notify',(notice)=>this.show(notice)); }
  show({message,type='info'}) { const toast=document.createElement('div');toast.className=`toast ${type==='warning'?'warning':type==='error'?'error':''}`;toast.textContent=message;this.root.append(toast);setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(18px)';setTimeout(()=>toast.remove(),180);},2600); }
}
