import{_ as d,j as s,a as e,n as u}from"./app-c778ce5a.js";import{G as c}from"./GuestLayout-5eebf4d3.js";import{T as p,I as g}from"./TextInput-703dbd3f.js";import{P as w}from"./PrimaryButton-2da31159.js";import"./ApplicationLogo-0690486b.js";function k({status:t}){const{data:r,setData:o,post:m,processing:l,errors:i}=d({email:""}),n=a=>{o(a.target.name,a.target.value)};return s(c,{children:[e(u,{title:"Forgot Password"}),e("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."}),t&&e("div",{className:"mb-4 font-medium text-sm text-green-600 dark:text-green-400",children:t}),s("form",{onSubmit:a=>{a.preventDefault(),m(route("password.email"))},children:[e(p,{id:"email",type:"email",name:"email",value:r.email,className:"mt-1 block w-full",isFocused:!0,onChange:n}),e(g,{message:i.email,className:"mt-2"}),e("div",{className:"flex items-center justify-end mt-4",children:e(w,{className:"ml-4",disabled:l,children:"Email Password Reset Link"})})]})]})}export{k as default};
