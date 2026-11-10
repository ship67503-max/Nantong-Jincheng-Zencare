const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function collectionFormatNavigation(parent,selected=''){
 const count=parent.variants.length;if(!count)return '';
 const columns=Math.min(5,Math.ceil(count/Math.ceil(count/5)));
 return `<nav class="collection-format-nav" aria-label="Product types"><a class="text-link collection-all-link" href="${parent.path}#range" ${!selected?'aria-current="page"':''}>All ${escape(parent.name)} ↗</a><div class="collection-format-grid" style="--format-columns:${columns}">${parent.variants.map(v=>`<a class="text-link" href="${parent.path}/${v.slug}#range" ${v.slug===selected?'aria-current="page"':''}>${escape(v.name)}</a>`).join('')}</div></nav>`;
}
