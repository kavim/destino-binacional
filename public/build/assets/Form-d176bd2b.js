import{a as e,W as w,j as t,F as b}from"./app-c778ce5a.js";import{I as c}from"./InputLabel-728baed7.js";import{P as f}from"./PrimaryButton-2da31159.js";import{I as s,T as n}from"./TextInput-703dbd3f.js";import{S as h}from"./SelectInput-9fea2cce.js";import{I as F,c as E,C as I}from"./ImagicLoader-e4edf8b2.js";import{D as j,a as C}from"./DataPickerInputEnd-39505bd3.js";import"./Modal-8c98ebf8.js";import"./transition-7bddba84.js";import"./dayjs.min-a9f16041.js";const D=({onDelete:l,children:d})=>e("button",{className:"inline-flex items-center px-4 py-2 bg-red-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-red-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-red-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-800 transition ease-in-out duration-150",tabIndex:"-1",type:"button",onClick:l,children:d});function M({handleOnChange:l,submit:d,data:a,errors:i,processing:g,onDelete:p}){const{categories:N,cities:u,grouped_categories:v}=w().props,y=m=>{l({target:{name:"featured_image",value:m}})},k=()=>{l({target:{name:"is_online",value:!a.is_online}})},_=()=>["heading","|","bold","italic","link","bulletedList","numberedList","|","outdent","indent","|","blockQuote","insertTable","mediaEmbed","undo","redo"];return t("form",{onSubmit:d,children:[t("div",{className:"mb-5 bg-stone-200 rounded-2xl p-2",children:[e("div",{className:"flex justify-center",children:a.featured_image?e("div",{className:"mb-3",children:e("img",{src:a.featured_image,alt:"featured_image",className:"w-96 rounded-2xl"})}):e(b,{children:a.image&&e("div",{className:"mb-3",children:e("img",{src:a.image,alt:"current_image",className:"w-96 rounded-2xl"})})})}),e(F,{onCorte:y}),e(s,{message:i.featured_image,className:"mt-2"}),e(s,{message:i.image,className:"mt-2"})]}),e("div",{className:"divider mt-10",children:"Identificación"}),t("div",{className:"my-5",children:[e(c,{htmlFor:"title",value:"Title"}),e(n,{type:"text",name:"title",value:a.title,className:"mt-1 block w-full",autoComplete:"title",onChange:l,placeholder:"Introduce el título del evento"}),e(s,{message:i.title,className:"mt-2"})]}),t("div",{className:"my-5",children:[e(c,{htmlFor:"description",value:"Descripción del Evento",className:"mb-1"}),e(E.CKEditor,{editor:I,config:{toolbar:_()},data:a.description,name:"description",value:a.description,onChange:(m,r)=>{const o=r.getData();l({target:{name:"description",value:o}})}}),e(s,{message:i.description,className:"mt-2"})]}),t("div",{className:"my-5",children:[e(c,{htmlFor:"start",value:"Fecha de inicio del Evento"}),e(j,{start:a.start,handleOnChange:l,className:"mt-1 block w-full"}),e(s,{message:i.start,className:"mt-2"})]}),t("div",{className:"my-5",children:[e(c,{htmlFor:"end",value:"Fecha de cierre del Evento"}),e(C,{end:a.end,handleOnChange:l,className:"mt-1 block w-full"}),e(s,{message:i.end,className:"mt-2"})]}),t("div",{className:"my-5",children:[e(c,{htmlFor:"category_id",value:"Category"}),t(h,{name:"category_id",value:a.category_id,onChange:l,className:"mt-1 block w-full",children:[e("option",{defaultValue:!0,hidden:!0,children:"Elige una categoría"}),Object.keys(v).map((m,r)=>e("optgroup",{label:N[r].name,children:v[m].map((o,x)=>e("option",{value:o.id,children:o.name},x))},r))]}),e(s,{message:i.category_id,className:"mt-2"})]}),e("div",{className:"divider mt-10",children:"Detalles para ubicar el evento"}),e("div",{className:"form-control",children:t("label",{className:"cursor-pointer",children:[e("input",{type:"checkbox",defaultChecked:!!a.is_online,onClick:k,className:"checkbox checkbox-primary"}),e("span",{className:"label-text ml-2",children:"Es un evento online?"})]})}),a.is_online?t("div",{className:"my-3",children:[e(c,{htmlFor:"link",value:"Web del Evento (opcional)"}),e(n,{type:"text",name:"link",value:a.link,className:"mt-1 block w-full",placeholder:"Webinar link",onChange:l}),e(s,{message:i.link,className:"mt-2"})]}):t(b,{children:[t("div",{className:"my-3",children:[e(c,{htmlFor:"google_maps_src",value:"Google Maps link"}),e(n,{type:"text",name:"google_maps_src",value:a.google_maps_src,className:"mt-1 block w-full",onChange:l}),e(s,{message:i.google_maps_src,className:"mt-2"})]}),t("div",{className:"my-3",children:[e(c,{htmlFor:"address",value:"Dirección"}),e(n,{type:"text",name:"address",value:a.address,className:"mt-1 block w-full",placeholder:"Address",onChange:l}),e(s,{message:i.address,className:"mt-2"})]}),t("div",{className:"my-3",children:[e(c,{htmlFor:"city_id",value:"Ciudad"}),t(h,{name:"city_id",value:a.city_id,onChange:l,className:"mt-1 block w-full",children:[e("option",{defaultValue:!0,hidden:!0,children:"Elige una Ciudad"}),Object.keys(u).map((m,r)=>e("option",{value:u[m].id,children:u[m].name},r))]}),e(s,{message:i.city_id,className:"mt-2"})]})]}),p?t("div",{className:"flex justify-between mt-5",children:[e(D,{type:"button",onDelete:p,children:"Delete"}),e(f,{disabled:g,children:"Save"})]}):e("div",{className:"flex justify-end mt-5",children:e(f,{disabled:g,children:"Save"})})]})}export{M as default};
