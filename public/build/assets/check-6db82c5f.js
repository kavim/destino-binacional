import{r as h}from"./app-b4a9c26c.js";import{u as n}from"./index-6849f65b.js";import{c as u}from"./createLucideIcon-c15d2096.js";function g(r){const[d,e]=h.useState(void 0);return n(()=>{if(r){e({width:r.offsetWidth,height:r.offsetHeight});const c=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const f=o[0];let i,t;if("borderBoxSize"in f){const s=f.borderBoxSize,a=Array.isArray(s)?s[0]:s;i=a.inlineSize,t=a.blockSize}else i=r.offsetWidth,t=r.offsetHeight;e({width:i,height:t})});return c.observe(r,{box:"border-box"}),()=>c.unobserve(r)}else e(void 0)},[r]),d}/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],p=u("check",b);export{p as C,g as u};
