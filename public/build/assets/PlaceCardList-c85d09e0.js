import{j as a,a as e,d as i}from"./app-c778ce5a.js";function c({places:d}){return a("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-5",children:[d.map((s,r)=>e(i,{href:route("places.byPlaceIdentifier",s.slug),className:"cursor-pointer",children:a("div",{className:"card lg:card-side bg-base-100 shadow-xl mb-10 md:mb-4",children:[e("figure",{children:e("img",{src:s.image,alt:"Album",className:"md:w-56 md:h-48"})}),a("div",{className:"card-body justify-between",children:[e("h2",{className:"card-title",children:s.name}),e("div",{className:"card-actions justify-end",children:e("button",{className:"btn btn-outline btn-sm",children:"Ver Mas"})})]})]})},r)),d.length===0&&e("div",{className:"flex justify-center w-full text-center",children:e("span",{children:"There is no places"})})]})}export{c as default};
