import{j as s,Y as m}from"./app-370495a4.js";import{A as t}from"./AuthenticatedLayout-7d4ee331.js";import i from"./DeleteUserForm-c178e98f.js";import o from"./UpdatePasswordForm-c1ce7f8a.js";import d from"./UpdateProfileInformationForm-c893c45e.js";import"./ApplicationLogo-2c87a35a.js";import"./transition-35a98586.js";import"./TextInput-5bb9320a.js";import"./InputLabel-4c2106fe.js";import"./PrimaryButton-7d16605c.js";function w({auth:r,mustVerifyEmail:e,status:a}){return s.jsxs(t,{user:r.user,header:s.jsx("h2",{className:"font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight",children:"Profile"}),children:[s.jsx(m,{title:"Profile"}),s.jsx("div",{className:"py-12",children:s.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6",children:[s.jsx("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:s.jsx(d,{mustVerifyEmail:e,status:a,className:"max-w-xl"})}),s.jsx("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:s.jsx(o,{className:"max-w-xl"})}),s.jsx("div",{className:"p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg",children:s.jsx(i,{className:"max-w-xl"})})]})})]})}export{w as default};