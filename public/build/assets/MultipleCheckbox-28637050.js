import{q as l,a as o,F as t}from"./app-d3f7d95e.js";import{C as d}from"./Checkbox-03cb9af2.js";function g({catId:a,handleCheck:n}){const{grouped_categories:s,category_ids:r}=l().props;return console.log(r),o(t,{children:s[a].map((e,c)=>o("div",{children:o(d,{onChange:n,label:e.name,value:e.id,isChecked:r.some(i=>i===e.id)})},c))})}export{g as default};