import{q as c,W as m,a as r}from"./app-6dd16c0e.js";import{A as l}from"./AuthenticatedLayout-cd67e01b.js";import n from"./Form-cdd7321c.js";import"./ApplicationLogo-cc80564f.js";import"./transition-7a82a852.js";import"./ResponsiveNavLink-03726774.js";import"./InputLabel-88de85bc.js";import"./PrimaryButton-055c1b13.js";import"./TextInput-c5fc34c6.js";import"./SelectInput-ba16fb9d.js";import"./InputError-8a640b98.js";import"./ckeditor-8f672e2e.js";import"./ImagicLoader-34db495f.js";import"./Modal-3a9bc0b6.js";function j(){const{auth:a,place:e}=c().props,{data:i,setData:s,errors:o,put:p,reset:g,processing:d,recentlySuccessful:h}=m({name:e.name,description_es:e.description_es||"",description_pt:e.description_pt||"",address:e.address||"",category_id:e.category_id,city_id:e.city_id,place_type_id:e.place_type_id,featured_image:"",image:e.image,google_maps_src:e.google_maps_src||""});return r(l,{auth:a,header:r("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:"Editar Local"}),children:r("div",{className:"py-12",children:r("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6",children:r("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:r(n,{handleOnChange:t=>{s(t.target.name,t.target.type==="checkbox"?t.target.checked:t.target.value)},submit:t=>{t.preventDefault(),p(route("places.update",e.id),{preserveScroll:!0})},data:i,errors:o,processing:d})})})})})}export{j as default};
