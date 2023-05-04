import{W as y,r as c,j as s,a as e}from"./app-c778ce5a.js";import{d as x}from"./index-f41ac620.js";import{u as b,p as g}from"./pickBy-e6a27c9e.js";const C=()=>{const{filters:i,grouped_categories:u,categories:f}=y().props,[d,n]=c.useState(!1),[t,m]=c.useState({search:i.search||"",category_id:i.category_id||""}),p=b(t);function v(){m({search:"",category_id:""})}c.useEffect(()=>{const r=setTimeout(()=>{if(p){const a=Object.keys(g(t)).length?g(t):{remember:"forget"};x.Inertia.get(route(route().current()),a,{replace:!0,preserveState:!0})}},1500);return()=>clearTimeout(r)},[t]);function h(r){const a=r.target.name,o=r.target.value;m(l=>({...l,[a]:o})),d&&n(!1)}return s("div",{className:"flex items-center w-full max-w-md mr-4",children:[s("div",{className:"relative flex w-full bg-white rounded shadow",children:[s("div",{style:{top:"100%"},className:`absolute ${d?"":"hidden"}`,children:[e("div",{onClick:()=>n(!1),className:"fixed inset-0 z-20 bg-black opacity-25"}),e("div",{className:"relative z-30 w-64 px-4 py-6 mt-2 bg-white rounded shadow-lg",children:s("select",{className:"select select-bordered w-36",value:t.category_id,name:"category_id",onChange:h,children:[e("option",{defaultValue:!0,hidden:!0,children:"Categoría"}),Object.keys(u).map((r,a)=>e("optgroup",{label:f[a].name,children:u[r].map((o,l)=>e("option",{value:o.id,children:o.name},l))},a))]})})]}),e("button",{onClick:()=>n(!0),className:"px-4 border-r rounded-l md:px-6 hover:bg-gray-100 focus:outline-none focus:border-white focus:ring-2 focus:ring-indigo-400 focus:z-10",children:s("div",{className:"flex items-baseline",children:[e("span",{className:"hidden text-gray-700 md:inline",children:"Filter"}),e("svg",{className:"w-2 h-2 text-gray-700 fill-current md:ml-2",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 961.243 599.998",children:e("path",{d:"M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z"})})]})}),e("input",{className:"relative w-full px-6 py-3 rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-400",autoComplete:"off",type:"text",name:"search",value:t.search,onChange:h,placeholder:"Search…"})]}),e("button",{onClick:v,className:"ml-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none",type:"button",children:"Reset"})]})};export{C as default};
