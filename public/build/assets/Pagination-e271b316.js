import{a as t,d as a}from"./app-7eee5ed8.js";import{c as s}from"./index-d3aa8850.js";const d=({active:e,label:o,url:r})=>{const n=s(["mr-1 mb-1","px-4 py-2","border border-solid border-gray-300 rounded","text-sm","text-white","bg-stone-700","hover:bg-stone-800","focus:outline-none focus:border-primary focus:text-primary bg-stone-900"],{"bg-stone-900":e});return t(a,{className:n,href:r,children:t("span",{dangerouslySetInnerHTML:{__html:o}})})},m=({label:e})=>{const o=s("mr-1 mb-1 px-4 py-2 text-sm border rounded border-solid border-stone-700 bg-stone-700 text-white opacity-25");return t("div",{className:o,dangerouslySetInnerHTML:{__html:e}})},u=({links:e=[]})=>e.length===3?null:t("div",{className:"flex flex-wrap mt-6 -mb-1",children:e.map(({active:o,label:r,url:n})=>n===null?t(m,{label:r},r):t(d,{label:r,active:o,url:n},r))});export{u as P};
