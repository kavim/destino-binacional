import{q as d,j as t,a as e,d as s,b as o}from"./app-a0da61ea.js";import{A as m}from"./AuthenticatedLayout-45f5bd48.js";import h from"./SearchFilter-e00151b0.js";import{P as f}from"./Pagination-40cabd01.js";import"./ApplicationLogo-1051ee41.js";import"./transition-f36c56b5.js";import"./ResponsiveNavLink-ec2afc8a.js";import"./pickBy-9ca1c0d0.js";import"./index-ce408955.js";function j(){const{events:l}=d().props,{data:r,links:i}=l;return t(m,{header:t("div",{className:"flex justify-between mt-2",children:[t("div",{className:"",children:[e("i",{className:"fa-solid fa-calendar-days mr-2"}),e("span",{className:"",children:"Eventos"})]}),e("div",{className:"px-2",children:e(s,{href:route("events.create"),className:"btn-success",children:"Crear nuevo"})})]}),children:[e(o,{title:"Eventos"}),t("div",{className:"py-12",children:[e("div",{className:"max-w-7xl mx-auto sm:px-2",children:t("div",{className:"overflow-x-auto bg-white rounded-xl shadow mb-3",children:[e("div",{className:"flex justify-end p-2",children:e(h,{})}),t("table",{className:"table w-full",children:[e("thead",{children:t("tr",{children:[e("th",{className:"bg-white text-center",children:"Image"}),e("th",{className:"bg-white",children:"Titulo"}),e("th",{className:"bg-white"})]})}),t("tbody",{children:[r.map(({id:a,image:c,title:n})=>t("tr",{children:[e("td",{className:"border-t",children:e("div",{className:"flex flex-col justify-middle align-center",children:e("img",{src:c,alt:"logo",className:"w-32 mx-auto rounded"})})}),e("td",{className:"border-t",children:e(s,{href:route("events.edit",a),className:"flex items-center px-4 py-2 focus:text-primary focus:outline-none",children:n})}),e("td",{className:"border-t",children:e(s,{href:route("events.edit",a),className:"flex items-center px-4 py-2 focus:text-primary focus:outline-none",children:e("i",{className:"fa-solid fa-chevron-right"})})})]},a)),r.length===0&&e("tr",{children:e("td",{className:"px-6 py-4 border-t text-center",colSpan:"3",children:"☹️ No events found."})})]})]})]})}),e("div",{className:"flex justify-center",children:e(f,{links:i})})]})]})}export{j as default};