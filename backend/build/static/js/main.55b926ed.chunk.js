(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{29:function(e,t,n){e.exports=n(42)},34:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var a,r,o=n(1),c=n.n(o),l=n(25),i=n.n(l),s=(n(34),n(11)),u=n(0),m=n(3),g=n.n(m),d=n(6),p=n(4),b=function(){var e=Object(o.useState)(null),t=Object(p.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)(null),l=Object(p.a)(r,2),i=l[0],m=l[1],b=Object(u.m)(),E=function(e){return function(t){return e(t.target.value)}},f=function(){var e=Object(d.a)(g.a.mark(function e(t){var a,r,o,c;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a={user:n,password:i},e.prev=2,console.log(a),e.next=6,fetch("".concat("/","api/login/administrador"),{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json"}});case 6:if(!(r=e.sent).ok){e.next=16;break}return e.next=10,r.json();case 10:o=e.sent,c=o.token,localStorage.setItem("app_jwt",c),b("/"),e.next=17;break;case 16:throw"error";case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(2),console.error(e.t0),alert("Erro ao realizar login como administrador");case 23:case"end":return e.stop()}},e,null,[[2,19]])}));return function(t){return e.apply(this,arguments)}}();return c.a.createElement(c.a.Fragment,null,c.a.createElement("br",null),c.a.createElement("h3",null,"Login como administrador:"),c.a.createElement("article",null,c.a.createElement("form",null,c.a.createElement("label",null,"Nome:"),c.a.createElement("input",{type:"text",onChange:E(a)}),c.a.createElement("label",null,"Senha:"),c.a.createElement("input",{type:"password",onChange:E(m)}),c.a.createElement("br",null),c.a.createElement("br",null),c.a.createElement("button",{onClick:f},"Login"))),c.a.createElement(s.b,{to:"/"},"Volar ao inicio"))},E=n(20),f=n(18),h=n(19),k=h.a.button(a||(a=Object(f.a)(["\n    // width: 300px;\n    // height: 50px;\n    // border-radius: 10px;\n    // background-color: rgba(10,20,30,0.3);\n    // :hover{\n    //     cursor: pointer;\n    //     background-color: rgba(10,20,30,0.7);\n    // }\n"]))),j=function(e){var t=e.successPath,n=e.setLogged,a=e.setToken,r=e.setLoading,o=function(){var e=Object(d.a)(g.a.mark(function e(o){var c,l;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat("/").concat(t),{method:"POST",body:JSON.stringify({access_token:o.access_token})});case 3:if(c=e.sent,r(!1),c.ok){e.next=7;break}throw"error";case 7:return e.next=9,c.json();case 9:l=e.sent,localStorage.setItem("app_jwt",l.token),a(l.token),n(l.token),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(0),alert("Erro ao realizar login");case 18:case"end":return e.stop()}},e,null,[[0,15]])}));return function(t){return e.apply(this,arguments)}}(),l=Object(E.b)({onSuccess:o,onError:function(e){return alert("Falha ao realizar login")},scope:"profile email https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly"});return c.a.createElement(k,{style:{border:"1px red"},onClick:function(){r(!0),l()}},"Sign in with Google")},w=function(e){return c.a.createElement(E.a,{clientId:e.clientId},e.children)},x=function(e){var t=e.setLogged;return c.a.createElement("button",{onClick:function(){localStorage.removeItem("app_jwt"),t(!1)}}," Logout ")},L=h.a.footer(r||(r=Object(f.a)(["\n  footer {\n    position: fixed;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    height: 60px; /* altura do rodap\xe9 */\n    // background-color: #f5f5f5;\n    background-color: red;\n  }\n"]))),v=function(e){var t=e.isLogged,n=e.setLogged,a=e.token,r=e.setToken,l=e.isLoading,i=e.setLoading,s=Object(o.useState)(!1),u=Object(p.a)(s,2),m=u[0],g=u[1];return l?c.a.createElement(c.a.Fragment,null,c.a.createElement("br",null),c.a.createElement("br",null),c.a.createElement("br",null),c.a.createElement("h1",{style:{"text-align":"center"},"aria-busy":"true"})):t?c.a.createElement(c.a.Fragment,null,c.a.createElement("h3",null,"Logado com sucesso:"),c.a.createElement("article",{onClick:function(e){var t=document.createElement("textarea");t.innerText=e.target.innerText,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),g(!0)}},a),c.a.createElement("p",{style:{"text-align":"center"}},c.a.createElement("ins",null,m?"Texto copiado":c.a.createElement("br",null)," ")),c.a.createElement(x,{setLogged:n})):c.a.createElement(c.a.Fragment,null,c.a.createElement("h3",null,"Login:"),c.a.createElement(w,{clientId:"931447980528-tid2bpnirm93qpa98l25cp6j73p5scuq.apps.googleusercontent.com"},c.a.createElement("label",null,"Login como aluno: "),c.a.createElement(j,{successPath:"api/login/aluno",setToken:r,setLogged:n,setLoading:i}),c.a.createElement("label",null,"Login como professor: "),c.a.createElement(j,{successPath:"api/login/professor",setToken:r,setLogged:n,setLoading:i})))},O=function(){var e=Object(o.useState)(localStorage.getItem("app_jwt")),t=Object(p.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)(!!n),l=Object(p.a)(r,2),i=l[0],u=l[1],m=Object(o.useState)(!1),g=Object(p.a)(m,2),d=g[0],b=g[1];return c.a.createElement("main",{className:"container"},c.a.createElement("br",null),c.a.createElement(v,{isLogged:i,setLogged:u,isLoading:d,setLoading:b,token:n,setToken:a}),c.a.createElement("br",null),c.a.createElement(L,null,c.a.createElement(s.b,{to:"admin"},"Entrar como administrador")," ",c.a.createElement("br",null),c.a.createElement("a",{href:"#"},"Veja o projeto no github")))},S=function(){return c.a.createElement(s.a,{"data-theme":"dark"},c.a.createElement(u.c,null,c.a.createElement(u.a,{path:"/",element:c.a.createElement(O,null)}),c.a.createElement(u.a,{path:"/admin",element:c.a.createElement(b,null)})))},y=function(e){e&&e instanceof Function&&n.e(1).then(n.bind(null,43)).then(function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,o=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),o(e),c(e)})};i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement("div",{className:"container flex-center"},c.a.createElement(S,null))),document.getElementById("root")),y()}},[[29,3,2]]]);
//# sourceMappingURL=main.55b926ed.chunk.js.map