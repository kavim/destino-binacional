import{R as p,r as i,f as Ke,h as oe,a as I,j as qe}from"./app-0ff771ec.js";import{l as z,s as j,a as k,u as O,b as ce,D as $,X as S,o as b,y as T,p as Xe,c as J,f as be,T as ze,d as Je,S as he,C as Qe,e as G,t as ee}from"./transition-b950ca59.js";var Ee;let N=(Ee=p.useId)!=null?Ee:function(){let e=z(),[t,n]=p.useState(e?()=>j.nextId():null);return k(()=>{t===null&&n(j.nextId())},[t]),t!=null?""+t:void 0};function $e(e){return j.isServer?null:e instanceof Node?e.ownerDocument:e!=null&&e.hasOwnProperty("current")&&e.current instanceof Node?e.current.ownerDocument:document}let le=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var F=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e))(F||{}),Se=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))(Se||{}),Ze=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(Ze||{});function et(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(le)).sort((t,n)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(n.tabIndex||Number.MAX_SAFE_INTEGER)))}var Pe=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(Pe||{});function tt(e,t=0){var n;return e===((n=$e(e))==null?void 0:n.body)?!1:O(t,{[0](){return e.matches(le)},[1](){let r=e;for(;r!==null;){if(r.matches(le))return!0;r=r.parentElement}return!1}})}var nt=(e=>(e[e.Keyboard=0]="Keyboard",e[e.Mouse=1]="Mouse",e))(nt||{});typeof window<"u"&&typeof document<"u"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));function M(e){e==null||e.focus({preventScroll:!0})}let rt=["textarea","input"].join(",");function ot(e){var t,n;return(n=(t=e==null?void 0:e.matches)==null?void 0:t.call(e,rt))!=null?n:!1}function lt(e,t=n=>n){return e.slice().sort((n,r)=>{let l=t(n),a=t(r);if(l===null||a===null)return 0;let o=l.compareDocumentPosition(a);return o&Node.DOCUMENT_POSITION_FOLLOWING?-1:o&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function K(e,t,{sorted:n=!0,relativeTo:r=null,skipElements:l=[]}={}){let a=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,o=Array.isArray(e)?n?lt(e):e:et(e);l.length>0&&o.length>1&&(o=o.filter(E=>!l.includes(E))),r=r??a.activeElement;let u=(()=>{if(t&5)return 1;if(t&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),s=(()=>{if(t&1)return 0;if(t&2)return Math.max(0,o.indexOf(r))-1;if(t&4)return Math.max(0,o.indexOf(r))+1;if(t&8)return o.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),d=t&32?{preventScroll:!0}:{},c=0,f=o.length,h;do{if(c>=f||c+f<=0)return 0;let E=s+c;if(t&16)E=(E+f)%f;else{if(E<0)return 3;if(E>=f)return 1}h=o[E],h==null||h.focus(d),c+=u}while(h!==a.activeElement);return t&6&&ot(h)&&h.select(),2}function te(e,t,n){let r=ce(t);i.useEffect(()=>{function l(a){r.current(a)}return document.addEventListener(e,l,n),()=>document.removeEventListener(e,l,n)},[e,n])}function at(e,t,n=!0){let r=i.useRef(!1);i.useEffect(()=>{requestAnimationFrame(()=>{r.current=n})},[n]);function l(o,u){if(!r.current||o.defaultPrevented)return;let s=function c(f){return typeof f=="function"?c(f()):Array.isArray(f)||f instanceof Set?f:[f]}(e),d=u(o);if(d!==null&&d.getRootNode().contains(d)){for(let c of s){if(c===null)continue;let f=c instanceof HTMLElement?c:c.current;if(f!=null&&f.contains(d)||o.composed&&o.composedPath().includes(f))return}return!tt(d,Pe.Loose)&&d.tabIndex!==-1&&o.preventDefault(),t(o,d)}}let a=i.useRef(null);te("mousedown",o=>{var u,s;r.current&&(a.current=((s=(u=o.composedPath)==null?void 0:u.call(o))==null?void 0:s[0])||o.target)},!0),te("click",o=>{a.current&&(l(o,()=>a.current),a.current=null)},!0),te("blur",o=>l(o,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function ut(e){let t=e.parentElement,n=null;for(;t&&!(t instanceof HTMLFieldSetElement);)t instanceof HTMLLegendElement&&(n=t),t=t.parentElement;let r=(t==null?void 0:t.getAttribute("disabled"))==="";return r&&it(n)?!1:r}function it(e){if(!e)return!1;let t=e.previousElementSibling;for(;t!==null;){if(t instanceof HTMLLegendElement)return!1;t=t.previousElementSibling}return!0}let st="div";var q=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(q||{});function ct(e,t){let{features:n=1,...r}=e,l={ref:t,"aria-hidden":(n&2)===2?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(n&4)===4&&(n&2)!==2&&{display:"none"}}};return S({ourProps:l,theirProps:r,slot:{},defaultTag:st,name:"Hidden"})}let ae=$(ct);var Te=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(Te||{});function de(e,t){let n=i.useRef([]),r=b(e);i.useEffect(()=>{let l=[...n.current];for(let[a,o]of t.entries())if(n.current[a]!==o){let u=r(t,l);return n.current=t,u}},[r,...t])}function dt(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}function ft(e,t,n){let r=ce(t);i.useEffect(()=>{function l(a){r.current(a)}return window.addEventListener(e,l,n),()=>window.removeEventListener(e,l,n)},[e,n])}var _=(e=>(e[e.Forwards=0]="Forwards",e[e.Backwards=1]="Backwards",e))(_||{});function pt(){let e=i.useRef(0);return ft("keydown",t=>{t.key==="Tab"&&(e.current=t.shiftKey?1:0)},!0),e}function Q(...e){return i.useMemo(()=>$e(...e),[...e])}function Le(e,t,n,r){let l=ce(n);i.useEffect(()=>{e=e??window;function a(o){l.current(o)}return e.addEventListener(t,a,r),()=>e.removeEventListener(t,a,r)},[e,t,r])}function mt(e){function t(){document.readyState!=="loading"&&(e(),document.removeEventListener("DOMContentLoaded",t))}typeof window<"u"&&typeof document<"u"&&(document.addEventListener("DOMContentLoaded",t),t())}function xe(e){if(!e)return new Set;if(typeof e=="function")return new Set(e());let t=new Set;for(let n of e.current)n.current instanceof HTMLElement&&t.add(n.current);return t}let vt="div";var De=(e=>(e[e.None=1]="None",e[e.InitialFocus=2]="InitialFocus",e[e.TabLock=4]="TabLock",e[e.FocusLock=8]="FocusLock",e[e.RestoreFocus=16]="RestoreFocus",e[e.All=30]="All",e))(De||{});function gt(e,t){let n=i.useRef(null),r=T(n,t),{initialFocus:l,containers:a,features:o=30,...u}=e;z()||(o=1);let s=Q(n);wt({ownerDocument:s},!!(o&16));let d=yt({ownerDocument:s,container:n,initialFocus:l},!!(o&2));bt({ownerDocument:s,container:n,containers:a,previousActiveElement:d},!!(o&8));let c=pt(),f=b(v=>{let P=n.current;P&&(x=>x())(()=>{O(c.current,{[_.Forwards]:()=>{K(P,F.First,{skipElements:[v.relatedTarget]})},[_.Backwards]:()=>{K(P,F.Last,{skipElements:[v.relatedTarget]})}})})}),h=Xe(),E=i.useRef(!1),L={ref:r,onKeyDown(v){v.key=="Tab"&&(E.current=!0,h.requestAnimationFrame(()=>{E.current=!1}))},onBlur(v){let P=xe(a);n.current instanceof HTMLElement&&P.add(n.current);let x=v.relatedTarget;x instanceof HTMLElement&&x.dataset.headlessuiFocusGuard!=="true"&&(Fe(P,x)||(E.current?K(n.current,O(c.current,{[_.Forwards]:()=>F.Next,[_.Backwards]:()=>F.Previous})|F.WrapAround,{relativeTo:v.target}):v.target instanceof HTMLElement&&M(v.target)))}};return p.createElement(p.Fragment,null,!!(o&4)&&p.createElement(ae,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:f,features:q.Focusable}),S({ourProps:L,theirProps:u,defaultTag:vt,name:"FocusTrap"}),!!(o&4)&&p.createElement(ae,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:f,features:q.Focusable}))}let ht=$(gt),H=Object.assign(ht,{features:De}),D=[];mt(()=>{function e(t){t.target instanceof HTMLElement&&t.target!==document.body&&D[0]!==t.target&&(D.unshift(t.target),D=D.filter(n=>n!=null&&n.isConnected),D.splice(10))}window.addEventListener("click",e,{capture:!0}),window.addEventListener("mousedown",e,{capture:!0}),window.addEventListener("focus",e,{capture:!0}),document.body.addEventListener("click",e,{capture:!0}),document.body.addEventListener("mousedown",e,{capture:!0}),document.body.addEventListener("focus",e,{capture:!0})});function Et(e=!0){let t=i.useRef(D.slice());return de(([n],[r])=>{r===!0&&n===!1&&J(()=>{t.current.splice(0)}),r===!1&&n===!0&&(t.current=D.slice())},[e,D,t]),b(()=>{var n;return(n=t.current.find(r=>r!=null&&r.isConnected))!=null?n:null})}function wt({ownerDocument:e},t){let n=Et(t);de(()=>{t||(e==null?void 0:e.activeElement)===(e==null?void 0:e.body)&&M(n())},[t]);let r=i.useRef(!1);i.useEffect(()=>(r.current=!1,()=>{r.current=!0,J(()=>{r.current&&M(n())})}),[])}function yt({ownerDocument:e,container:t,initialFocus:n},r){let l=i.useRef(null),a=be();return de(()=>{if(!r)return;let o=t.current;o&&J(()=>{if(!a.current)return;let u=e==null?void 0:e.activeElement;if(n!=null&&n.current){if((n==null?void 0:n.current)===u){l.current=u;return}}else if(o.contains(u)){l.current=u;return}n!=null&&n.current?M(n.current):K(o,F.First)===Se.Error&&console.warn("There are no focusable elements inside the <FocusTrap />"),l.current=e==null?void 0:e.activeElement})},[r]),l}function bt({ownerDocument:e,container:t,containers:n,previousActiveElement:r},l){let a=be();Le(e==null?void 0:e.defaultView,"focus",o=>{if(!l||!a.current)return;let u=xe(n);t.current instanceof HTMLElement&&u.add(t.current);let s=r.current;if(!s)return;let d=o.target;d&&d instanceof HTMLElement?Fe(u,d)?(r.current=d,M(d)):(o.preventDefault(),o.stopPropagation(),M(s)):M(r.current)},!0)}function Fe(e,t){for(let n of e)if(n.contains(t))return!0;return!1}let Re=i.createContext(!1);function $t(){return i.useContext(Re)}function ue(e){return p.createElement(Re.Provider,{value:e.force},e.children)}function St(e){let t=$t(),n=i.useContext(Me),r=Q(e),[l,a]=i.useState(()=>{if(!t&&n!==null||j.isServer)return null;let o=r==null?void 0:r.getElementById("headlessui-portal-root");if(o)return o;if(r===null)return null;let u=r.createElement("div");return u.setAttribute("id","headlessui-portal-root"),r.body.appendChild(u)});return i.useEffect(()=>{l!==null&&(r!=null&&r.body.contains(l)||r==null||r.body.appendChild(l))},[l,r]),i.useEffect(()=>{t||n!==null&&a(n.current)},[n,a,t]),l}let Pt=i.Fragment;function Tt(e,t){let n=e,r=i.useRef(null),l=T(ze(c=>{r.current=c}),t),a=Q(r),o=St(r),[u]=i.useState(()=>{var c;return j.isServer?null:(c=a==null?void 0:a.createElement("div"))!=null?c:null}),s=z(),d=i.useRef(!1);return k(()=>{if(d.current=!1,!(!o||!u))return o.contains(u)||(u.setAttribute("data-headlessui-portal",""),o.appendChild(u)),()=>{d.current=!0,J(()=>{var c;d.current&&(!o||!u||(u instanceof Node&&o.contains(u)&&o.removeChild(u),o.childNodes.length<=0&&((c=o.parentElement)==null||c.removeChild(o))))})}},[o,u]),s?!o||!u?null:Ke.createPortal(S({ourProps:{ref:l},theirProps:n,defaultTag:Pt,name:"Portal"}),u):null}let Lt=i.Fragment,Me=i.createContext(null);function xt(e,t){let{target:n,...r}=e,l={ref:T(t)};return p.createElement(Me.Provider,{value:n},S({ourProps:l,theirProps:r,defaultTag:Lt,name:"Popover.Group"}))}let Dt=$(Tt),Ft=$(xt),ie=Object.assign(Dt,{Group:Ft}),Ae=i.createContext(null);function Ce(){let e=i.useContext(Ae);if(e===null){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,Ce),t}return e}function Rt(){let[e,t]=i.useState([]);return[e.length>0?e.join(" "):void 0,i.useMemo(()=>function(n){let r=b(a=>(t(o=>[...o,a]),()=>t(o=>{let u=o.slice(),s=u.indexOf(a);return s!==-1&&u.splice(s,1),u}))),l=i.useMemo(()=>({register:r,slot:n.slot,name:n.name,props:n.props}),[r,n.slot,n.name,n.props]);return p.createElement(Ae.Provider,{value:l},n.children)},[t])]}let Mt="p";function At(e,t){let n=N(),{id:r=`headlessui-description-${n}`,...l}=e,a=Ce(),o=T(t);k(()=>a.register(r),[r,a.register]);let u={ref:o,...a.props,id:r};return S({ourProps:u,theirProps:l,slot:a.slot||{},defaultTag:Mt,name:a.name||"Description"})}let Ct=$(At),Ot=Object.assign(Ct,{}),fe=i.createContext(()=>{});fe.displayName="StackContext";var se=(e=>(e[e.Add=0]="Add",e[e.Remove=1]="Remove",e))(se||{});function kt(){return i.useContext(fe)}function Nt({children:e,onUpdate:t,type:n,element:r,enabled:l}){let a=kt(),o=b((...u)=>{t==null||t(...u),a(...u)});return k(()=>{let u=l===void 0||l===!0;return u&&o(0,n,r),()=>{u&&o(1,n,r)}},[o,n,r,l]),p.createElement(fe.Provider,{value:o},e)}function It(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}const Ht=typeof Object.is=="function"?Object.is:It,{useState:Bt,useEffect:_t,useLayoutEffect:jt,useDebugValue:Ut}=oe;function Wt(e,t,n){const r=t(),[{inst:l},a]=Bt({inst:{value:r,getSnapshot:t}});return jt(()=>{l.value=r,l.getSnapshot=t,ne(l)&&a({inst:l})},[e,r,t]),_t(()=>(ne(l)&&a({inst:l}),e(()=>{ne(l)&&a({inst:l})})),[e]),Ut(r),r}function ne(e){const t=e.getSnapshot,n=e.value;try{const r=t();return!Ht(n,r)}catch{return!0}}function Vt(e,t,n){return t()}const Yt=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Gt=!Yt,Kt=Gt?Vt:Wt,qt="useSyncExternalStore"in oe?(e=>e.useSyncExternalStore)(oe):Kt;function Xt(e){return qt(e.subscribe,e.getSnapshot,e.getSnapshot)}function zt(e,t){let n=e(),r=new Set;return{getSnapshot(){return n},subscribe(l){return r.add(l),()=>r.delete(l)},dispatch(l,...a){let o=t[l].call(n,...a);o&&(n=o,r.forEach(u=>u()))}}}function Jt(){let e;return{before({doc:t}){var n;let r=t.documentElement;e=((n=t.defaultView)!=null?n:window).innerWidth-r.clientWidth},after({doc:t,d:n}){let r=t.documentElement,l=r.clientWidth-r.offsetWidth,a=e-l;n.style(r,"paddingRight",`${a}px`)}}}function Qt(){if(!dt())return{};let e;return{before(){e=window.pageYOffset},after({doc:t,d:n,meta:r}){function l(o){return r.containers.flatMap(u=>u()).some(u=>u.contains(o))}n.style(t.body,"marginTop",`-${e}px`),window.scrollTo(0,0);let a=null;n.addEventListener(t,"click",o=>{if(o.target instanceof HTMLElement)try{let u=o.target.closest("a");if(!u)return;let{hash:s}=new URL(u.href),d=t.querySelector(s);d&&!l(d)&&(a=d)}catch{}},!0),n.addEventListener(t,"touchmove",o=>{o.target instanceof HTMLElement&&!l(o.target)&&o.preventDefault()},{passive:!1}),n.add(()=>{window.scrollTo(0,window.pageYOffset+e),a&&a.isConnected&&(a.scrollIntoView({block:"nearest"}),a=null)})}}}function Zt(){return{before({doc:e,d:t}){t.style(e.documentElement,"overflow","hidden")}}}function en(e){let t={};for(let n of e)Object.assign(t,n(t));return t}let R=zt(()=>new Map,{PUSH(e,t){var n;let r=(n=this.get(e))!=null?n:{doc:e,count:0,d:Je(),meta:new Set};return r.count++,r.meta.add(t),this.set(e,r),this},POP(e,t){let n=this.get(e);return n&&(n.count--,n.meta.delete(t)),this},SCROLL_PREVENT({doc:e,d:t,meta:n}){let r={doc:e,d:t,meta:en(n)},l=[Qt(),Jt(),Zt()];l.forEach(({before:a})=>a==null?void 0:a(r)),l.forEach(({after:a})=>a==null?void 0:a(r))},SCROLL_ALLOW({d:e}){e.dispose()},TEARDOWN({doc:e}){this.delete(e)}});R.subscribe(()=>{let e=R.getSnapshot(),t=new Map;for(let[n]of e)t.set(n,n.documentElement.style.overflow);for(let n of e.values()){let r=t.get(n.doc)==="hidden",l=n.count!==0;(l&&!r||!l&&r)&&R.dispatch(n.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",n),n.count===0&&R.dispatch("TEARDOWN",n)}});function tn(e,t,n){let r=Xt(R),l=e?r.get(e):void 0,a=l?l.count>0:!1;return k(()=>{if(!(!e||!t))return R.dispatch("PUSH",e,n),()=>R.dispatch("POP",e,n)},[t,e]),a}let re=new Map,B=new Map;function we(e,t=!0){k(()=>{var n;if(!t)return;let r=typeof e=="function"?e():e.current;if(!r)return;function l(){var o;if(!r)return;let u=(o=B.get(r))!=null?o:1;if(u===1?B.delete(r):B.set(r,u-1),u!==1)return;let s=re.get(r);s&&(s["aria-hidden"]===null?r.removeAttribute("aria-hidden"):r.setAttribute("aria-hidden",s["aria-hidden"]),r.inert=s.inert,re.delete(r))}let a=(n=B.get(r))!=null?n:0;return B.set(r,a+1),a!==0||(re.set(r,{"aria-hidden":r.getAttribute("aria-hidden"),inert:r.inert}),r.setAttribute("aria-hidden","true"),r.inert=!0),l},[e,t])}var nn=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(nn||{}),rn=(e=>(e[e.SetTitleId=0]="SetTitleId",e))(rn||{});let on={[0](e,t){return e.titleId===t.id?e:{...e,titleId:t.id}}},X=i.createContext(null);X.displayName="DialogContext";function U(e){let t=i.useContext(X);if(t===null){let n=new Error(`<${e} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(n,U),n}return t}function ln(e,t,n=()=>[document.body]){tn(e,t,r=>{var l;return{containers:[...(l=r.containers)!=null?l:[],n]}})}function an(e,t){return O(t.type,on,e,t)}let un="div",sn=he.RenderStrategy|he.Static;function cn(e,t){let n=N(),{id:r=`headlessui-dialog-${n}`,open:l,onClose:a,initialFocus:o,__demoMode:u=!1,...s}=e,[d,c]=i.useState(0),f=Qe();l===void 0&&f!==null&&(l=(f&G.Open)===G.Open);let h=i.useRef(null),E=T(h,t),L=i.useRef(null),v=Q(h),P=e.hasOwnProperty("open")||f!==null,x=e.hasOwnProperty("onClose");if(!P&&!x)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!P)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!x)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if(typeof l!="boolean")throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${l}`);if(typeof a!="function")throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${a}`);let w=l?0:1,[A,Oe]=i.useReducer(an,{titleId:null,descriptionId:null,panelRef:i.createRef()}),C=b(()=>a(!1)),pe=b(m=>Oe({type:0,id:m})),W=z()?u?!1:w===0:!1,V=d>1,me=i.useContext(X)!==null,ke=V?"parent":"leaf",ve=f!==null?(f&G.Closing)===G.Closing:!1,Ne=(()=>me||ve?!1:W)(),Ie=i.useCallback(()=>{var m,y;return(y=Array.from((m=v==null?void 0:v.querySelectorAll("body > *"))!=null?m:[]).find(g=>g.id==="headlessui-portal-root"?!1:g.contains(L.current)&&g instanceof HTMLElement))!=null?y:null},[L]);we(Ie,Ne);let He=(()=>V?!0:W)(),Be=i.useCallback(()=>{var m,y;return(y=Array.from((m=v==null?void 0:v.querySelectorAll("[data-headlessui-portal]"))!=null?m:[]).find(g=>g.contains(L.current)&&g instanceof HTMLElement))!=null?y:null},[L]);we(Be,He);let Z=b(()=>{var m,y;return[...Array.from((m=v==null?void 0:v.querySelectorAll("html > *, body > *, [data-headlessui-portal]"))!=null?m:[]).filter(g=>!(g===document.body||g===document.head||!(g instanceof HTMLElement)||g.contains(L.current)||A.panelRef.current&&g.contains(A.panelRef.current))),(y=A.panelRef.current)!=null?y:h.current]}),_e=(()=>!(!W||V))();at(()=>Z(),C,_e);let je=(()=>!(V||w!==0))();Le(v==null?void 0:v.defaultView,"keydown",m=>{je&&(m.defaultPrevented||m.key===Te.Escape&&(m.preventDefault(),m.stopPropagation(),C()))});let Ue=(()=>!(ve||w!==0||me))();ln(v,Ue,Z),i.useEffect(()=>{if(w!==0||!h.current)return;let m=new ResizeObserver(y=>{for(let g of y){let Y=g.target.getBoundingClientRect();Y.x===0&&Y.y===0&&Y.width===0&&Y.height===0&&C()}});return m.observe(h.current),()=>m.disconnect()},[w,h,C]);let[We,Ve]=Rt(),Ye=i.useMemo(()=>[{dialogState:w,close:C,setTitleId:pe},A],[w,A,C,pe]),ge=i.useMemo(()=>({open:w===0}),[w]),Ge={ref:E,id:r,role:"dialog","aria-modal":w===0?!0:void 0,"aria-labelledby":A.titleId,"aria-describedby":We};return p.createElement(Nt,{type:"Dialog",enabled:w===0,element:h,onUpdate:b((m,y)=>{y==="Dialog"&&O(m,{[se.Add]:()=>c(g=>g+1),[se.Remove]:()=>c(g=>g-1)})})},p.createElement(ue,{force:!0},p.createElement(ie,null,p.createElement(X.Provider,{value:Ye},p.createElement(ie.Group,{target:h},p.createElement(ue,{force:!1},p.createElement(Ve,{slot:ge,name:"Dialog.Description"},p.createElement(H,{initialFocus:o,containers:Z,features:W?O(ke,{parent:H.features.RestoreFocus,leaf:H.features.All&~H.features.FocusLock}):H.features.None},S({ourProps:Ge,theirProps:s,slot:ge,defaultTag:un,features:sn,visible:w===0,name:"Dialog"})))))))),p.createElement(ae,{features:q.Hidden,ref:L}))}let dn="div";function fn(e,t){let n=N(),{id:r=`headlessui-dialog-overlay-${n}`,...l}=e,[{dialogState:a,close:o}]=U("Dialog.Overlay"),u=T(t),s=b(c=>{if(c.target===c.currentTarget){if(ut(c.currentTarget))return c.preventDefault();c.preventDefault(),c.stopPropagation(),o()}}),d=i.useMemo(()=>({open:a===0}),[a]);return S({ourProps:{ref:u,id:r,"aria-hidden":!0,onClick:s},theirProps:l,slot:d,defaultTag:dn,name:"Dialog.Overlay"})}let pn="div";function mn(e,t){let n=N(),{id:r=`headlessui-dialog-backdrop-${n}`,...l}=e,[{dialogState:a},o]=U("Dialog.Backdrop"),u=T(t);i.useEffect(()=>{if(o.panelRef.current===null)throw new Error("A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.")},[o.panelRef]);let s=i.useMemo(()=>({open:a===0}),[a]);return p.createElement(ue,{force:!0},p.createElement(ie,null,S({ourProps:{ref:u,id:r,"aria-hidden":!0},theirProps:l,slot:s,defaultTag:pn,name:"Dialog.Backdrop"})))}let vn="div";function gn(e,t){let n=N(),{id:r=`headlessui-dialog-panel-${n}`,...l}=e,[{dialogState:a},o]=U("Dialog.Panel"),u=T(t,o.panelRef),s=i.useMemo(()=>({open:a===0}),[a]),d=b(c=>{c.stopPropagation()});return S({ourProps:{ref:u,id:r,onClick:d},theirProps:l,slot:s,defaultTag:vn,name:"Dialog.Panel"})}let hn="h2";function En(e,t){let n=N(),{id:r=`headlessui-dialog-title-${n}`,...l}=e,[{dialogState:a,setTitleId:o}]=U("Dialog.Title"),u=T(t);i.useEffect(()=>(o(r),()=>o(null)),[r,o]);let s=i.useMemo(()=>({open:a===0}),[a]);return S({ourProps:{ref:u,id:r},theirProps:l,slot:s,defaultTag:hn,name:"Dialog.Title"})}let wn=$(cn),yn=$(mn),bn=$(gn),$n=$(fn),Sn=$(En),ye=Object.assign(wn,{Backdrop:yn,Panel:bn,Overlay:$n,Title:Sn,Description:Ot});function Ln({children:e,show:t=!1,maxWidth:n="2xl",closeable:r=!0,onClose:l=()=>{}}){const a=()=>{r&&l()},o={sm:"sm:max-w-sm",md:"sm:max-w-md",lg:"sm:max-w-lg",xl:"sm:max-w-xl","2xl":"sm:max-w-2xl"}[n];return I(ee,{show:t,as:i.Fragment,leave:"duration-200",children:qe(ye,{as:"div",id:"modal",className:"fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all",onClose:a,children:[I(ee.Child,{as:i.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:I("div",{className:"absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75"})}),I(ee.Child,{as:i.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",enterTo:"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 translate-y-0 sm:scale-100",leaveTo:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",children:I(ye.Panel,{className:`mb-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto ${o}`,children:e})})]})})}export{Ln as M};