import{r as s,a as e,j as r,F as p,d as m,q as v}from"./app-d06630b7.js";import{A as y}from"./ApplicationLogo-fc2995f7.js";import{t as b}from"./transition-f7c88306.js";import{R as i}from"./ResponsiveNavLink-a2a25b4e.js";const x=s.createContext(),u=({children:a})=>{const[n,t]=s.useState(!1),o=()=>{t(d=>!d)};return e(x.Provider,{value:{open:n,setOpen:t,toggleOpen:o},children:e("div",{className:"relative",children:a})})},k=({children:a})=>{const{open:n,setOpen:t,toggleOpen:o}=s.useContext(x);return r(p,{children:[e("div",{onClick:o,children:a}),n&&e("div",{className:"fixed inset-0 z-40",onClick:()=>t(!1)})]})},N=({align:a="right",width:n="48",contentClasses:t="py-1 bg-white dark:bg-gray-700",children:o})=>{const{open:d,setOpen:g}=s.useContext(x);let h="origin-top";a==="left"?h="origin-top-left left-0":a==="right"&&(h="origin-top-right right-0");let f="";return n==="48"&&(f="w-48"),e(p,{children:e(b,{as:s.Fragment,show:d,enter:"transition ease-out duration-200",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:e("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${h} ${f}`,onClick:()=>g(!1),children:e("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+t,children:o})})})})},w=({className:a="",children:n,...t})=>e(m,{...t,className:"block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "+a,children:n});u.Trigger=k;u.Content=N;u.Link=w;const l=u;function c({active:a=!1,className:n="",children:t,...o}){return e(m,{...o,className:"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none "+(a?"border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 ":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ")+n,children:t})}function O({header:a,children:n}){const{auth:t}=v().props,[o,d]=s.useState(!1);return r("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900",children:[r("nav",{className:"bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700",children:[e("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:r("div",{className:"flex justify-between h-16",children:[r("div",{className:"flex",children:[e("div",{className:"shrink-0 flex items-center",children:e(m,{href:"/",children:e(y,{className:"block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"})})}),r("div",{className:"hidden space-x-8 sm:-my-px sm:ml-10 sm:flex",children:[e(c,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),e(c,{href:route("places.index"),active:route().current("places.index")||route().current("places.edit"),children:"Locales"}),e(c,{href:route("events.index"),active:route().current("events.index")||route().current("events.edit"),children:"Eventos"}),e(c,{href:route("tags.index"),active:route().current("tags.index")||route().current("tags.edit"),children:"Tags"})]})]}),e("div",{className:"hidden sm:flex sm:items-center sm:ml-6",children:e("div",{className:"ml-3 relative",children:r(l,{children:[e(l.Trigger,{children:e("span",{className:"inline-flex rounded-md",children:r("button",{type:"button",className:"inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150",children:[t.user.name,e("svg",{className:"ml-2 -mr-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),r(l.Content,{children:[e(l.Link,{href:route("profile.edit"),children:"Profile"}),e(l.Link,{href:route("logout"),method:"post",as:"button",children:"Log Out"})]})]})})}),e("div",{className:"-mr-2 flex items-center sm:hidden",children:e("button",{onClick:()=>d(g=>!g),className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out",children:r("svg",{className:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[e("path",{className:o?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),e("path",{className:o?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),r("div",{className:(o?"block":"hidden")+" sm:hidden",children:[r("div",{className:"pt-2 pb-3 space-y-1",children:[e(i,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),e(i,{href:route("places.index"),active:route().current("places.index"),children:"Locales"}),e(i,{href:route("events.index"),active:route().current("events.index")||route().current("events.edit"),children:"Eventos"}),e(i,{href:route("tags.index"),active:route().current("tags.index")||route().current("tags.edit"),children:"Tags"})]}),r("div",{className:"pt-4 pb-1 border-t border-gray-200 dark:border-gray-600",children:[r("div",{className:"px-4",children:[e("div",{className:"font-medium text-base text-gray-800 dark:text-gray-200",children:t.user.name}),e("div",{className:"font-medium text-sm text-gray-500",children:t.user.email})]}),r("div",{className:"mt-3 space-y-1",children:[e(i,{href:route("profile.edit"),children:"Profile"}),e(i,{method:"post",href:route("logout"),as:"button",children:"Log Out"})]})]})]})]}),a&&e("header",{className:"bg-white dark:bg-gray-800 shadow",children:e("div",{className:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",children:a})}),e("main",{children:n})]})}export{O as A};