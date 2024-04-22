import{a as e,F as d,d as c,j as s,q as p,r as u}from"./app-d3f7d95e.js";import{d as a}from"./dayjs.min-7dca470b.js";import"./es-93a24076.js";import{t as w}from"./utils-d9d9a733.js";function n({event:l,index:i}){return e(d,{children:e(c,{href:route("site.events.show",l.slug),children:s("div",{className:"min-w-[260px] max-w-[260px] min-h-[300px] flex flex-col mr-5 cursor-pointer hover:scale-105 ease-in-out duration-300 rounded-lg shadow-md bg-white",children:[e("div",{children:e("figure",{children:e("img",{src:l.image,alt:l.image,className:"w-full rounded-t-lg aspect-square",loading:"lazy"})})}),s("div",{className:"whitespace-normal p-2 break-all flex flex-col justify-between grow rounded-b-lg",children:[e("div",{children:e("span",{className:"text-lg font-semibold",children:l.title})}),e("div",{className:"w-full flex items-center justify-start p-2 md:p-0 md:mt-4",children:l.start!==l.end?s(d,{children:[e("i",{className:"fa-solid fa-calendar-days mr-2 shadow-sm"}),a(l.start).format("DD MMMM"),e("i",{className:"fa-solid fa-arrows-left-right mx-2 shadow-sm"}),e("i",{className:"fa-solid fa-calendar-days mr-2 shadow-sm"}),a(l.end).format("DD MMMM")]}):s(d,{children:[e("i",{className:"fa-solid fa-calendar-days mr-2"}),a(l.start).format("DD MMMM")]})})]})]})},i)})}function y(){a.locale("es");const{grouped_events:l}=p().props,[i,m]=u.useState(null),h=()=>{const r=document.getElementById("slider");r.scrollLeft=10},f=r=>{m(r),h()};return s("div",{className:"bg-white rounded-xl md:p-2 sm:p-0 py-3 md:mx-4",children:[e("div",{className:"text-3xl md:text-4xl font-extrabold text-center",children:e("span",{className:"bg-clip-text text-transparent bg-stone-800",children:"Próximos eventos"})}),Object.keys(l).length>0?s(d,{children:[e("div",{className:"flex max-w-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide py-5 px-2",children:Object.keys(l).map((r,t)=>e("div",{label:t,onClick:()=>f(r),className:"min-w-32 min-h-48 font-medium mr-5 shadow-md border border-stone-800 rounded-lg cursor-pointer active:opacity-5 ease-in-out duration-200",children:e("div",{className:"w-32 md:w-24 flex-none text-center",children:s("div",{className:"block rounded-t-lg overflow-hidden text-center ",children:[e("div",{className:"bg-red-900 bg- text-white py-1",children:a(r).format("MMM")}),e("div",{className:"pt-1 border-l border-r border-white bg-white",children:e("span",{className:"text-5xl md:text-3xl font-bold leading-tight",children:a(r).format("DD")})}),e("div",{className:"border-l border-r border-b rounded-b-lg text-center border-white bg-white -pt-2 mb-1",children:e("span",{className:"text-sm",children:a(r).format("dddd")})})]})})},t))}),e("div",{id:"slider",className:"w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide px-2 py-5 flex flex-row",children:i?e(d,{children:l[i].map((r,t)=>e(n,{index:t,event:r},t))}):e(d,{children:Object.keys(l).map((r,t)=>l[r].map((x,o)=>e(n,{index:o,event:x},o)))})}),e("div",{className:"w-full flex justify-center my-5",children:s(c,{href:route("site.events.index"),className:"btn btn-outline",children:[w("see_more")," Eventos ",e("i",{className:"fa-solid fa-arrow-right ml-2"})]})})]}):e("div",{className:"flex justify-center w-full text-center",children:e("span",{children:"No hay eventos registrados"})})]})}export{y as default};
