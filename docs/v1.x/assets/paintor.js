class v{elements=[];addElement(t){t&&this.elements.push(t)}addElements(t){for(let e of t)this.elements.push(e)}getElements(){return this.elements}importElements(t){const e=t.getElements();for(const n of e)this.addElement(n)}removeAllElements(){this.elements=[]}removeTheseElements(t){t.length>0&&(this.elements=this.elements.filter(e=>!t.includes(e)))}}const j=Symbol("symStateId"),k=Symbol("symArrayAccess"),L=Symbol("symObjectAccess");let m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null};function x(i,t,e,n,s){m.element=i,m.propertyName=t,m.subPropertyName=e,m.bindFunction=n,m.statementRepaintFunction=s}function A(){m={element:null,propertyName:"",subPropertyName:"",bindFunction:null,statementRepaintFunction:null}}class nt{#t=new Map;#s={};subscribe(t,e,n,s,r,l,o){(s==="-s-if"||s==="-s-forEach")&&(e=s),this.#t.has(e)||this.#t.set(e,[]);const c=this.#t.get(e)??[];for(const a of c)if(a.element===n&&a.propertyName===s&&a.subPropertyName===r&&a.bindFunction===l&&a.statementRepaintFunction===o)return;c.push({element:n,propertyName:s,subPropertyName:r,bindFunction:l,statementRepaintFunction:o}),Object.assign(n,{"--subscribed":!0})}unsubscribe(t){this.#t.forEach((e,n)=>{this.#t.set(n,e.filter(s=>s.element!==t))})}createProxy(t,e=""){const n=this.#f(),s=new Proxy(t,n);for(const r in s){if(!(s[r]instanceof Object))continue;const l=e===""?r:`${e}.${r}`;s[r]=this.createProxy(s[r],l)}return this.#s=s,s}#n(t){const e=this.#t.get("-s-forEach");e&&e.forEach(n=>{const{statementRepaintFunction:s}=n;s instanceof Function&&s(t)})}#o(t,e){const n=this.#t.get("-s-forEach");n&&n.forEach(s=>{const{statementRepaintFunction:r}=s;r instanceof Function&&r(t)})}#e(t,e){this.#o(t,e)}#h(t,e){this.#t.has(e)&&(this.#t.get(e)??[]).forEach(s=>{const{element:r,propertyName:l,subPropertyName:o,bindFunction:c,statementRepaintFunction:a}=s;if(Object.hasOwn(r,"--deleted")){this.unsubscribe(r);return}let h=c.call(r,r);l==="style"&&o?r.style[o]=J(o,h):l==="--if"||l==="--for"?a instanceof Function&&a(h):(h instanceof Function&&(h=h()),F(r,l,h))})}#l(t,e){this.#o(t,e)}#f(){const t={};return t.get=(e,n,s)=>{if(Object.hasOwn(e,n)||n===L||n===k)m.element&&m.bindFunction&&this.subscribe(e,n,m.element,m.propertyName,m.subPropertyName,m.bindFunction,m.statementRepaintFunction);else if((e instanceof Map||e instanceof Set)&&e[n]instanceof Function){const r=e[n];return(...o)=>{const c=r.apply(e,o);return e instanceof Set?n==="add"?this.#e(s,n):n==="delete"&&this.#l(s,n):e instanceof Map&&(n==="set"?this.#e(s,n):n==="delete"&&this.#l(s,n)),c}}return e[n]},t.set=(e,n,s,r)=>(typeof n=="symbol"&&(n===k||n===L||n===j)?e[n]=s:e instanceof Array&&n==="length"?(e[n]=s,this.#n(r)):Object.hasOwn(e,n)?(e[n]=s,this.#h(r,n)):(e[n]=s,this.#e(r,n)),!0),t.deleteProperty=(e,n)=>(delete e[n],this.#l(e,n),!0),t}}let B=0;const st=function(t){if(!(t instanceof Object))throw new Error("createState() only accepts Object, Array, Set or Map as input value.");const n=new nt().createProxy(t);return B+=1,n[j]=B,n},W=function(i){return i instanceof Object&&j in i};function it(){return typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global||this}function Y(i,...t){const e=/(%?)(%([ojdsif]))/g;if(t.length>0){const n=(s,r,l,o)=>{let c=t.shift(),a="";switch(o){case"o":Array.isArray(c)&&(a=JSON.stringify(c));break;case"s":a=""+c;break;case"d":a=""+Number(c);break;case"j":a=JSON.stringify(c);break;case"i":a=""+parseInt(""+c,10);break;case"f":a=""+parseFloat(""+c);break}return r?(t.unshift(a),s):a};i=i.replace(e,n)}return t.length>0&&(i+=" "+t.join(" ")),i=i.replace(/%{2,2}/g,"%"),""+i}function T(){if(T.isIt===void 0){const i=new Function("try {return this===window;}catch(e){ return false;}");T.isIt=i()}return T.isIt??!1}T.isIt=void 0;function w(i,t){return t.push(i),t}function rt(i,t){for(const e of i)t.push(e);return t}function X(i){return i.toLowerCase().indexOf("on")===0}function b(i){return i===" "||i==="	"||i==="\r"||i===`
`}function ot(i){return/^[a-z][a-z0-9-]+$/.test(i)&&i.includes("-")}function lt(i){return/#[a-z0-9-]+\s*$/.test(i)}function ct(i){if(i==="true")return!0;if(i==="false")return!1;const t=parseInt(i);return isNaN(t)?!!i:!!t}function at(i,t,e){if(!(i instanceof window.Node)||typeof t!="string"||typeof e!="function"||X(t)===!1)return!1;const n=t.toLowerCase().substring(2);return i.addEventListener(n,e),!0}function ht(i,t){if(t.length===1)i.appendChild(t[0]);else if(t.length>1){const e=new DocumentFragment;for(const n of t)n&&e.append(n);i.appendChild(e)}}function ft(i,t){for(const e of t)e&&i.appendChild(e)}function G(i,t){i&&(T()&&i instanceof window.Node?ht(i,t):ft(i,t))}function V(i,t,e,n,s,r){if(!(t instanceof Object)&&!(t instanceof Array)&&!(t instanceof Map)&&!(t instanceof Set))throw new TypeError('"data" argument should be an Object or an Array');if(!(e instanceof Function))throw new TypeError('"handler" argument should be a Function');const l=i===2&&W(t);if(t instanceof Map||t instanceof Set){l&&t[L];for(const[o,c]of t.entries()){if(s!==void 0&&s!==o)continue;let a=l?()=>c:c;n&&(a=n?.(a));const h=e(a,o);if(r?.(o),h===!1)break}}else if(t instanceof Array){l&&t[k];for(let o=0;o<t.length;o++){if(s!==void 0&&s!==o)continue;let c=l?()=>t[o]:t[o];n&&(c=n?.(c));const a=e(c,o);if(r?.(o),a===!1)break}}else if(t instanceof Object){l&&t[L];for(const o in t){if(s!==void 0&&s!==o)continue;let c=l?()=>t[o]:t[o];n&&(c=n?.(c));const a=e(c,o);if(r?.(o),a===!1)break}}return!0}function ut(i,t,e){if(typeof i!="number"||typeof t!="number")return new Error('"start" and "end" arguments should be numbers');if(!(e instanceof Function))return new Error('"handler" argument should be a Function');if(t>=i)for(let n=i;n<=t&&e(n)!==!1;n++);else for(let n=i;n>=t&&e(n)!==!1;n--);return!0}function mt(i,t){return i.filter(function(e,n){return n!==t})}function dt(i,t){if(!t)return;const{nextSibling:e,parentNode:n}=t;n&&n.insertBefore(i,e)}function Et(i,t){if(t instanceof Object)for(const e in t){const n=t[e].toString();i.setAttribute(`data-${e}`,n)}}function F(i,t,e){t in i?e instanceof Array?i[t]=Y.apply(null,e):i[t]=e:"setAttribute"in i&&i.setAttribute(t,e)}function J(i,t){let e=t;return(i==="visibility"||i==="backfaceVisibility")&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"visible":"hidden"),i==="display"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?"":"none"),i==="flex"&&(t===!0||t===!1||t===void 0||t===null)&&(e=t?1:0),e}function pt(i,t){return i instanceof Map||i instanceof Set?i.has(t):t in i}const gt=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];class H{tagName="-";parent=this;children=[];attributes={};newChild(t,e){const n=new H;return n.parent=t,n.attributes=e,this.children.push(n),n}}const I=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]);class bt{#t="";#s="";#n="";#o={};#e;#h;#l=[];#f=this.#N;#m="";#c="";#g={};#a="";#E="";#p="";#T=new H;#r=this.#T;constructor(t,e){this.#l=this.#C(t,e),this.#O()}generate(t){if(this.#a||this.#E)throw new Error("Some HTML tag is not closed");return this.#u(t,this.#T)}#d(t,e){return typeof t=="function"?typeof e=="function"?e:t:typeof t=="string"&&(typeof e=="string"||typeof e=="number"||typeof e=="boolean")?t+e.toString():e}#u(t,e){const n=[];for(const s of e.children){let r=null;s.tagName==="if"?r=t.if(ct(s.attributes?.condition??""),()=>this.#u(t,s)):s.tagName==="for"?"iterations"in s.attributes?r=t.for(0,parseInt(s.attributes?.iterations??0)-1,(l,o)=>{this.#u(t,s)}):("from"in s.attributes||"to"in s.attributes)&&(r=t.for(parseInt(s.attributes?.from??0),parseInt(s.attributes?.to??0),(l,o)=>{this.#u(t,s)})):s.tagName==="forEach"?"object"in s.attributes&&(r=t.forEach(s.attributes?.object??{},(l,o)=>{this.#u(t,s)})):(r=t.createElement(s.tagName,s.attributes,this.#u(t,s)),n.push(r))}return n}#b(){const t=this.#r,e=this.#o;Object.keys(this.#g).length>0&&(e.style=this.#g);const n=this.#r.newChild(t,e);n.tagName=this.#a,this.#r=n}#C(t,e=[]){const n=[];for(let s=0;s<t.length;s++)t[s]&&n.push(t[s]),e[s]!==void 0&&n.push(e[s]);return n}#O(){for(let t=0;t<this.#l.length;t++)if(typeof this.#l[t]=="string")for(let e=0;e<this.#l[t].length;e++)this.#e=this.#l[t][e],this.#h=this.#l[t][e-1],this.#f();else this.#e=this.#l[t],this.#h=void 0,this.#f()}#S(t,e){t&&(this.#o[t]=typeof e=="string"?e.trim():e)}#i(t){t===this.#y&&(this.#t="",this.#n="",this.#s=""),this.#f=t}#w(t,e){t&&(this.#g[t]=typeof e=="string"?e.trim():e)}#y(){b(this.#e)||(this.#e==="/"?(I.includes(this.#a)&&this.#b(),this.#i(this.#M)):this.#e===">"?(this.#b(),this.#i(this.#N)):this.#e==="="?this.#i(this.#D):this.#t+=this.#e)}#D(){b(this.#e)||(this.#e==="'"||this.#e==='"'?(this.#s=this.#e,this.#i(this.#t==="style"?this.#A:this.#x)):(this.#s=" ",this.#n=this.#d(this.#n,this.#e),this.#i(this.#x)))}#x(){this.#e===">"&&this.#h!=="/"?(this.#s&&this.#t&&this.#n&&this.#S(this.#t,this.#n),this.#t="",this.#n="",this.#s="",this.#i(this.#N),this.#b()):this.#e===this.#s||this.#s===" "&&b(this.#e)?(this.#S(this.#t,this.#n),this.#i(this.#y)):this.#n+=this.#e}#N(){b(this.#e)||(this.#e==="<"?(this.#a="",this.#o={},this.#i(this.#F)):(this.#h===" "?this.#p=this.#h+this.#e:this.#p=this.#e,this.#a="",this.#o={},this.#b(),this.#i(this.#_)))}#A(){b(this.#e)||(this.#e===">"?this.#i(this.#N):this.#e===this.#s||this.#s===" "&&b(this.#e)?this.#i(this.#y):this.#e===":"?this.#i(this.#L):this.#m+=this.#e)}#L(){this.#e===">"?this.#i(this.#N):this.#e===";"?(this.#w(this.#m,this.#c),this.#m="",this.#c="",this.#i(this.#A)):this.#e===this.#s?(this.#w(this.#m,this.#c),this.#m="",this.#c="",this.#i(this.#y)):this.#c=this.#d(this.#c,this.#e)}#F(){if(b(this.#e))this.#a!==""&&this.#i(this.#y);else if(this.#e==="/"&&I.includes(this.#a))this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#i(this.#M);else if(this.#e===">"){if(!this.#a)throw new Error("Expected tag name, found >");this.#r.tagName||(this.#r=this.#r.parent),this.#b(),this.#i(this.#N)}else this.#h==="<"&&this.#e==="/"?(this.#a,this.#E="",this.#i(this.#M)):this.#a+=this.#e}#M(){if(!b(this.#e))if(this.#e===">"){if(this.#r.tagName&&this.#r.tagName!=="-"&&!I.includes(this.#r.tagName)&&this.#r.tagName!==this.#E)throw new Error(`Expected ${this.#r.tagName} tag to be closed, but ${this.#E} found`);this.#a="",this.#E="",this.#r.tagName?this.#r=this.#r.parent:this.#r=this.#r.parent.parent,this.#i(this.#N)}else this.#E+=this.#e}#_(){this.#e==="<"?(this.#o={},this.#r.attributes.textContent=this.#p,this.#i(this.#F)):(this.#p=this.#d(this.#p,this.#e),this.#r.tagName||(this.#r.attributes.textContent=this.#p))}}class Q{#t=[new v];#s;#n;#o;#e=!0;#h=[];#l=[];#f;constructor(t,e,n,s=[]){this.#f=t,this.#n=t.document,this.#e=this.#n.baseURI==="",this.#s=e,this.#h=n,this.#l=s,this.#o=this.#n.createElement("template")}appendChildrenToContainer(){const t=this.#s;t&&G(t,this.getCreatedElements())}createElement(t,...e){const n=t?this.#n.createElement(t):this.#n.createTextNode("");let s=[],r=0;for(const o of e)if(r+=1,typeof o=="string"){const c=this.#n.createTextNode(this.#i(o));s=w(c,s)}else if(typeof o=="number"){const c=this.#n.createTextNode(o.toString());s=w(c,s)}else if(o instanceof this.#f.Node)s=w(o,s);else if(o instanceof Array){if(o.length===0)continue;let c=!1;for(const a of o)if(a instanceof this.#f.Node){c=!0;break}if(c)s=rt(o,s);else{const a=this.#n.createTextNode(this.#g(o));s=w(a,s)}}else if(o instanceof Error)n.textContent=this.#i(o.message);else if(o instanceof p){const c=this.#e?o.getElementsSr():o.getElements();for(const a of c)for(const h of a)s=w(h,s)}else if(o instanceof Function)if(this.#e)n.innerHTML=`(${o.toString()})()`;else if(n instanceof HTMLScriptElement){const c=this.#n.createTextNode(`(${o.toString()})()`);n.appendChild(c)}else if("value"in n&&!(n instanceof HTMLLIElement))this.#u(n,{value:o});else{const c=this.#n.createTextNode("");this.#u(c,{textContent:o}),s=w(c,s)}else o instanceof Object&&!(o instanceof Function)&&r===1&&this.#u(n,o);G(n,s);const l=this.#t.length-1;return this.#t[l].removeTheseElements(s),this.#t[l].addElement(n),n}for(t,e,n){const s=()=>{const r=ut(t,e,n);r instanceof Error&&console.error(r)};return this.#C("for",null,s)}forEach(t,e){return this.#E(1,t,e)}forState(t,e){return this.#E(2,t,e)}getCreatedElements(){return this.#t[0].getElements()}getHtmlCode(t){let e="";if(this.#e){const n=this.#s;n&&(e=n.paintChildren(t))}return e}html(t,...e){const n=e.length===0&&this.#l.length===0?this.#p(t instanceof Array?t[0]:t):this.#T(t instanceof Array?t:[t],...e);for(const s of n)s.tagName===""&&(s.textContent=this.#i(s.textContent));return n}if(t,e,n){const s=r=>{r?typeof e=="function"&&e():typeof n=="function"&&n()};return t instanceof Function?this.#O("if",t,s):this.#C("if",t,s)}render(){this.#t=[new v];for(const t of this.#h)if(t instanceof Function){const e=t(this);if(e&&typeof e=="string")this.html(e);else if(e instanceof p){const n=this.#e?e.useTranslations(this.#l).getElementsSr():e.useTranslations(this.#l).getElements();for(const s of n)this.#t[0].addElements(s)}else if(e instanceof Function)e(this);else if(e instanceof Array){let n=!0,s=!0;for(const r of e){if(!(r instanceof p)){n=!1;break}if(!(r instanceof Function)){s=!1;break}}if(n)for(const r of e){if(!(r instanceof p))break;const l=this.#e?r.getElementsSr():r.getElements();for(const o of l)this.#t[0].addElements(o)}else if(s)for(const r of e){if(!(r instanceof Function))break;r(this)}}}else if(t instanceof p){const e=this.#e?t.useTranslations(this.#l).getElementsSr():t.useTranslations(this.#l).getElements();for(const n of e)this.#t[0].addElements(n)}this.appendChildrenToContainer()}#m({thisLevel:t,upperLevel:e}){const n=this.#t[t].getElements();return this.#t[e].importElements(this.#t[t]),this.#t[t].removeAllElements(),delete this.#t[t],this.#t.pop(),n}#c(t){return!!this.#l?t.map(n=>this.#i(n)):t}#g(t){return this.#i(Y.apply(null,this.#c(t)))}#a(){const t=this.#t.length,e=t-1;return this.#t.push(new v),{thisLevel:t,upperLevel:e}}#E(t,e,n){const s=l=>this.#i(l);if(W(e)){const l=(o,c,a)=>{const h=[];let f=c.getElements().length;return V(t,o,n,s,a,y=>{const S=c.getElements(),d=S.slice(f);h.push({key:y,elements:d}),f=S.length}),h};return this.#S("forEach",e,l)}const r=l=>{V(t,l,n,s)};return e instanceof Function?this.#O("forEach",e,r):this.#C("forEach",e,r)}#p(t){let e=[];if(this.#e){const s=this.#n.createElement("");s.innerHTML=t??"",e=[s]}else{const s=this.#o;s.innerHTML=t.trim()??"",e=Array.from(s.content.childNodes),s.innerHTML=""}const n=this.#t.length-1;return this.#t[n].addElements(e),e}#T(t,...e){return new bt(t,e).generate(this)}#r(t,e){if(!this.#s?.contains(t))return!1;let n=t;for(const s of e)dt(s,n),n=s;return!0}#d(t){if(t.nodeType!==8)return-1;const n=t.textContent;let s="";if(n)s=n.slice(0,-6)+"-end";else return-1;let r=t.nextSibling,l=0,o=0;for(;r!==null;){if(r.nodeType===8){const a=r.textContent;if(a===n)l+=1;else if(a===s&&(l-=1,l<0))break}const{nextSibling:c}=r;this.#y(r),r.remove(),o+=1,r=c}return o}#u(t,e){for(const n in e){let s=e[n];if(this.#e){if(X(n)&&s instanceof Function){F(t,n,s);continue}}else if(s instanceof Function&&at(t,n,s))continue;if(s instanceof Function){const r=s;x(t,n,"",r,null);let l=r(t);l instanceof Function&&(l=l()),A(),l instanceof Array?l=this.#g(l):typeof l=="string"&&(l=this.#i(l)),F(t,n,l)}else t instanceof this.#f.HTMLElement&&n==="style"&&s instanceof Object?this.#b(t,s):t instanceof this.#f.HTMLElement&&n==="data"?s instanceof Object&&Et(t,s):n==="textContent"?s instanceof Array?t[n]=this.#g(s):t[n]=this.#i(s):((n==="innerText"||n==="value"&&t.tagName==="INPUT"&&(t.getAttribute("type")??"").toLowerCase()==="button")&&(s=this.#i(s)),F(t,n,s))}}#b(t,e){for(const n in e){const s=e[n];let r="";if(s instanceof Function){const l="style",o=s;x(t,l,n,o,null),r=o(t),A()}else r=s;typeof n=="string"&&(t.style[n]=J(n,r))}}#C(t,e,n){const{thisLevel:s,upperLevel:r}=this.#a();return n(e),this.#m({thisLevel:s,upperLevel:r})}#O(t,e,n){const{thisLevel:s,upperLevel:r}=this.#a();if(e instanceof Function){const o=this.#n.createComment(`${t}-begin`),c=this.#n.createComment(`${t}-end`);this.#t[s].addElement(o);const a=y=>{this.#t[0].removeAllElements(),this.#d(o),n(y),this.#r(o,this.#t[0].getElements())||console.error("Element ",o," does not exist anymore")},h=o,f=`--${t}`;x(h,f,"",e,a);const E=e();A(),n(E),this.#t[s].addElement(c)}else n(e);return this.#m({thisLevel:s,upperLevel:r})}#S(t,e,n){const{thisLevel:s,upperLevel:r}=this.#a(),l=this.#n.createComment(`${t}-begin`),o=this.#n.createComment(`${t}-end`);this.#t[s].addElement(l);const c=f=>{if(!(f instanceof Object))return;for(let d=o.renderedElementsMap.length-1;d>=0;d--){const M=o.renderedElementsMap[d];pt(f,M.key)||(M.elements.forEach(N=>{N.remove()}),o.renderedElementsMap=mt(o.renderedElementsMap,d))}let E=l;const y=[],S=f instanceof Map||f instanceof Set||f instanceof Array?f.keys():Object.keys(f);for(let d of S){if(!(d in f))continue;let M=!1;for(const N of o.renderedElementsMap)if(N.key===d){const{elements:C}=N;E=C.length>0?C[C.length-1]:E,y.push(N),M=!0;break}if(!M){const N=n(f,this.#t[0],d);for(const C of N)y.push(C),C.elements.forEach(P=>{E.after(P),E=P})}}o.renderedElementsMap=y},a=`-s-${t}`;return x(o,a,"",()=>e,c),o.renderedElementsMap=n(e,this.#t[s]),A(),this.#t[s].addElement(o),this.#m({thisLevel:s,upperLevel:r})}#i(t){if(typeof t=="string"){const e=this.#w(t,this.#l);if(typeof e=="string")return e;const n=it(),s=this.#w(t,n?.paintorTranslations);if(typeof s=="string")return s}return t}#w(t,e){if(e instanceof Array&&e.length>0){for(const n of e)if(t in n)return n[t]}return!1}#y(t){Object.hasOwn(t,"--subscribed")&&Object.assign(t,{"--deleted":!0});let e=t.childNodes.length;for(;e--;)this.#y(t.childNodes[e])}}function yt(...i){const t=this;return function(...n){return t.call(this,...i,...n)}}const{prototype:$}=Q;Object.assign($.createElement,{bindArgs:yt});gt.forEach(i=>{$[i]=$.createElement.bindArgs(i)});const Nt=Object.freeze(["async","autofocus","autoplay","checked","contenteditable","controls","default","defer","disabled","formNoValidate","frameborder","hidden","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","readonly","required","reversed","scoped","selected","typemustmatch"]),Tt=Object.freeze(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","command","keygen","menuitem"]),u=Object.freeze({ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11});class D extends Error{constructor(t,e){super(t),this.name=e??"DOMException"}}class g{nextSibling=null;previousSibling=null;textContent="";#t=[];#s="";#n=1;#o=null;constructor(t,e){this.#n=t,this.#s=e}get baseURI(){return""}get childNodes(){return this.#t}get firstChild(){return this.#t[0]??null}get nodeName(){return this.#s}get nodeType(){return this.#n}get parentNode(){return this.#o}set parentNode(t){this.#o=t}appendChild(t){if(this.nodeType!==u.DOCUMENT_NODE&&this.nodeType!==u.DOCUMENT_FRAGMENT_NODE&&this.nodeType!==u.ELEMENT_NODE)throw new D("This node type does not support this method.");if(this.nodeType===u.DOCUMENT_NODE)throw new D("Failed to execute 'appendChild' on 'Node': Only one element on document allowed.");if(!(t instanceof g)){const n="Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";throw new TypeError(n)}if(this.#t.includes(t))return;if(t===this)throw new D("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");this.#t.push(t),t.parentNode=this;const e=this.#t.length-2;e>=0&&(this.#t[e].nextSibling=t,t.previousSibling=this.#t[e]??null)}contains(){return!1}insertBefore(t,e){const n=[];for(const s of this.#t)s===e&&n.push(t),n.push(s);return this.#t=n,t}removeChild(t){if(!t)throw new Error("Failed to execute 'removeChild' on 'HTMLElement': parameter 1 is not of type 'HTMLElement'.");if(!this.#t.includes(t))throw new Error("Failed to execute 'removeChild' on 'HTMLElement': The node to be removed is not a child of this node.");return this.#t=this.#t.filter(e=>e!==t),t}paintChildren({indent:t=""}){let e="",n=0;for(const s of this.childNodes){n+=1;const r=n>1;e+=tt(s,t,"",r)}return e}}class R extends g{constructor(){super(u.COMMENT_NODE,"#comment")}}class U extends g{constructor(){super(u.TEXT_NODE,"#text")}}function Z(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function Ct(i){let t="";for(const e of i){const{name:n}=e;let{value:s}=e;Nt.includes(n)?s!==!1&&s!==0&&s!==void 0&&s!==null&&(t+=` ${n}`):(s instanceof Array?s=s.join(","):s===!0?s="true":s===!1?s="false":s===void 0?s="undefined":s===null?s="null":s instanceof Function?s=`return(${s.toString()}).call(this,window.event)`:s=s.toString(),s=s.replace(/\"/g,'\\"'),s=Z(s),t+=` ${n}="${s}"`)}return t}function wt(i){let t="";return t=i.replace(/([A-Z])/g,(e,n)=>`-${n.toLowerCase()}`),t}function Ot(i){let t="";for(const e in i){const n=i[e];t+=`${wt(e)}:${n};`}return t.trim()}function tt(i,t,e,n=!1){let s="",r="",l="";if(t&&(r=e,l=`
`),i instanceof R)s+=`${l}${r}<!--${i.textContent}-->`;else if(i instanceof U)s+=`${l}${r}${i.textContent}`;else if(i instanceof O){const o=Tt.includes(i.tagName),c=Ct(i.attributes);let a="";Object.keys(i.style).length>0&&(a=` style="${Ot(i.style)}"`),n&&(s+=l),s+=r,i.tagName&&(s+=`<${i.tagName.toLowerCase()}${c}${a}`,s+=o?"":">"),s+=i.textContent;let h="";for(const f of i.childNodes)h+=tt(f,t,e+t,!0);h&&(s+=h+l+r),i.tagName!==""&&(s+=o?"/>":`</${i.tagName.toLowerCase()}>`)}return s}class _ extends g{#t=[];#s="";constructor(t,e){super(t,e.toUpperCase()),this.#s=e.toUpperCase()}get attributes(){return this.#t}get children(){return this.childNodes.filter(t=>t instanceof _)}get className(){let t="";for(const e of this.#t)if(e.name==="class"){t=e.value;break}return t}set className(t){this.setAttribute("class",t)}get innerHTML(){return this.textContent}set innerHTML(t){this.textContent=t}get tagName(){return this.#s}append(t){t instanceof g?this.appendChild(t):this.textContent=Z(t.toString())}getAttribute(t){let e="";if(e=t.trim().toLowerCase(),!e)return null;const n=this.#t.findIndex(s=>s.name===e);return n===-1?null:this.#t[n].value}remove(){this.parentNode?.removeChild(this)}setAttribute(t,e){let n="";if(n=t.trim().toLowerCase(),!n)return;const s=e,r=this.#t.findIndex(l=>l.name===n);r===-1?this.#t.push({name:n,value:s}):this.#t[r]={name:n,value:s}}}function St(i){let t=i;const e={"&":"&amp;","<":"&lt;",">":"&gt;"};return t=t.replace(/[&<>"]/g,n=>{let s=n;return n in e&&(s=e[n]),s}),t}function Mt(i){const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function xt(i){const t={};return i.split(";").forEach(e=>{const[n,s]=e.split(":");if(!n)return;const r=Mt(n.trim());t[r]=s.trim()}),t}let O=class extends _{#t={};constructor(t){super(u.ELEMENT_NODE,t)}get innerText(){return this.textContent}set innerText(t){this.textContent=St(t.toString())}get style(){return this.#t}set style(t){if(typeof t=="string"){const e=xt(t);for(const n in e)this.#t[n]=e[n].toString()}}},et=class extends g{constructor(){super(u.DOCUMENT_FRAGMENT_NODE,"#document-fragment")}};class At extends g{ELEMENT_NODE=u.ELEMENT_NODE;ATTRIBUTE_NODE=u.ATTRIBUTE_NODE;TEXT_NODE=u.TEXT_NODE;CDATA_SECTION_NODE=u.CDATA_SECTION_NODE;PROCESSING_INSTRUCTION_NODE=u.PROCESSING_INSTRUCTION_NODE;COMMENT_NODE=u.COMMENT_NODE;DOCUMENT_NODE=u.DOCUMENT_NODE;DOCUMENT_TYPE_NODE=u.DOCUMENT_TYPE_NODE;DOCUMENT_FRAGMENT_NODE=u.DOCUMENT_FRAGMENT_NODE;#t;#s=[];constructor(){super(9,"#document");const t=new O("html"),e=new O("head"),n=new O("body");t.appendChild(e),t.appendChild(n),this.#s.push(t),this.#t=n}get body(){return this.#t}get children(){return this.#s}get parentElement(){return null}createDocumentFragment(){return new et}createComment(t=""){const e=new R;return e.textContent=t,e}createElement(t){return new O(t)}createTextNode(t){const e=new U;return e.textContent=t,e}}class Ft{Comment=R;DocumentFragment=et;Element=_;HTMLElement=O;Node=g;Text=U;DOMException=D;Error=Error;TypeError=TypeError;document;constructor(){this.document=new At}}const q=T(),Dt=new Ft;class p{#t=!1;#s="";#n="";#o=[];#e=[];#h="";#l=!1;#f=[];#m=new Map;#c=[];appendTo(t){if(!q)throw new Error("You can only do this in browser environment");this.#d(t,window,!1)}compose(...t){if(t instanceof Array)for(const e of t)if(e instanceof Array)for(const n of e)this.#f.push(n);else this.#f.push(e);return this}getElements(){return this.#d(null,window,!0),this.#e}getHtml(t){if(this.#l)return this.getStaticHtml(t);const e=this.#a();return this.#d("",e,!0,t),this.#h}getStaticHtml(t){const e=this.#c[0]??null;if(!this.#m.has(e)){const n=this.#a();this.#d("",n,!0,t),this.#m.set(e,this.#h)}return this.#m.get(e)??""}getElementsSr(){const t=this.#a();return this.#d("",t,!0),this.#e}paint(t){if(!q)throw new Error("You can only use this function in browser environment");if(!t)throw new Error("No container selected.");if(typeof t!="string"&&!(t instanceof HTMLElement)&&!(t instanceof NodeList)&&!(t instanceof Array)&&!(t instanceof HTMLCollection))throw new Error(`Wrong type for the container element. Expected <string> or <Node>, got <${typeof t}>`);this.#d(t,window,!0)}static(t=!0){return this.#l=t,this}useTranslations(...t){return t.map(e=>{e instanceof Array?e.forEach(n=>{this.#c.includes(n)||(this.#c=[...this.#c,n])}):e instanceof Object&&(this.#c.includes(e)||(this.#c=[...this.#c,e]))}),this}#g(){if(this.#o)for(const t of this.#o)for(;t?.firstChild;)t.removeChild(t.firstChild)}#a(){return Dt}#E(t,e,n,s){return this.#e=[],this.#h="",this.#p(t,e),this.#r(n),this.#T(s),!0}#p(t,e){const n=e.document.baseURI==="";if(typeof t=="string"){if(this.#n=t,this.#t=!1,ot(t))this.#t=!0;else if(lt(t)||(this.#s=t),this.#o=n?[e.document.createElement("#container")]:e.document.querySelectorAll(t),!this.#o)throw new Error(`Could not find an element by the following query: ${t}`)}else if(t instanceof HTMLElement)this.#o=[t];else if(t instanceof NodeList||t instanceof HTMLCollection)this.#o=t;else if(t instanceof Array){for(const s of t)if(!(s instanceof HTMLElement))throw new Error("All elements in the input array must be DOM elements");this.#o=t}return!0}#T(t){for(let e of t)if(!(e instanceof Function)&&!(e instanceof p))throw new Error("The template must be a function");return!0}#r(t){if(!(t instanceof Array))throw new Error("The argument 'translations' must be an Array");return this.#c=t,!0}#d(t,e,n=!0,s={}){this.#E(t,e,this.#c,this.#f),n&&this.#g();const r=this.#f,l=this.#c;if(!e)throw new Error("Missing window element");if(this.#t){const o=c=>class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){if(!this.shadowRoot)throw new Error("Missing shadow root");c.#u(e,this.shadowRoot,r,l,s)}};customElements.define(this.#n,o(this))}else if(this.#s&&new MutationObserver(c=>{for(const a of c){const h=a.addedNodes;for(let f of h)if(f instanceof HTMLElement){f.matches(this.#s)&&this.#u(e,f,r,l,s);for(let E of f.querySelectorAll(this.#s))this.#u(e,E,r,l,s)}}}).observe(document.body,{attributes:!1,childList:!0,characterData:!1,subtree:!0}),this.#o.length===0)this.#u(e,null,r,l,s);else for(const o of this.#o)this.#u(e,o,r,l,s)}#u(t,e,n,s,r={}){const l=new Q(t,e,n,s);l.render(),this.#h=l.getHtmlCode(r),this.#e.push(l.getCreatedElements())}}const Lt="modulepreload",_t=function(i){return"/"+i},z={},K=function(t,e,n){if(!e||e.length===0)return t();const s=document.getElementsByTagName("link");return Promise.all(e.map(r=>{if(r=_t(r),r in z)return;z[r]=!0;const l=r.endsWith(".css"),o=l?'[rel="stylesheet"]':"";if(!!n)for(let h=s.length-1;h>=0;h--){const f=s[h];if(f.href===r&&(!l||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${o}`))return;const a=document.createElement("link");if(a.rel=l?"stylesheet":Lt,l||(a.as="script",a.crossOrigin=""),a.href=r,document.head.appendChild(a),l)return new Promise((h,f)=>{a.addEventListener("load",h),a.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${r}`)))})})).then(()=>t())},vt=function(){let i="en";return T()&&(i=document.getElementById("html")?.getAttribute("lang")??i),i},It=async function(i,t){if(typeof i!="string")throw new Error("Translation path must be a string");let e=null;const n=i.match(/^(.*?)([^.\/\\]+)(.\w+)$/m);if(n===null)throw new TypeError(`Incorrect path: ${i}`);const s=n[1]+t+n[3];try{e=(await K(()=>import(s),[])).default}catch{s!==i&&(e=(await K(()=>import(i),[])).default)}if(!(e instanceof Object))throw new TypeError(`Translation at ${s} must export an object`);return e},kt=async function(...i){const t=vt(),e=[];for(let n of i)e.push(It(n,t));return Promise.all(e)};function $t(...i){return new p().compose(...i)}function jt(i){return i}const Ut={compose:$t,createState:st,createTemplate:jt,fetchTranslations:kt,Component:p};export{p as Component,$t as compose,st as createState,jt as createTemplate,Ut as default,kt as fetchTranslations,Ut as paintor};
//# sourceMappingURL=paintor.js.map
