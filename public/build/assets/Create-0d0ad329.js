import{W as n,_ as d,a as e}from"./app-c778ce5a.js";import{A as c}from"./AuthenticatedLayout-fd80f03d.js";import p from"./Form-d176bd2b.js";import"./ApplicationLogo-0690486b.js";import"./transition-7bddba84.js";import"./ResponsiveNavLink-3ce62a4c.js";import"./InputLabel-728baed7.js";import"./PrimaryButton-2da31159.js";import"./TextInput-703dbd3f.js";import"./SelectInput-9fea2cce.js";import"./ImagicLoader-e4edf8b2.js";import"./Modal-8c98ebf8.js";import"./DataPickerInputEnd-39505bd3.js";import"./dayjs.min-a9f16041.js";function F(){const{auth:a}=n().props,{data:o,setData:r,errors:i,post:s,reset:l,processing:m,recentlySuccessful:g}=d({title:"",description:"",google_maps_src:"",address:"",city_id:"",category_id:"",price:"",door_time:"",start:"",end:"",is_online:!1,link:"",featured_image:""});return e(c,{auth:a,header:e("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:"Crear Evento"}),children:e("div",{className:"py-12",children:e("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6",children:e("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:e(p,{handleOnChange:t=>{r(t.target.name,t.target.type==="checkbox"?t.target.checked:t.target.value)},submit:t=>{t.preventDefault(),s(route("events.store"))},data:o,errors:i,processing:m,onCorte:t=>{r("featured_image",t),r("image",null)}})})})})})}export{F as default};
