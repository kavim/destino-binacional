import{q as o,j as e,a,b as m}from"./app-ff989e68.js";import{S as l}from"./SiteLayout-d818c79d.js";import{P as n}from"./Pagination-e427043a.js";import c from"./CategoryHeader-61b392df.js";import p from"./PlaceCardList-af51b19a.js";import"./ApplicationLogo-dfa6aefe.js";import"./ResponsiveNavLink-1c6ee151.js";import"./index-b277245d.js";function j(){const{places:r,category:t}=o().props,{data:s,links:i}=r;return e(l,{children:[a(m,{title:t.name}),a(c,{category:t}),a("div",{className:"w-full",children:a("div",{className:"shadow-sm text-white p-6 bg-cyan-800 text-center",children:t.description})}),e("div",{className:"sm:max-w-full lg:max-w-7xl mx-auto my-5",children:[a(p,{places:s}),a(n,{links:i})]})]})}export{j as default};
