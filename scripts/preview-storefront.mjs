// Local-only static review server. Resolve clean URLs before any SPA fallback.
import http from 'node:http';
import fs from 'node:fs';
import {stat} from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.REVIEW_PORT || 5190);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.pdf':'application/pdf'};
const server = http.createServer(async (req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {
    res.writeHead(405, {'Content-Type':'application/json'}).end(JSON.stringify({message:'Local design review only. No inquiry was sent.'}));
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    let info = await stat(target);
    if (info.isDirectory()) { target = path.join(target,'index.html'); info = await stat(target); }
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    const headers = {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    let start=0,end=info.size-1,status=200;
    if (range) {
      start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;
      if (start>end) { res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return; }
      headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;status=206;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if (req.method==='HEAD') {res.end();return;}
    const stream=fs.createReadStream(target,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);
  } catch { res.writeHead(404,{'Content-Type':'text/plain'}).end('Page not found in the local build.'); }
});
server.listen(port,'127.0.0.1',()=>console.log(`Local brand review: http://127.0.0.1:${port}/`));
