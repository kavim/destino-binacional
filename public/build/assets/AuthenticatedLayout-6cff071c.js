import{r as m,a as i,j as L,F as pe,d as ce,R as b,q as ve}from"./app-8ca41458.js";import{A as ye}from"./ApplicationLogo-954a2f84.js";import{t as be}from"./transition-b9bc6261.js";import{R as V}from"./ResponsiveNavLink-75ead759.js";import{c as A}from"./clsx.m-1229b3e0.js";const de=m.createContext(),ne=({children:e})=>{const[t,o]=m.useState(!1),s=()=>{o(c=>!c)};return i(de.Provider,{value:{open:t,setOpen:o,toggleOpen:s},children:i("div",{className:"relative",children:e})})},xe=({children:e})=>{const{open:t,setOpen:o,toggleOpen:s}=m.useContext(de);return L(pe,{children:[i("div",{onClick:s,children:e}),t&&i("div",{className:"fixed inset-0 z-40",onClick:()=>o(!1)})]})},Te=({align:e="right",width:t="48",contentClasses:o="py-1 bg-white dark:bg-gray-700",children:s})=>{const{open:c,setOpen:l}=m.useContext(de);let n="origin-top";e==="left"?n="origin-top-left left-0":e==="right"&&(n="origin-top-right right-0");let r="";return t==="48"&&(r="w-48"),i(pe,{children:i(be,{as:m.Fragment,show:c,enter:"transition ease-out duration-200",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:i("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${n} ${r}`,onClick:()=>l(!1),children:i("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+o,children:s})})})})},Ee=({className:e="",children:t,...o})=>i(ce,{...o,className:"block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "+e,children:t});ne.Trigger=xe;ne.Content=Te;ne.Link=Ee;const W=ne;function G({active:e=!1,className:t="",children:o,...s}){return i(ce,{...s,className:"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none "+(e?"border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 ":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ")+t,children:o})}const X=e=>typeof e=="number"&&!isNaN(e),j=e=>typeof e=="string",I=e=>typeof e=="function",ee=e=>j(e)||I(e)?e:null,se=e=>m.isValidElement(e)||j(e)||I(e)||X(e);function Ce(e,t,o){o===void 0&&(o=300);const{scrollHeight:s,style:c}=e;requestAnimationFrame(()=>{c.minHeight="initial",c.height=s+"px",c.transition=`all ${o}ms`,requestAnimationFrame(()=>{c.height="0",c.padding="0",c.margin="0",setTimeout(t,o)})})}function oe(e){let{enter:t,exit:o,appendPosition:s=!1,collapse:c=!0,collapseDuration:l=300}=e;return function(n){let{children:r,position:C,preventExitTransition:T,done:x,nodeRef:h,isIn:N}=n;const d=s?`${t}--${C}`:t,f=s?`${o}--${C}`:o,p=m.useRef(0);return m.useLayoutEffect(()=>{const a=h.current,u=d.split(" "),E=w=>{w.target===h.current&&(a.dispatchEvent(new Event("d")),a.removeEventListener("animationend",E),a.removeEventListener("animationcancel",E),p.current===0&&w.type!=="animationcancel"&&a.classList.remove(...u))};a.classList.add(...u),a.addEventListener("animationend",E),a.addEventListener("animationcancel",E)},[]),m.useEffect(()=>{const a=h.current,u=()=>{a.removeEventListener("animationend",u),c?Ce(a,x,l):x()};N||(T?u():(p.current=1,a.className+=` ${f}`,a.addEventListener("animationend",u)))},[N]),b.createElement(b.Fragment,null,r)}}function ue(e,t){return e!=null?{content:e.content,containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,status:t}:{}}const M={list:new Map,emitQueue:new Map,on(e,t){return this.list.has(e)||this.list.set(e,[]),this.list.get(e).push(t),this},off(e,t){if(t){const o=this.list.get(e).filter(s=>s!==t);return this.list.set(e,o),this}return this.list.delete(e),this},cancelEmit(e){const t=this.emitQueue.get(e);return t&&(t.forEach(clearTimeout),this.emitQueue.delete(e)),this},emit(e){this.list.has(e)&&this.list.get(e).forEach(t=>{const o=setTimeout(()=>{t(...[].slice.call(arguments,1))},0);this.emitQueue.has(e)||this.emitQueue.set(e,[]),this.emitQueue.get(e).push(o)})}},J=e=>{let{theme:t,type:o,...s}=e;return b.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${o})`,...s})},ae={info:function(e){return b.createElement(J,{...e},b.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return b.createElement(J,{...e},b.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return b.createElement(J,{...e},b.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return b.createElement(J,{...e},b.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return b.createElement("div",{className:"Toastify__spinner"})}};function Ne(e){const[,t]=m.useReducer(d=>d+1,0),[o,s]=m.useState([]),c=m.useRef(null),l=m.useRef(new Map).current,n=d=>o.indexOf(d)!==-1,r=m.useRef({toastKey:1,displayedToast:0,count:0,queue:[],props:e,containerId:null,isToastActive:n,getToast:d=>l.get(d)}).current;function C(d){let{containerId:f}=d;const{limit:p}=r.props;!p||f&&r.containerId!==f||(r.count-=r.queue.length,r.queue=[])}function T(d){s(f=>d==null?[]:f.filter(p=>p!==d))}function x(){const{toastContent:d,toastProps:f,staleId:p}=r.queue.shift();N(d,f,p)}function h(d,f){let{delay:p,staleId:a,...u}=f;if(!se(d)||function(R){return!c.current||r.props.enableMultiContainer&&R.containerId!==r.props.containerId||l.has(R.toastId)&&R.updateId==null}(u))return;const{toastId:E,updateId:w,data:g}=u,{props:v}=r,P=()=>T(E),B=w==null;B&&r.count++;const k={...v,style:v.toastStyle,key:r.toastKey++,...Object.fromEntries(Object.entries(u).filter(R=>{let[D,_]=R;return _!=null})),toastId:E,updateId:w,data:g,closeToast:P,isIn:!1,className:ee(u.className||v.toastClassName),bodyClassName:ee(u.bodyClassName||v.bodyClassName),progressClassName:ee(u.progressClassName||v.progressClassName),autoClose:!u.isLoading&&(z=u.autoClose,Q=v.autoClose,z===!1||X(z)&&z>0?z:Q),deleteToast(){const R=ue(l.get(E),"removed");l.delete(E),M.emit(4,R);const D=r.queue.length;if(r.count=E==null?r.count-r.displayedToast:r.count-1,r.count<0&&(r.count=0),D>0){const _=E==null?r.props.limit:1;if(D===1||_===1)r.displayedToast++,x();else{const S=_>D?D:_;r.displayedToast=S;for(let O=0;O<S;O++)x()}}else t()}};var z,Q;k.iconOut=function(R){let{theme:D,type:_,isLoading:S,icon:O}=R,$=null;const q={theme:D,type:_};return O===!1||(I(O)?$=O(q):m.isValidElement(O)?$=m.cloneElement(O,q):j(O)||X(O)?$=O:S?$=ae.spinner():(K=>K in ae)(_)&&($=ae[_](q))),$}(k),I(u.onOpen)&&(k.onOpen=u.onOpen),I(u.onClose)&&(k.onClose=u.onClose),k.closeButton=v.closeButton,u.closeButton===!1||se(u.closeButton)?k.closeButton=u.closeButton:u.closeButton===!0&&(k.closeButton=!se(v.closeButton)||v.closeButton);let F=d;m.isValidElement(d)&&!j(d.type)?F=m.cloneElement(d,{closeToast:P,toastProps:k,data:g}):I(d)&&(F=d({closeToast:P,toastProps:k,data:g})),v.limit&&v.limit>0&&r.count>v.limit&&B?r.queue.push({toastContent:F,toastProps:k,staleId:a}):X(p)?setTimeout(()=>{N(F,k,a)},p):N(F,k,a)}function N(d,f,p){const{toastId:a}=f;p&&l.delete(p);const u={content:d,props:f};l.set(a,u),s(E=>[...E,a].filter(w=>w!==p)),M.emit(4,ue(u,u.props.updateId==null?"added":"updated"))}return m.useEffect(()=>(r.containerId=e.containerId,M.cancelEmit(3).on(0,h).on(1,d=>c.current&&T(d)).on(5,C).emit(2,r),()=>{l.clear(),M.emit(3,r)}),[]),m.useEffect(()=>{r.props=e,r.isToastActive=n,r.displayedToast=o.length}),{getToastToRender:function(d){const f=new Map,p=Array.from(l.values());return e.newestOnTop&&p.reverse(),p.forEach(a=>{const{position:u}=a.props;f.has(u)||f.set(u,[]),f.get(u).push(a)}),Array.from(f,a=>d(a[0],a[1]))},containerRef:c,isToastActive:n}}function me(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientX:e.clientX}function fe(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientY:e.clientY}function ke(e){const[t,o]=m.useState(!1),[s,c]=m.useState(!1),l=m.useRef(null),n=m.useRef({start:0,x:0,y:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,boundingRect:null,didMove:!1}).current,r=m.useRef(e),{autoClose:C,pauseOnHover:T,closeToast:x,onClick:h,closeOnClick:N}=e;function d(g){if(e.draggable){g.nativeEvent.type==="touchstart"&&g.nativeEvent.preventDefault(),n.didMove=!1,document.addEventListener("mousemove",u),document.addEventListener("mouseup",E),document.addEventListener("touchmove",u),document.addEventListener("touchend",E);const v=l.current;n.canCloseOnClick=!0,n.canDrag=!0,n.boundingRect=v.getBoundingClientRect(),v.style.transition="",n.x=me(g.nativeEvent),n.y=fe(g.nativeEvent),e.draggableDirection==="x"?(n.start=n.x,n.removalDistance=v.offsetWidth*(e.draggablePercent/100)):(n.start=n.y,n.removalDistance=v.offsetHeight*(e.draggablePercent===80?1.5*e.draggablePercent:e.draggablePercent/100))}}function f(g){if(n.boundingRect){const{top:v,bottom:P,left:B,right:k}=n.boundingRect;g.nativeEvent.type!=="touchend"&&e.pauseOnHover&&n.x>=B&&n.x<=k&&n.y>=v&&n.y<=P?a():p()}}function p(){o(!0)}function a(){o(!1)}function u(g){const v=l.current;n.canDrag&&v&&(n.didMove=!0,t&&a(),n.x=me(g),n.y=fe(g),n.delta=e.draggableDirection==="x"?n.x-n.start:n.y-n.start,n.start!==n.x&&(n.canCloseOnClick=!1),v.style.transform=`translate${e.draggableDirection}(${n.delta}px)`,v.style.opacity=""+(1-Math.abs(n.delta/n.removalDistance)))}function E(){document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",E),document.removeEventListener("touchmove",u),document.removeEventListener("touchend",E);const g=l.current;if(n.canDrag&&n.didMove&&g){if(n.canDrag=!1,Math.abs(n.delta)>n.removalDistance)return c(!0),void e.closeToast();g.style.transition="transform 0.2s, opacity 0.2s",g.style.transform=`translate${e.draggableDirection}(0)`,g.style.opacity="1"}}m.useEffect(()=>{r.current=e}),m.useEffect(()=>(l.current&&l.current.addEventListener("d",p,{once:!0}),I(e.onOpen)&&e.onOpen(m.isValidElement(e.children)&&e.children.props),()=>{const g=r.current;I(g.onClose)&&g.onClose(m.isValidElement(g.children)&&g.children.props)}),[]),m.useEffect(()=>(e.pauseOnFocusLoss&&(document.hasFocus()||a(),window.addEventListener("focus",p),window.addEventListener("blur",a)),()=>{e.pauseOnFocusLoss&&(window.removeEventListener("focus",p),window.removeEventListener("blur",a))}),[e.pauseOnFocusLoss]);const w={onMouseDown:d,onTouchStart:d,onMouseUp:f,onTouchEnd:f};return C&&T&&(w.onMouseEnter=a,w.onMouseLeave=p),N&&(w.onClick=g=>{h&&h(g),n.canCloseOnClick&&x()}),{playToast:p,pauseToast:a,isRunning:t,preventExitTransition:s,toastRef:l,eventHandlers:w}}function ge(e){let{closeToast:t,theme:o,ariaLabel:s="close"}=e;return b.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:c=>{c.stopPropagation(),t(c)},"aria-label":s},b.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},b.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function Le(e){let{delay:t,isRunning:o,closeToast:s,type:c="default",hide:l,className:n,style:r,controlledProgress:C,progress:T,rtl:x,isIn:h,theme:N}=e;const d=l||C&&T===0,f={...r,animationDuration:`${t}ms`,animationPlayState:o?"running":"paused",opacity:d?0:1};C&&(f.transform=`scaleX(${T})`);const p=A("Toastify__progress-bar",C?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${N}`,`Toastify__progress-bar--${c}`,{"Toastify__progress-bar--rtl":x}),a=I(n)?n({rtl:x,type:c,defaultClassName:p}):A(p,n);return b.createElement("div",{role:"progressbar","aria-hidden":d?"true":"false","aria-label":"notification timer",className:a,style:f,[C&&T>=1?"onTransitionEnd":"onAnimationEnd"]:C&&T<1?null:()=>{h&&s()}})}const we=e=>{const{isRunning:t,preventExitTransition:o,toastRef:s,eventHandlers:c}=ke(e),{closeButton:l,children:n,autoClose:r,onClick:C,type:T,hideProgressBar:x,closeToast:h,transition:N,position:d,className:f,style:p,bodyClassName:a,bodyStyle:u,progressClassName:E,progressStyle:w,updateId:g,role:v,progress:P,rtl:B,toastId:k,deleteToast:z,isIn:Q,isLoading:F,iconOut:R,closeOnClick:D,theme:_}=e,S=A("Toastify__toast",`Toastify__toast-theme--${_}`,`Toastify__toast--${T}`,{"Toastify__toast--rtl":B},{"Toastify__toast--close-on-click":D}),O=I(f)?f({rtl:B,position:d,type:T,defaultClassName:S}):A(S,f),$=!!P||!r,q={closeToast:h,type:T,theme:_};let K=null;return l===!1||(K=I(l)?l(q):m.isValidElement(l)?m.cloneElement(l,q):ge(q)),b.createElement(N,{isIn:Q,done:z,position:d,preventExitTransition:o,nodeRef:s},b.createElement("div",{id:k,onClick:C,className:O,...c,style:p,ref:s},b.createElement("div",{...Q&&{role:v},className:I(a)?a({type:T}):A("Toastify__toast-body",a),style:u},R!=null&&b.createElement("div",{className:A("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!F})},R),b.createElement("div",null,n)),K,b.createElement(Le,{...g&&!$?{key:`pb-${g}`}:{},rtl:B,theme:_,delay:r,isRunning:t,isIn:Q,closeToast:h,hide:x,type:T,style:w,className:E,controlledProgress:$,progress:P||0})))},re=function(e,t){return t===void 0&&(t=!1),{enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}},Ie=oe(re("bounce",!0));oe(re("slide",!0));oe(re("zoom"));oe(re("flip"));const le=m.forwardRef((e,t)=>{const{getToastToRender:o,containerRef:s,isToastActive:c}=Ne(e),{className:l,style:n,rtl:r,containerId:C}=e;function T(x){const h=A("Toastify__toast-container",`Toastify__toast-container--${x}`,{"Toastify__toast-container--rtl":r});return I(l)?l({position:x,rtl:r,defaultClassName:h}):A(h,ee(l))}return m.useEffect(()=>{t&&(t.current=s.current)},[]),b.createElement("div",{ref:s,className:"Toastify",id:C},o((x,h)=>{const N=h.length?{...n}:{...n,pointerEvents:"none"};return b.createElement("div",{className:T(x),style:N,key:`container-${x}`},h.map((d,f)=>{let{content:p,props:a}=d;return b.createElement(we,{...a,isIn:c(a.toastId),style:{...a.style,"--nth":f+1,"--len":h.length},key:`toast-${a.key}`},p)}))}))});le.displayName="ToastContainer",le.defaultProps={position:"top-right",transition:Ie,autoClose:5e3,closeButton:ge,pauseOnHover:!0,pauseOnFocusLoss:!0,closeOnClick:!0,draggable:!0,draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};let ie,H=new Map,U=[],_e=1;function he(){return""+_e++}function Oe(e){return e&&(j(e.toastId)||X(e.toastId))?e.toastId:he()}function Y(e,t){return H.size>0?M.emit(0,e,t):U.push({content:e,options:t}),t.toastId}function te(e,t){return{...t,type:t&&t.type||e,toastId:Oe(t)}}function Z(e){return(t,o)=>Y(t,te(e,o))}function y(e,t){return Y(e,te("default",t))}y.loading=(e,t)=>Y(e,te("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),y.promise=function(e,t,o){let s,{pending:c,error:l,success:n}=t;c&&(s=j(c)?y.loading(c,o):y.loading(c.render,{...o,...c}));const r={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},C=(x,h,N)=>{if(h==null)return void y.dismiss(s);const d={type:x,...r,...o,data:N},f=j(h)?{render:h}:h;return s?y.update(s,{...d,...f}):y(f.render,{...d,...f}),N},T=I(e)?e():e;return T.then(x=>C("success",n,x)).catch(x=>C("error",l,x)),T},y.success=Z("success"),y.info=Z("info"),y.error=Z("error"),y.warning=Z("warning"),y.warn=y.warning,y.dark=(e,t)=>Y(e,te("default",{theme:"dark",...t})),y.dismiss=e=>{H.size>0?M.emit(1,e):U=U.filter(t=>e!=null&&t.options.toastId!==e)},y.clearWaitingQueue=function(e){return e===void 0&&(e={}),M.emit(5,e)},y.isActive=e=>{let t=!1;return H.forEach(o=>{o.isToastActive&&o.isToastActive(e)&&(t=!0)}),t},y.update=function(e,t){t===void 0&&(t={}),setTimeout(()=>{const o=function(s,c){let{containerId:l}=c;const n=H.get(l||ie);return n&&n.getToast(s)}(e,t);if(o){const{props:s,content:c}=o,l={delay:100,...s,...t,toastId:t.toastId||e,updateId:he()};l.toastId!==e&&(l.staleId=e);const n=l.render||c;delete l.render,Y(n,l)}},0)},y.done=e=>{y.update(e,{progress:1})},y.onChange=e=>(M.on(4,e),()=>{M.off(4,e)}),y.POSITION={TOP_LEFT:"top-left",TOP_RIGHT:"top-right",TOP_CENTER:"top-center",BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",BOTTOM_CENTER:"bottom-center"},y.TYPE={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error",DEFAULT:"default"},M.on(2,e=>{ie=e.containerId||e,H.set(ie,e),U.forEach(t=>{M.emit(0,t.content,t.options)}),U=[]}).on(3,e=>{H.delete(e.containerId||e),H.size===0&&M.off(0).off(1).off(5)});function Be({header:e,children:t}){const{auth:o,flash:s}=ve().props;m.useEffect(()=>{s.success&&y.success(s.success),s.error&&y.error(s.error)},[s]);const[c,l]=m.useState(!1);return L("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900",children:[i(le,{autoClose:2500,position:"bottom-right",closeOnClick:!0,theme:"colored"}),L("nav",{className:"bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700",children:[i("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:L("div",{className:"flex justify-between h-16",children:[L("div",{className:"flex",children:[i("div",{className:"shrink-0 flex items-center",children:i(ce,{href:"/",children:i(ye,{className:"block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"})})}),L("div",{className:"hidden space-x-8 sm:-my-px sm:ml-10 sm:flex",children:[i(G,{href:route("dashboard"),active:route().current("dashboard"),children:i("i",{className:"fa-solid fa-house"})}),i(G,{href:route("places.index"),active:route().current("places.index")||route().current("places.edit"),children:"Locales"}),i(G,{href:route("events.index"),active:route().current("events.index")||route().current("events.edit"),children:"Eventos"}),i(G,{href:route("tags.index"),active:route().current("tags.index")||route().current("tags.edit"),children:"Tags"}),i(G,{href:route("categories.index"),active:route().current("categories.index")||route().current("categories.edit"),children:"Categorias"})]})]}),i("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:i("div",{className:"ml-3 relative",children:L(W,{children:[i(W.Trigger,{children:i("span",{className:"inline-flex rounded-md",children:L("button",{type:"button",className:"inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150",children:[o.user.name,i("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:i("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),L(W.Content,{children:[i(W.Link,{href:route("profile.edit"),children:"Profile"}),i(W.Link,{href:route("logout"),method:"post",as:"button",children:"Log Out"})]})]})})}),i("div",{className:"-mr-2 flex items-center sm:hidden",children:i("button",{onClick:()=>l(n=>!n),className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out",children:L("svg",{className:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[i("path",{className:c?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),i("path",{className:c?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),L("div",{className:(c?"block":"hidden")+" sm:hidden",children:[L("div",{className:"pt-2 pb-3 space-y-1",children:[i(V,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),i(V,{href:route("places.index"),active:route().current("places.index"),children:"Locales"}),i(V,{href:route("events.index"),active:route().current("events.index")||route().current("events.edit"),children:"Eventos"}),i(V,{href:route("tags.index"),active:route().current("tags.index")||route().current("tags.edit"),children:"Tags"})]}),L("div",{className:"pt-4 pb-1 border-t border-gray-200 dark:border-gray-600",children:[L("div",{className:"px-4",children:[i("div",{className:"font-medium text-base text-gray-800 dark:text-gray-200",children:o.user.name}),i("div",{className:"font-medium text-sm text-gray-500",children:o.user.email})]}),L("div",{className:"mt-3 space-y-1",children:[i(V,{href:route("profile.edit"),children:"Profile"}),i(V,{method:"post",href:route("logout"),as:"button",children:"Log Out"})]})]})]})]}),e&&i("header",{className:"bg-white dark:bg-gray-800 shadow",children:i("div",{className:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",children:e})}),i("main",{children:t})]})}export{Be as A};