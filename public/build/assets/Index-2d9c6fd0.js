import{q as d,j as a,a as e,d as s,b as o}from"./app-d06630b7.js";import{A as m}from"./AuthenticatedLayout-f033f968.js";import{P as h}from"./Pagination-98e10a08.js";import p from"./SearchFilter-2ccf4ec8.js";import"./ApplicationLogo-fc2995f7.js";import"./transition-f7c88306.js";import"./ResponsiveNavLink-a2a25b4e.js";import"./index-1f0c3e4a.js";import"./pickBy-2b3d1c80.js";function j(){const{places:r}=d().props,{data:l,links:c}=r;return a(m,{header:a("div",{className:"flex justify-between mt-2",children:[a("div",{className:"",children:[e("i",{className:"fa-solid fa-location-dot fa-fw"}),e("span",{className:"",children:"Locales"})]}),e("div",{className:"px-2",children:e(s,{href:route("places.create"),className:"btn-success",children:"Crear nuevo"})})]}),children:[e(o,{title:"Locales"}),a("div",{className:"py-12",children:[e("div",{className:"max-w-7xl mx-auto sm:px-2",children:a("div",{className:"overflow-x-auto bg-white rounded-xl shadow mb-3",children:[e("div",{className:"flex justify-end p-2",children:e(p,{})}),a("table",{className:"table w-full",children:[e("thead",{children:a("tr",{children:[e("th",{className:"bg-white text-center",children:"Image"}),e("th",{className:"bg-white",children:"name"}),e("th",{className:"bg-white"})]})}),a("tbody",{children:[l.map(({id:t,image:i,name:n})=>a("tr",{children:[e("td",{children:e("img",{src:i,alt:"logo",className:"w-32 mx-auto rounded-lg"})}),e("td",{children:e(s,{href:route("places.edit",t),className:"flex items-center px-4 py-2 focus:text-primary focus:outline-none",children:n})}),e("td",{children:e(s,{href:route("places.edit",t),className:"flex items-center px-4 py-2 focus:text-primary focus:outline-none",children:e("i",{className:"fa-solid fa-chevron-right"})})})]},t)),l.length===0&&e("tr",{children:e("td",{className:"px-6 py-4 border-t text-center",colSpan:"3",children:"☹️ No Places found."})})]})]})]})}),e("div",{className:"flex justify-center",children:e(h,{links:c})})]})]})}export{j as default};
