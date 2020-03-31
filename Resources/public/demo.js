!function(e){function n(t){if(a[t])return a[t].exports;var r=a[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var a={};n.m=e,n.c=a,n.d=function(e,a,t){n.o(e,a)||Object.defineProperty(e,a,{enumerable:!0,get:t})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,a){if(1&a&&(e=n(e)),8&a)return e;if(4&a&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(n.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&a&&"string"!=typeof e)for(var r in e)n.d(t,r,function(n){return e[n]}.bind(null,r));return t},n.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(a,"a",a),a},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/bundles/imaticview/",n(n.s=354)}({354:function(e,n,a){a(69),e.exports=a(355)},355:function(e,n,a){a(356),a(357),a(358)},356:function(){},357:function(){},358:function(e,n,a){var t=a(359);t.registerLanguage("twig",a(360)),t.registerLanguage("php",a(361)),t.registerLanguage("javascript",a(362)),t.registerLanguage("json",a(363)),t.registerLanguage("typescript",a(364)),t.registerLanguage("yaml",a(365)),t.initHighlightingOnLoad()},359:function(e,n){var a;!function(t){var r="object"==typeof window&&window||"object"==typeof self&&self;n.nodeType?r&&(r.hljs=t({}),void 0===(a=function(){return r.hljs}.apply(n,[]))||(e.exports=a)):t(n)}((function(e){function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function a(e){return e.nodeName.toLowerCase()}function t(e){return v.test(e)}function r(e){var n,a={},t=Array.prototype.slice.call(arguments,1);for(n in e)a[n]=e[n];return t.forEach((function(e){for(n in e)a[n]=e[n]})),a}function i(e){var n=[];return function e(t,r){for(var i=t.firstChild;i;i=i.nextSibling)3===i.nodeType?r+=i.nodeValue.length:1===i.nodeType&&(n.push({event:"start",offset:r,node:i}),r=e(i,r),a(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:r,node:i}));return r}(e,0),n}function s(e,t,r){function i(){return e.length&&t.length?e[0].offset===t[0].offset?"start"===t[0].event?e:t:e[0].offset<t[0].offset?e:t:e.length?e:t}function s(e){d+="<"+a(e)+m.map.call(e.attributes,(function(e){return" "+e.nodeName+'="'+n(e.value).replace(/"/g,"&quot;")+'"'})).join("")+">"}function o(e){d+="</"+a(e)+">"}function l(e){("start"===e.event?s:o)(e.node)}for(var c,u=0,d="",g=[];e.length||t.length;)if(c=i(),d+=n(r.substring(u,c[0].offset)),u=c[0].offset,c===e){g.reverse().forEach(o);do{l(c.splice(0,1)[0]),c=i()}while(c===e&&c.length&&c[0].offset===u);g.reverse().forEach(s)}else"start"===c[0].event?g.push(c[0].node):g.pop(),l(c.splice(0,1)[0]);return d+n(r.substr(u))}function o(e){return e.variants&&!e.cached_variants&&(e.cached_variants=e.variants.map((function(n){return r(e,{variants:null},n)}))),e.cached_variants?e.cached_variants:function e(n){return!!n&&(n.endsWithParent||e(n.starts))}(e)?[r(e,{starts:e.starts?r(e.starts):null})]:Object.isFrozen(e)?[r(e)]:[e]}function l(e,n){return n?+n:function(e){return-1!=w.indexOf(e.toLowerCase())}(e)?0:1}function c(e){function n(e){return e&&e.source||e}function a(a,t){return new RegExp(n(a),"m"+(e.case_insensitive?"i":"")+(t?"g":""))}function t(e,a){for(var t=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,r=0,i="",s=0;s<e.length;s++){var o=r+=1,l=n(e[s]);for(0<s&&(i+=a),i+="(";0<l.length;){var c=t.exec(l);if(null==c){i+=l;break}i+=l.substring(0,c.index),l=l.substring(c.index+c[0].length),"\\"==c[0][0]&&c[1]?i+="\\"+(+c[1]+o):(i+=c[0],"("==c[0]&&r++)}i+=")"}return i}function r(e){function n(e,n){s[c]=e,o.push([e,n]),c+=function(e){return new RegExp(e.toString()+"|").exec("").length-1}(n)+1}for(var r,i,s={},o=[],l={},c=1,u=0;u<e.contains.length;u++){n(i=e.contains[u],i.beginKeywords?"\\.?(?:"+i.begin+")\\.?":i.begin)}e.terminator_end&&n("end",e.terminator_end),e.illegal&&n("illegal",e.illegal);var d=o.map((function(e){return e[1]}));return r=a(t(d,"|"),!0),l.lastIndex=0,l.exec=function(n){var a;if(0===o.length)return null;r.lastIndex=l.lastIndex;var t=r.exec(n);if(!t)return null;for(var i=0;i<t.length;i++)if(null!=t[i]&&null!=s[""+i]){a=s[""+i];break}return"string"==typeof a?(t.type=a,t.extra=[e.illegal,e.terminator_end]):(t.type="begin",t.rule=a),t},l}if(e.contains&&-1!=e.contains.indexOf("self")){if(!M)throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");e.contains=e.contains.filter((function(e){return"self"!=e}))}!function t(i,s){i.compiled||(i.compiled=!0,i.keywords=i.keywords||i.beginKeywords,i.keywords&&(i.keywords=function(e,n){function a(e,a){n&&(a=a.toLowerCase()),a.split(" ").forEach((function(n){var a=n.split("|");t[a[0]]=[e,l(a[0],a[1])]}))}var t={};return"string"==typeof e?a("keyword",e):p(e).forEach((function(n){a(n,e[n])})),t}(i.keywords,e.case_insensitive)),i.lexemesRe=a(i.lexemes||/\w+/,!0),s&&(i.beginKeywords&&(i.begin="\\b("+i.beginKeywords.split(" ").join("|")+")\\b"),!i.begin&&(i.begin=/\B|\b/),i.beginRe=a(i.begin),i.endSameAsBegin&&(i.end=i.begin),!i.end&&!i.endsWithParent&&(i.end=/\B|\b/),i.end&&(i.endRe=a(i.end)),i.terminator_end=n(i.end)||"",i.endsWithParent&&s.terminator_end&&(i.terminator_end+=(i.end?"|":"")+s.terminator_end)),i.illegal&&(i.illegalRe=a(i.illegal)),null==i.relevance&&(i.relevance=1),!i.contains&&(i.contains=[]),i.contains=Array.prototype.concat.apply([],i.contains.map((function(e){return o("self"===e?i:e)}))),i.contains.forEach((function(e){t(e,i)})),i.starts&&t(i.starts,s),i.terminators=r(i))}(e)}function u(e,a,t,r){function i(e,n){if(function(e,n){var a=e&&e.exec(n);return a&&0===a.index}(e.endRe,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.endsWithParent?i(e.parent,n):void 0}function s(e,n){var a=O.case_insensitive?n[0].toLowerCase():n[0];return e.keywords.hasOwnProperty(a)&&e.keywords[a]}function o(e,n,a,t){if(!a&&""===n)return"";if(!e)return n;var r='<span class="'+(t?"":S.classPrefix);return(r+=e+'">')+n+(a?"":y)}function l(){w+=null==R.subLanguage?function(){var e,a,t,r;if(!R.keywords)return n(A);for(r="",a=0,R.lexemesRe.lastIndex=0,t=R.lexemesRe.exec(A);t;)r+=n(A.substring(a,t.index)),(e=s(R,t))?(D+=e[1],r+=o(e[0],n(t[0]))):r+=n(t[0]),a=R.lexemesRe.lastIndex,t=R.lexemesRe.exec(A);return r+n(A.substr(a))}():function(){var e="string"==typeof R.subLanguage;if(e&&!N[R.subLanguage])return n(A);var a=e?u(R.subLanguage,A,!0,h[R.subLanguage]):d(A,R.subLanguage.length?R.subLanguage:void 0);return 0<R.relevance&&(D+=a.relevance),e&&(h[R.subLanguage]=a.top),o(a.language,a.value,!1,!0)}(),A=""}function g(e){w+=e.className?o(e.className,"",!0):"",R=Object.create(e,{parent:{value:R}})}function E(e){var n=e[0],a=e.rule;return a&&a.endSameAsBegin&&(a.endRe=function(e){return new RegExp(e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")}(n)),a.skip?A+=n:(a.excludeBegin&&(A+=n),l(),!a.returnBegin&&!a.excludeBegin&&(A=n)),g(a),a.returnBegin?0:n.length}function f(e){var n=e[0],a=m.substr(e.index),t=i(R,a);if(t){var r=R;r.skip?A+=n:(!(r.returnEnd||r.excludeEnd)&&(A+=n),l(),r.excludeEnd&&(A=n));do{R.className&&(w+=y),R.skip||R.subLanguage||(D+=R.relevance),R=R.parent}while(R!==t.parent);return t.starts&&(t.endSameAsBegin&&(t.starts.endRe=t.endRe),g(t.starts)),r.returnEnd?0:n.length}}function b(e,n){var a=n&&n[0];if(A+=e,null==a)return l(),0;if("begin"==p.type&&"end"==n.type&&p.index==n.index&&""===a)return A+=m.slice(n.index,n.index+1),1;if(p=n,"begin"===n.type)return E(n);if("illegal"===n.type&&!t)throw new Error('Illegal lexeme "'+a+'" for mode "'+(R.className||"<unnamed>")+'"');if("end"===n.type){var r=f(n);if(null!=r)return r}return A+=a,a.length}var m=a,p={},O=_(e);if(!O)throw console.error(C.replace("{}",e)),new Error('Unknown language: "'+e+'"');c(O);var v,R=r||O,h={},w="";for(v=R;v!==O;v=v.parent)v.className&&(w=o(v.className,"",!0)+w);var A="",D=0;try{for(var T,x,I=0;R.terminators.lastIndex=I,T=R.terminators.exec(m);)x=b(m.substring(I,T.index),T),I=T.index+x;for(b(m.substr(I)),v=R;v.parent;v=v.parent)v.className&&(w+=y);return{relevance:D,value:w,illegal:!1,language:e,top:R}}catch(a){if(a.message&&-1!==a.message.indexOf("Illegal"))return{illegal:!0,relevance:0,value:n(m)};if(M)return{relevance:0,value:n(m),language:e,top:R,errorRaised:a};throw a}}function d(e,a){a=a||S.languages||p(N);var t={relevance:0,value:n(e)},r=t;return a.filter(_).filter(b).forEach((function(n){var a=u(n,e,!1);a.language=n,a.relevance>r.relevance&&(r=a),a.relevance>t.relevance&&(r=t,t=a)})),r.language&&(t.second_best=r),t}function g(e){return S.tabReplace||S.useBR?e.replace(h,(function(e,n){return S.useBR&&"\n"===e?"<br>":S.tabReplace?n.replace(/\t/g,S.tabReplace):""})):e}function E(e){var n,a,r,o,l,c=function(e){var n,a,r,i,s=e.className+" ";if(s+=e.parentNode?e.parentNode.className:"",a=R.exec(s)){var o=_(a[1]);return o||(console.warn(C.replace("{}",a[1])),console.warn("Falling back to no-highlight mode for this block.",e)),o?a[1]:"no-highlight"}for(n=0,r=(s=s.split(/\s+/)).length;n<r;n++)if(t(i=s[n])||_(i))return i}(e);t(c)||(S.useBR?(n=document.createElement("div")).innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n"):n=e,l=n.textContent,r=c?u(c,l,!0):d(l),(a=i(n)).length&&((o=document.createElement("div")).innerHTML=r.value,r.value=s(a,i(o),l)),r.value=g(r.value),e.innerHTML=r.value,e.className=function(e,n,a){var t=n?O[n]:a,r=[e.trim()];return e.match(/\bhljs\b/)||r.push("hljs"),-1===e.indexOf(t)&&r.push(t),r.join(" ").trim()}(e.className,c,r.language),e.result={language:r.language,re:r.relevance},r.second_best&&(e.second_best={language:r.second_best.language,re:r.second_best.relevance}))}function f(){if(!f.called){f.called=!0;var e=document.querySelectorAll("pre code");m.forEach.call(e,E)}}function _(e){return e=(e||"").toLowerCase(),N[e]||N[O[e]]}function b(e){var n=_(e);return n&&!n.disableAutodetect}var m=[],p=Object.keys,N={},O={},M=!0,v=/^(no-?highlight|plain|text)$/i,R=/\blang(?:uage)?-([\w-]+)\b/i,h=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,y="</span>",C="Could not find the language '{}', did you forget to load/include a language module?",S={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},w="of and for in not or if then".split(" "),A={disableAutodetect:!0};return e.highlight=u,e.highlightAuto=d,e.fixMarkup=g,e.highlightBlock=E,e.configure=function(e){S=r(S,e)},e.initHighlighting=f,e.initHighlightingOnLoad=function(){window.addEventListener("DOMContentLoaded",f,!1),window.addEventListener("load",f,!1)},e.registerLanguage=function(n,a){var t;try{t=a(e)}catch(e){if(console.error("Language definition for '{}' could not be registered.".replace("{}",n)),!M)throw e;console.error(e),t=A}N[n]=t,t.rawDefinition=a.bind(null,e),t.aliases&&t.aliases.forEach((function(e){O[e]=n}))},e.listLanguages=function(){return p(N)},e.getLanguage=_,e.requireLanguage=function(e){var n=_(e);if(n)return n;throw new Error("The '{}' language is required, but not loaded.".replace("{}",e))},e.autoDetection=b,e.inherit=r,e.debugMode=function(){M=!1},e.IDENT_RE="[a-zA-Z]\\w*",e.UNDERSCORE_IDENT_RE="[a-zA-Z_]\\w*",e.NUMBER_RE="\\b\\d+(\\.\\d+)?",e.C_NUMBER_RE="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BINARY_NUMBER_RE="\\b(0b[01]+)",e.RE_STARTERS_RE="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BACKSLASH_ESCAPE={begin:"\\\\[\\s\\S]",relevance:0},e.APOS_STRING_MODE={className:"string",begin:"'",end:"'",illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},e.QUOTE_STRING_MODE={className:"string",begin:'"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},e.PHRASAL_WORDS_MODE={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},e.COMMENT=function(n,a,t){var r=e.inherit({className:"comment",begin:n,end:a,contains:[]},t||{});return r.contains.push(e.PHRASAL_WORDS_MODE),r.contains.push({className:"doctag",begin:"(?:TODO|FIXME|NOTE|BUG|XXX):",relevance:0}),r},e.C_LINE_COMMENT_MODE=e.COMMENT("//","$"),e.C_BLOCK_COMMENT_MODE=e.COMMENT("/\\*","\\*/"),e.HASH_COMMENT_MODE=e.COMMENT("#","$"),e.NUMBER_MODE={className:"number",begin:e.NUMBER_RE,relevance:0},e.C_NUMBER_MODE={className:"number",begin:e.C_NUMBER_RE,relevance:0},e.BINARY_NUMBER_MODE={className:"number",begin:e.BINARY_NUMBER_RE,relevance:0},e.CSS_NUMBER_MODE={className:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},e.REGEXP_MODE={className:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[e.BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[e.BACKSLASH_ESCAPE]}]},e.TITLE_MODE={className:"title",begin:e.IDENT_RE,relevance:0},e.UNDERSCORE_TITLE_MODE={className:"title",begin:e.UNDERSCORE_IDENT_RE,relevance:0},e.METHOD_GUARD={begin:"\\.\\s*"+e.UNDERSCORE_IDENT_RE,relevance:0},[e.BACKSLASH_ESCAPE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.PHRASAL_WORDS_MODE,e.COMMENT,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.HASH_COMMENT_MODE,e.NUMBER_MODE,e.C_NUMBER_MODE,e.BINARY_NUMBER_MODE,e.CSS_NUMBER_MODE,e.REGEXP_MODE,e.TITLE_MODE,e.UNDERSCORE_TITLE_MODE,e.METHOD_GUARD].forEach((function(e){!function e(n){return Object.freeze(n),Object.getOwnPropertyNames(n).forEach((function(a){!n.hasOwnProperty(a)||null===n[a]||"object"!=typeof n[a]&&"function"!=typeof n[a]||"function"==typeof n&&("caller"===a||"callee"===a||"arguments"===a)||Object.isFrozen(n[a])||e(n[a])})),n}(e)})),e}))},360:function(e){e.exports=function(e){var n="attribute block constant cycle date dump include max min parent random range source template_from_string",a={beginKeywords:n,keywords:{name:n},relevance:0,contains:[{className:"params",begin:"\\(",end:"\\)"}]},t={begin:/\|[A-Za-z_]+:?/,keywords:"abs batch capitalize column convert_encoding date date_modify default escape filter first format inky_to_html inline_css join json_encode keys last length lower map markdown merge nl2br number_format raw reduce replace reverse round slice sort spaceless split striptags title trim upper url_encode",contains:[a]},r="apply autoescape block deprecated do embed extends filter flush for from if import include macro sandbox set use verbatim with";return r=r+" "+r.split(" ").map((function(e){return"end"+e})).join(" "),{aliases:["craftcms"],case_insensitive:!0,subLanguage:"xml",contains:[e.COMMENT(/\{#/,/#}/),{className:"template-tag",begin:/\{%/,end:/%}/,contains:[{className:"name",begin:/\w+/,keywords:r,starts:{endsWithParent:!0,contains:[t,a],relevance:0}}]},{className:"template-variable",begin:/\{\{/,end:/}}/,contains:["self",t,a]}]}}},361:function(e){e.exports=function(e){var n={begin:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},a={className:"meta",begin:/<\?(php)?|\?>/},t={className:"string",contains:[e.BACKSLASH_ESCAPE,a],variants:[{begin:'b"',end:'"'},{begin:"b'",end:"'"},e.inherit(e.APOS_STRING_MODE,{illegal:null}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null})]},r={variants:[e.BINARY_NUMBER_MODE,e.C_NUMBER_MODE]};return{aliases:["php","php3","php4","php5","php6","php7"],case_insensitive:!0,keywords:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",contains:[e.HASH_COMMENT_MODE,e.COMMENT("//","$",{contains:[a]}),e.COMMENT("/\\*","\\*/",{contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),e.COMMENT("__halt_compiler.+?;",!1,{endsWithParent:!0,keywords:"__halt_compiler",lexemes:e.UNDERSCORE_IDENT_RE}),{className:"string",begin:/<<<['"]?\w+['"]?$/,end:/^\w+;?$/,contains:[e.BACKSLASH_ESCAPE,{className:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]}]},a,{className:"keyword",begin:/\$this\b/},n,{begin:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{className:"function",beginKeywords:"function",end:/[;{]/,excludeEnd:!0,illegal:"\\$|\\[|%",contains:[e.UNDERSCORE_TITLE_MODE,{className:"params",begin:"\\(",end:"\\)",contains:["self",n,e.C_BLOCK_COMMENT_MODE,t,r]}]},{className:"class",beginKeywords:"class interface",end:"{",excludeEnd:!0,illegal:/[:\(\$"]/,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",end:";",illegal:/[\.']/,contains:[e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"use",end:";",contains:[e.UNDERSCORE_TITLE_MODE]},{begin:"=>"},t,r]}}},362:function(e){e.exports=function(e){var n="<>",a="</>",t={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/},r="[A-Za-z$_][0-9A-Za-z$_]*",i={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},s={className:"number",variants:[{begin:"\\b(0[bB][01]+)n?"},{begin:"\\b(0[oO][0-7]+)n?"},{begin:e.C_NUMBER_RE+"n?"}],relevance:0},o={className:"subst",begin:"\\$\\{",end:"\\}",keywords:i,contains:[]},l={begin:"html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"xml"}},c={begin:"css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"css"}},u={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,o]};o.contains=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,u,s,e.REGEXP_MODE];var d=o.contains.concat([e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]);return{aliases:["js","jsx","mjs","cjs"],keywords:i,contains:[{className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},{className:"meta",begin:/^#!/,end:/$/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,u,e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+",contains:[{className:"type",begin:"\\{",end:"\\}",relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,s,{begin:/[{,\n]\s*/,relevance:0,contains:[{begin:r+"\\s*:",returnBegin:!0,relevance:0,contains:[{className:"attr",begin:r,relevance:0}]}]},{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.REGEXP_MODE,{className:"function",begin:"(\\(.*?\\)|"+r+")\\s*=>",returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:r},{begin:/\(\s*\)/},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:d}]}]},{className:"",begin:/\s/,end:/\s*/,skip:!0},{variants:[{begin:n,end:a},{begin:t.begin,end:t.end}],subLanguage:"xml",contains:[{begin:t.begin,end:t.end,skip:!0,contains:["self"]}]}],relevance:0},{className:"function",beginKeywords:"function",end:/\{/,excludeEnd:!0,contains:[e.inherit(e.TITLE_MODE,{begin:r}),{className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,contains:d}],illegal:/\[|%/},{begin:/\$[(.]/},e.METHOD_GUARD,{className:"class",beginKeywords:"class",end:/[{;=]/,excludeEnd:!0,illegal:/[:"\[\]]/,contains:[{beginKeywords:"extends"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"constructor get set",end:/\{/,excludeEnd:!0}],illegal:/#(?!!)/}}},363:function(e){e.exports=function(e){var n={literal:"true false null"},a=[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],t=[e.QUOTE_STRING_MODE,e.C_NUMBER_MODE],r={end:",",endsWithParent:!0,excludeEnd:!0,contains:t,keywords:n},i={begin:"{",end:"}",contains:[{className:"attr",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE],illegal:"\\n"},e.inherit(r,{begin:/:/})].concat(a),illegal:"\\S"},s={begin:"\\[",end:"\\]",contains:[e.inherit(r)],illegal:"\\S"};return t.push(i,s),a.forEach((function(e){t.push(e)})),{contains:t,keywords:n,illegal:"\\S"}}},364:function(e){e.exports=function(e){var n="[A-Za-z$_][0-9A-Za-z$_]*",a={keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class public private protected get set super static implements enum export import declare type namespace abstract as from extends async await",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document any number boolean string void Promise"},t={className:"meta",begin:"@"+n},r={begin:"\\(",end:/\)/,keywords:a,contains:["self",e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,e.NUMBER_MODE]},i={className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,t,r]},s={className:"number",variants:[{begin:"\\b(0[bB][01]+)n?"},{begin:"\\b(0[oO][0-7]+)n?"},{begin:e.C_NUMBER_RE+"n?"}],relevance:0},o={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},l={begin:"html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"xml"}},c={begin:"css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"css"}},u={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,o]};return o.contains=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,u,s,e.REGEXP_MODE],{aliases:["ts"],keywords:a,contains:[{className:"meta",begin:/^\s*['"]use strict['"]/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,u,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,s,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.REGEXP_MODE,{className:"function",begin:"(\\(.*?\\)|"+e.IDENT_RE+")\\s*=>",returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.IDENT_RE},{begin:/\(\s*\)/},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:["self",e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]}]}]}],relevance:0},{className:"function",beginKeywords:"function",end:/[\{;]/,excludeEnd:!0,keywords:a,contains:["self",e.inherit(e.TITLE_MODE,{begin:n}),i],illegal:/%/,relevance:0},{beginKeywords:"constructor",end:/[\{;]/,excludeEnd:!0,contains:["self",i]},{begin:/module\./,keywords:{built_in:"module"},relevance:0},{beginKeywords:"module",end:/\{/,excludeEnd:!0},{beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:"interface extends"},{begin:/\$[(.]/},{begin:"\\."+e.IDENT_RE,relevance:0},t,r]}}},365:function(e){e.exports=function(e){var n="true false yes no null",a={className:"string",relevance:0,variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,{className:"template-variable",variants:[{begin:"{{",end:"}}"},{begin:"%{",end:"}"}]}]};return{case_insensitive:!0,aliases:["yml","YAML","yaml"],contains:[{className:"attr",variants:[{begin:"\\w[\\w :\\/.-]*:(?=[ \t]|$)"},{begin:'"\\w[\\w :\\/.-]*":(?=[ \t]|$)'},{begin:"'\\w[\\w :\\/.-]*':(?=[ \t]|$)"}]},{className:"meta",begin:"^---s*$",relevance:10},{className:"string",begin:"[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!"+e.UNDERSCORE_IDENT_RE},{className:"type",begin:"!!"+e.UNDERSCORE_IDENT_RE},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"\\-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},{className:"number",begin:e.C_NUMBER_RE+"\\b"},a]}}},69:function(){}});
//# sourceMappingURL=demo.js.map