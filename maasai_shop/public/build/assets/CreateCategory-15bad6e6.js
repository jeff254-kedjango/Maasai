import{r as n,j as e,y as o}from"./app-370495a4.js";function l(){const[r,a]=n.useState(""),s=t=>{t.preventDefault(),o.post("/categories",{name:r})};return e.jsxs("div",{children:[e.jsx("h1",{children:"Create Category"}),e.jsxs("form",{onSubmit:s,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Name"}),e.jsx("input",{type:"text",className:"form-control",value:r,onChange:t=>a(t.target.value),required:!0})]}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create"})]})]})}export{l as default};