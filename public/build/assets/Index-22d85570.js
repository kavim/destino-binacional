import{q as o,j as e,a,b as m}from"./app-8ca41458.js";import{S as l}from"./SiteLayout-af294430.js";import{P as n}from"./Pagination-b012784f.js";import c from"./CategoryHeader-e2904708.js";import p from"./PlaceCardList-775e64ea.js";import"./ApplicationLogo-954a2f84.js";import"./ResponsiveNavLink-75ead759.js";import"./index-3919cece.js";function j(){const{places:r,category:t}=o().props,{data:s,links:i}=r;return e(l,{children:[a(m,{title:t.name}),a(c,{category:t}),a("div",{className:"w-full",children:a("div",{className:"shadow-sm text-white p-6 bg-cyan-800 text-center",children:t.description})}),e("div",{className:"sm:max-w-full lg:max-w-7xl mx-auto my-5",children:[a(p,{places:s}),a(n,{links:i})]})]})}export{j as default};
