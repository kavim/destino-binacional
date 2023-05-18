import{r as f,a as e,q as x,j as s,F as h}from"./app-d06630b7.js";import{I as n}from"./InputLabel-e2e39e8e.js";import{P as b}from"./PrimaryButton-6180f36b.js";import{T as v}from"./TextInput-e77e5f69.js";import{S as w}from"./SelectInput-b989a399.js";import{I as r}from"./InputError-86582321.js";import{I as S,c as E,C as I}from"./ImagicLoader-6a445c09.js";import{D as N}from"./index.esm-2288cf53.js";import F from"./Tags-30d2912a.js";import"./Modal-e66de4c1.js";import"./transition-f7c88306.js";import"./dayjs.min-3463dbda.js";import"./MultipleCheckbox-3ed03a6b.js";import"./Checkbox-e4be9f82.js";import"./index-1f0c3e4a.js";function C({start:a,handleOnChange:o,className:t,placeholder:l}){const[i,u]=f.useState({startDate:new Date(a).toLocaleDateString("pt-BR",{year:"numeric",month:"2-digit",day:"2-digit"}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$2-$1"),endDate:new Date(a).toLocaleDateString("pt-BR",{year:"numeric",month:"2-digit",day:"2-digit"}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$2-$1")}),g=d=>{u(d)};return f.useEffect(()=>{i!==null&&i.startDate!==null&&i.startDate!==void 0&&i.startDate!==""&&i.startDate,o({target:{name:"start",value:i.startDate}})},[i]),e(N,{i18n:"es_ES",placeholder:l??"Seleccione la fecha de inicio del evento",value:i,useRange:!1,asSingle:!0,onChange:g,containerClassName:t,displayFormat:"DD/MM/YYYY"})}function $({end:a,handleOnChange:o,className:t,placeholder:l}){const[i,u]=f.useState({startDate:new Date(a).toLocaleDateString("pt-BR",{year:"numeric",month:"2-digit",day:"2-digit"}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$2-$1"),endDate:new Date(a).toLocaleDateString("pt-BR",{year:"numeric",month:"2-digit",day:"2-digit"}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$2-$1")}),g=d=>{u(d)};return f.useEffect(()=>{o({target:{name:"end",value:i.startDate}})},[i]),e(N,{i18n:"es_ES",placeholder:l??"Seleccione la fecha de cierre del evento",value:i,useRange:!1,asSingle:!0,onChange:g,containerClassName:t,displayFormat:"DD/MM/YYYY"})}const L=({onDelete:a,children:o})=>e("button",{className:"inline-flex items-center px-4 py-2 bg-red-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-red-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-red-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-800 transition ease-in-out duration-150",tabIndex:"-1",type:"button",onClick:a,children:o});function U({handleOnChange:a,submit:o,data:t,errors:l,processing:i,onDelete:u}){const{categories:g,cities:d,grouped_categories:Y,parent_tags:j}=x().props,y=c=>{a({target:{name:"featured_image",value:c}})},k=()=>{a({target:{name:"is_online",value:!t.is_online}})},D=c=>{let m=[...t.tag_ids],p=parseInt(c.target.value);c.target.checked?m=[...t.tag_ids,p]:m.splice(t.tag_ids.indexOf(p),1),a({target:{name:"tag_ids",value:m}})},_=()=>["heading","|","bold","italic","link","bulletedList","numberedList","|","outdent","indent","|","blockQuote","insertTable","mediaEmbed","undo","redo"];return s("form",{onSubmit:o,children:[s("div",{className:"mb-5 bg-stone-200 rounded-2xl p-2",children:[e("div",{className:"flex justify-center",children:t.featured_image?e("div",{className:"mb-3",children:e("img",{src:t.featured_image,alt:"featured_image",className:"w-96 rounded-2xl"})}):e(h,{children:t.image&&e("div",{className:"mb-3",children:e("img",{src:t.image,alt:"current_image",className:"w-96 rounded-2xl"})})})}),e(S,{onCorte:y}),e(r,{message:l.featured_image,className:"mt-2"}),e(r,{message:l.image,className:"mt-2"})]}),e("div",{className:"divider mt-10",children:"Identificación"}),s("div",{className:"my-5",children:[e(n,{htmlFor:"title",value:"Title"}),e(v,{type:"text",name:"title",value:t.title,className:"mt-1 block w-full",autoComplete:"title",onChange:a,placeholder:"Introduce el título del evento"}),e(r,{message:l.title,className:"mt-2"})]}),s("div",{className:"my-5",children:[e(n,{htmlFor:"description",value:"Descripción del Evento",className:"mb-1"}),e(E.CKEditor,{editor:I,config:{toolbar:_()},data:t.description,name:"description",value:t.description,onChange:(c,m)=>{const p=m.getData();a({target:{name:"description",value:p}})}}),e(r,{message:l.description,className:"mt-2"})]}),s("div",{className:"my-5",children:[e(n,{htmlFor:"start",value:"Fecha de inicio del Evento"}),e(C,{start:t.start,handleOnChange:a,className:"mt-1 block w-full"}),e(r,{message:l.start,className:"mt-2"})]}),s("div",{className:"my-5",children:[e(n,{htmlFor:"end",value:"Fecha de cierre del Evento"}),e($,{end:t.end,handleOnChange:a,className:"mt-1 block w-full"}),e(r,{message:l.end,className:"mt-2"})]}),e("div",{className:"divider mt-10",children:"Tags"}),e("div",{className:"my-5",children:e(F,{handleCheck:D})}),e("div",{className:"divider mt-10",children:"Detalles para ubicar el evento"}),e("div",{className:"form-control",children:s("label",{className:"cursor-pointer",children:[e("input",{type:"checkbox",defaultChecked:!!t.is_online,onClick:k,className:"checkbox checkbox-primary"}),e("span",{className:"label-text ml-2",children:"Es un evento online?"})]})}),t.is_online?s("div",{className:"my-3",children:[e(n,{htmlFor:"link",value:"Web del Evento (opcional)"}),e(v,{type:"text",name:"link",value:t.link,className:"mt-1 block w-full",placeholder:"Webinar link",onChange:a}),e(r,{message:l.link,className:"mt-2"})]}):s(h,{children:[s("div",{className:"my-3",children:[e(n,{htmlFor:"google_maps_src",value:"Google Maps link"}),e(v,{type:"text",name:"google_maps_src",value:t.google_maps_src,className:"mt-1 block w-full",onChange:a}),e(r,{message:l.google_maps_src,className:"mt-2"})]}),s("div",{className:"my-3",children:[e(n,{htmlFor:"address",value:"Dirección"}),e(v,{type:"text",name:"address",value:t.address,className:"mt-1 block w-full",placeholder:"Address",onChange:a}),e(r,{message:l.address,className:"mt-2"})]}),s("div",{className:"my-3",children:[e(n,{htmlFor:"city_id",value:"Ciudad"}),s(w,{name:"city_id",value:t.city_id,onChange:a,className:"mt-1 block w-full",children:[e("option",{defaultValue:!0,hidden:!0,children:"Elige una Ciudad"}),Object.keys(d).map((c,m)=>e("option",{value:d[c].id,children:d[c].name},m))]}),e(r,{message:l.city_id,className:"mt-2"})]})]}),u?s("div",{className:"flex justify-between mt-5",children:[e(L,{type:"button",onDelete:u,children:"Delete"}),e(b,{disabled:i,children:"Save"})]}):e("div",{className:"flex justify-end mt-5",children:e(b,{disabled:i,children:"Save"})})]})}export{U as default};
