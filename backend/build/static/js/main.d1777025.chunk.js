(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{29:function(e,t,n){e.exports=n(42)},34:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var a,r,o=n(1),l=n.n(o),c=n(25),s=n.n(c),i=(n(34),n(11)),u=n(0),m=n(3),g=n.n(m),d=n(6),p=n(4),b=function(){var e=Object(o.useState)(null),t=Object(p.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)(null),c=Object(p.a)(r,2),s=c[0],m=c[1],b=Object(u.m)(),E=function(e){return function(t){return e(t.target.value)}},h=function(){var e=Object(d.a)(g.a.mark(function e(t){var a,r,o,l;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a={user:n,password:s},e.prev=2,console.log(a),e.next=6,fetch("".concat("http://localhost:3001/","api/login/administrador"),{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json"}});case 6:if(!(r=e.sent).ok){e.next=16;break}return e.next=10,r.json();case 10:o=e.sent,l=o.token,localStorage.setItem("app_jwt",l),b("/"),e.next=17;break;case 16:throw"error";case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(2),console.error(e.t0),alert("Erro ao realizar login como administrador");case 23:case"end":return e.stop()}},e,null,[[2,19]])}));return function(t){return e.apply(this,arguments)}}();return l.a.createElement(l.a.Fragment,null,l.a.createElement("br",null),l.a.createElement("h3",null,"Login como administrador:"),l.a.createElement("article",null,l.a.createElement("form",null,l.a.createElement("label",null,"Nome:"),l.a.createElement("input",{type:"text",onChange:E(a)}),l.a.createElement("label",null,"Senha:"),l.a.createElement("input",{type:"password",onChange:E(m)}),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("button",{onClick:h},"Login"))),l.a.createElement(i.b,{to:"/"},"Volar ao inicio"))},E=n(20),h=n(18),f=n(19),k=f.a.button(a||(a=Object(h.a)(["\n    // width: 300px;\n    // height: 50px;\n    // border-radius: 10px;\n    // background-color: rgba(10,20,30,0.3);\n    // :hover{\n    //     cursor: pointer;\n    //     background-color: rgba(10,20,30,0.7);\n    // }\n"]))),j=function(e){var t=e.successPath,n=e.setLogged,a=e.setToken,r=e.setLoading,o=function(){var e=Object(d.a)(g.a.mark(function e(o){var l,c;return g.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat("http://localhost:3001/").concat(t),{method:"POST",body:JSON.stringify({access_token:o.access_token})});case 3:if(l=e.sent,r(!1),l.ok){e.next=7;break}throw"error";case 7:return e.next=9,l.json();case 9:c=e.sent,localStorage.setItem("app_jwt",c.token),a(c.token),n(c.token),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(0),alert("Erro ao realizar login");case 18:case"end":return e.stop()}},e,null,[[0,15]])}));return function(t){return e.apply(this,arguments)}}(),c=Object(E.b)({onSuccess:o,onError:function(e){return alert("Falha ao realizar login")},scope:"profile email https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly"});return l.a.createElement(k,{style:{border:"1px red"},onClick:function(){r(!0),c()}},"Sign in with Google")},w=function(e){return l.a.createElement(E.a,{clientId:e.clientId},e.children)},x=function(e){var t=e.setLogged;return l.a.createElement("button",{onClick:function(){localStorage.removeItem("app_jwt"),t(!1)}}," Logout ")},L=f.a.footer(r||(r=Object(h.a)(["\n  footer {\n    position: fixed;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    height: 60px; /* altura do rodap\xe9 */\n    // background-color: #f5f5f5;\n    background-color: red;\n  }\n"]))),v=function(e){var t=e.isLogged,n=e.setLogged,a=e.token,r=e.setToken,c=e.isLoading,s=e.setLoading,i=Object(o.useState)(!1),u=Object(p.a)(i,2),m=u[0],g=u[1];return c?l.a.createElement(l.a.Fragment,null,l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("h1",{style:{"text-align":"center"},"aria-busy":"true"})):t?l.a.createElement(l.a.Fragment,null,l.a.createElement("h3",null,"Logoado com sucesso:"),l.a.createElement("article",{onClick:function(e){var t=document.createElement("textarea");t.innerText=e.target.innerText,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),g(!0)}},a),l.a.createElement("p",{style:{"text-align":"center"}},l.a.createElement("ins",null,m?"Texto copiado":l.a.createElement("br",null)," ")),l.a.createElement(x,{setLogged:n})):l.a.createElement(l.a.Fragment,null,l.a.createElement("h3",null,"Login:"),l.a.createElement(w,{clientId:"931447980528-tid2bpnirm93qpa98l25cp6j73p5scuq.apps.googleusercontent.com"},l.a.createElement("label",null,"Login como aluno: "),l.a.createElement(j,{successPath:"api/login/aluno",setToken:r,setLogged:n,setLoading:s}),l.a.createElement("label",null,"Login como professor: "),l.a.createElement(j,{successPath:"api/login/professor",setToken:r,setLogged:n,setLoading:s})))},O=function(){var e=Object(o.useState)(localStorage.getItem("app_jwt")),t=Object(p.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)(!!n),c=Object(p.a)(r,2),s=c[0],u=c[1],m=Object(o.useState)(!1),g=Object(p.a)(m,2),d=g[0],b=g[1];return l.a.createElement("main",{className:"container"},l.a.createElement("br",null),l.a.createElement(v,{isLogged:s,setLogged:u,isLoading:d,setLoading:b,token:n,setToken:a}),l.a.createElement("br",null),l.a.createElement(L,null,l.a.createElement(i.b,{to:"admin"},"Entrar como administrador")," ",l.a.createElement("br",null),l.a.createElement("a",{href:"#"},"Veja o projeto no github")))},S=function(){return l.a.createElement(i.a,{"data-theme":"dark"},l.a.createElement(u.c,null,l.a.createElement(u.a,{path:"/",element:l.a.createElement(O,null)}),l.a.createElement(u.a,{path:"/admin",element:l.a.createElement(b,null)})))},y=function(e){e&&e instanceof Function&&n.e(1).then(n.bind(null,43)).then(function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,o=t.getLCP,l=t.getTTFB;n(e),a(e),r(e),o(e),l(e)})};s.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement("div",{className:"container flex-center"},l.a.createElement(S,null))),document.getElementById("root")),y()}},[[29,3,2]]]);
//# sourceMappingURL=main.d1777025.chunk.js.map