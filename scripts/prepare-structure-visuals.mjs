import fs from 'node:fs/promises';
import sharp from 'sharp';
import {productVariants} from '../src/storefront/catalog.js';
import {structureFor} from '../src/storefront/variant-structures.js';
const output='public/images/products/structure-visuals';
await fs.mkdir(output,{recursive:true});
for(const file of await fs.readdir('output/structure-visuals')){
  if(!file.endsWith('.png'))continue;
  await sharp('output/structure-visuals/'+file).resize(1536,1024,{fit:'contain',background:'#fff'}).webp({quality:88}).toFile(output+'/'+file.replace('.png','.webp'));
}
const manifest=[];
for(const v of productVariants){
  const s=structureFor(v);
  await fs.access('public'+s.image);
  manifest.push({path:v.path,structureImage:s.image,title:s.title,components:s.items.map(([title])=>title),caption:s.caption});
}
await fs.writeFile('docs/structure-visuals/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Verified structure assets for '+manifest.length+' products.');
