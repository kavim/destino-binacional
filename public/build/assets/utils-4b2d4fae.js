function o(n,a={}){let t=window._translations[n]||n;return Object.keys(a).forEach(r=>{t=t.replace(`:${r}`,String(a[r]))}),t}export{o as t};
