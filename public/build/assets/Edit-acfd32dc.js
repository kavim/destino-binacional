import{q as g,W as u,a as r,y as h}from"./app-7d94c813.js";import{A as y}from"./AuthenticatedLayout-cc690316.js";import x from"./Form-1d3a8eb2.js";import"./ApplicationLogo-21847f67.js";import"./transition-fa174abb.js";import"./ResponsiveNavLink-3921cb1f.js";import"./InputLabel-9e824684.js";import"./PrimaryButton-bc8dcc43.js";import"./TextInput-0b300921.js";import"./InputError-cec39a2e.js";import"./ckeditor-4d373d07.js";import"./DeleteButton-7113ec7b.js";import"./Modal-ed4a2d78.js";import"./Categories-9d99cceb.js";import"./index-4d043d36.js";import"./index-c91cc821.js";import"./MultipleCheckbox-dc5c9043.js";import"./Checkbox-9ee32c56.js";function S(){const{auth:o,tour:t,category_ids:i}=g().props,{data:a,setData:s,errors:m,put:p,processing:c}=u({title:t.title||"",description:t.description||"",price:t.price||"",currency:t.currency||"BRL",featured_image:"",image:t.image,google_maps_src:t.google_maps_src||"",meeting_point:t.meeting_point||"",guide:t.guide||"",start:t.start||"",end:t.end||"",category_ids:i||[]}),d=e=>{s(e.target.name,e.target.type==="checkbox"?e.target.checked:e.target.value)},n=e=>{e.preventDefault(),p(route("tours.update",t.id),{preserveScroll:!0})};function l(){confirm("Borrar este Local? "+t.title)&&h.visit(route("tours.destroy",t.id),{method:"delete"})}return r(y,{auth:o,header:r("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:"Editar Local"}),children:r("div",{className:"py-12",children:r("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6",children:r("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:r(x,{handleOnChange:d,submit:n,data:a,errors:m,processing:c,onDelete:l})})})})})}export{S as default};
