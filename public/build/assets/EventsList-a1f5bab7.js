import{W as o,a,d as m,j as e}from"./app-d1948491.js";import{d as r}from"./dayjs.min-b2063335.js";import"./es-5f4dd6d7.js";function u(){const{events:d}=o().props;return r.locale("es"),a("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-3 md:gap-8 p-5 md:max-w-4xl mx-auto lg:max-w-6xl",children:d.map(({slug:l,title:i,image:c,start:t,end:n},s)=>a(m,{href:route("site.events.show",l),children:e("div",{className:"card w-full bg-base-100 shadow-xl mb-4 cursor-pointer",children:[a("figure",{children:a("img",{src:c,alt:"Shoes"})}),e("div",{className:"card-body",children:[a("h2",{className:"card-title",children:i}),a("div",{className:"card-actions justify-start",children:a("div",{className:"badge badge-outline",children:r(t).format("DD/MM")})})]})]},s)},s))})}export{u as default};
