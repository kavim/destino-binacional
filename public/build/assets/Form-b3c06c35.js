import{q as b,j as i,a as e,F as x}from"./app-8ca41458.js";import{I as r}from"./InputLabel-c2b6a8fb.js";import{P as k}from"./PrimaryButton-369ed759.js";import{T as d}from"./TextInput-276ef178.js";import{S as u}from"./SelectInput-2ac3e1d9.js";import{I as c}from"./InputError-257b67da.js";import{c as g,C as _}from"./ckeditor-bd55f56b.js";import{I as F}from"./ImagicLoader-086d1a7a.js";import C from"./Categories-04c4bb55.js";import"./Modal-822a941f.js";import"./transition-b9bc6261.js";import"./index-8569c963.js";import"./index-3919cece.js";import"./MultipleCheckbox-a7b8a0e7.js";import"./Checkbox-c1862967.js";function M({handleOnChange:m,submit:v,data:a,errors:l,processing:N}){const{cities:n,place_types:p}=b().props,f=s=>{m({target:{name:"featured_image",value:s}})},h=()=>["heading","|","bold","italic","link","bulletedList","numberedList","|","outdent","indent","|","blockQuote","insertTable","mediaEmbed","undo","redo"],y=s=>{let t=[...a.category_ids],o=parseInt(s.target.value);s.target.checked?t=[...a.category_ids,o]:t.splice(a.category_ids.indexOf(o),1),m({target:{name:"category_ids",value:t}})};return i("form",{onSubmit:v,children:[i("div",{className:"mb-5 bg-stone-200 rounded-2xl p-2",children:[e("div",{className:"flex justify-center",children:a.featured_image?e("div",{className:"mb-3",children:e("img",{src:a.featured_image,alt:"featured_image",className:"w-96 rounded-2xl"})}):e(x,{children:a.image&&e("div",{className:"mb-3",children:e("img",{src:a.image,alt:"current_image",className:"w-96 rounded-2xl"})})})}),e(F,{onCorte:f}),e(c,{message:l.featured_image,className:"mt-2"}),e(c,{message:l.image,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"name",value:"Nombre"}),e(d,{type:"text",name:"name",value:a.name,className:"mt-1 block w-full",autoComplete:"name",onChange:m}),e(c,{message:l.name,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"description_es",value:"Descripción en Español"}),e(g.CKEditor,{editor:_,config:{toolbar:h()},data:a.description_es||"<p>Descripción en Español</p>",name:"description_es",value:a.description_es,onChange:(s,t)=>{const o=t.getData();m({target:{name:"description_es",value:o}})}}),e(c,{message:l.description_es,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"description_pt",value:"Descripción en Portugués"}),e(g.CKEditor,{editor:_,data:a.description_pt||"<p>Descripción en Portugués</p>",name:"description_pt",onChange:(s,t)=>{const o=t.getData();m({target:{name:"description_pt",value:o}})},className:"rounded"}),e(c,{message:l.description_pt,className:"mt-2"})]}),e("hr",{}),i("div",{className:"my-3",children:[e(r,{htmlFor:"google_maps_src",value:"Google Maps link"}),e(d,{type:"text",name:"google_maps_src",value:a.google_maps_src,className:"mt-1 block w-full",onChange:m}),e(c,{message:l.google_maps_src,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"address",value:"Dirección"}),e(d,{type:"text",name:"address",value:a.address,className:"mt-1 block w-full",placeholder:"Address",onChange:m}),e(c,{message:l.address,className:"mt-2"})]}),e("div",{className:"divider mt-10",children:"Categorias"}),e("div",{className:"my-5",children:e(C,{handleCheck:y})}),i("div",{className:"my-3",children:[e(r,{htmlFor:"city_id",value:"Ciudad"}),i(u,{name:"city_id",value:a.city_id,onChange:m,className:"mt-1 block w-full",children:[e("option",{defaultValue:!0,hidden:!0,children:"Elige una Ciudad"}),Object.keys(n).map((s,t)=>e("option",{value:n[s].id,children:n[s].name},t))]}),e(c,{message:l.city_id,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"place_type_id",value:"Tipo"}),i(u,{name:"place_type_id",value:a.place_type_id,onChange:m,className:"mt-1 block w-full",children:[e("option",{defaultValue:!0,hidden:!0,children:"Elija una opción"}),Object.keys(p).map((s,t)=>e("option",{value:p[s].id,children:p[s].name},t))]}),e(c,{message:l.type_id,className:"mt-2"})]}),i("div",{className:"my-3",children:[e(r,{htmlFor:"order",value:"Ordem"}),e(d,{type:"number",name:"order",value:a.order,className:"mt-1 block w-full",onChange:m,placeholder:"Order number (0, 1, 2, 3...)",min:"0",max:"9999"}),e(c,{message:l.order,className:"mt-2"})]}),e("div",{className:"flex justify-end",children:e(k,{className:"ml-4 m-4",disabled:N,children:"Save"})})]})}export{M as default};
