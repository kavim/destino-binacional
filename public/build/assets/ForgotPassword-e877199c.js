import{W as d,j as s,a as e,b as u}from"./app-d06630b7.js";import{G as c}from"./GuestLayout-50fd7780.js";import{I as p}from"./InputError-86582321.js";import{P as f}from"./PrimaryButton-6180f36b.js";import{T as g}from"./TextInput-e77e5f69.js";import"./ApplicationLogo-fc2995f7.js";function v({status:t}){const{data:r,setData:o,post:m,processing:l,errors:i}=d({email:""}),n=a=>{o(a.target.name,a.target.value)};return s(c,{children:[e(u,{title:"Forgot Password"}),e("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."}),t&&e("div",{className:"mb-4 font-medium text-sm text-green-600 dark:text-green-400",children:t}),s("form",{onSubmit:a=>{a.preventDefault(),m(route("password.email"))},children:[e(g,{id:"email",type:"email",name:"email",value:r.email,className:"mt-1 block w-full",isFocused:!0,onChange:n}),e(p,{message:i.email,className:"mt-2"}),e("div",{className:"flex items-center justify-end mt-4",children:e(f,{className:"ml-4",disabled:l,children:"Email Password Reset Link"})})]})]})}export{v as default};
