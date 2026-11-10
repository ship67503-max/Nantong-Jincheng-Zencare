import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const python='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const script=path.resolve('scripts/nomiss-download-adapter.py');
const dir=path.resolve('docs/structure-visuals/prompts');
const jobs=(await fs.readdir(dir)).filter(x=>x.endsWith('.txt'));
await fs.mkdir('output/structure-visuals',{recursive:true});
async function worker(){
  while(jobs.length){
    const file=jobs.shift(),id=path.basename(file,'.txt'),output=path.resolve('output/structure-visuals',id+'.png');
    try{await fs.access(output); console.log('Existing '+id);continue;}catch{}
    await new Promise(resolve=>{
      const child=spawn(python,[script,'--prompt-file',path.join(dir,file),'--output',output,'--size','1536x1024','--quality','high'],{windowsHide:true});
      let result='';child.stdout.on('data',d=>result+=d);child.stderr.on('data',d=>result+=d);
      child.on('close',code=>{console.log(JSON.stringify({id,code,result}));resolve();});
    });
  }
}
await Promise.all([worker(),worker(),worker()]);
