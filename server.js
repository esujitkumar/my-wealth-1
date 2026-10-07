import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/market/stock-ltp', async (req,res)=>{
  const token=process.env.INDSTOCKS_TOKEN;
  const instruments=String(req.query.instruments||'').split(',').filter(Boolean);
  if(!token) return res.status(503).json({error:'INDSTOCKS_TOKEN is not configured'});
  if(!instruments.length) return res.status(400).json({error:'No instruments'});
  try{
    const r=await fetch(`https://api.indstocks.com/market/quotes/ltp?scrip-codes=${encodeURIComponent(instruments.join(','))}`,{headers:{Authorization:token}});
    const body=await r.text();
    res.status(r.status).type('application/json').send(body);
  }catch(e){res.status(502).json({error:e.message});}
});


app.get('/api/market/mf-nav', async (req,res)=>{
  try{
    const r=await fetch('https://www.amfiindia.com/spages/NAVAll.txt',{headers:{'User-Agent':'My-Wealth-Personal-Finance-App/1.0'}});
    const body=await r.text();
    res.status(r.status).type('text/plain').send(body);
  }catch(e){res.status(502).json({error:e.message});}
});

app.get('/health',(req,res)=>res.json({ok:true,service:'my-wealth-market-proxy'}));

const port=process.env.PORT||8787;
const server=app.listen(port,()=>console.log(`Market proxy listening on ${port}`));
const wss=new WebSocketServer({noServer:true});
server.on('upgrade',(request,socket,head)=>{
  if(!request.url.startsWith('/ws/market')) return socket.destroy();
  wss.handleUpgrade(request,socket,head,ws=>wss.emit('connection',ws,request));
});
wss.on('connection',(client,request)=>{
  const token=process.env.INDSTOCKS_TOKEN;
  const url=new URL(request.url,'http://localhost');
  const instruments=String(url.searchParams.get('instruments')||'').split(',').filter(Boolean);
  if(!token||!instruments.length){client.send(JSON.stringify({error:'Market websocket is not configured'}));return client.close();}
  const upstream=new WebSocket('wss://ws-prices.indstocks.com/api/v1/ws/prices',{headers:{Authorization:token}});
  upstream.on('open',()=>upstream.send(JSON.stringify({action:'subscribe',mode:'ltp',instruments})));
  upstream.on('message',data=>{if(client.readyState===WebSocket.OPEN)client.send(data.toString())});
  upstream.on('error',()=>{if(client.readyState===WebSocket.OPEN)client.send(JSON.stringify({error:'Upstream market feed error'}));});
  const heartbeat=setInterval(()=>{if(upstream.readyState===WebSocket.OPEN)upstream.ping();},30000);
  client.on('close',()=>{clearInterval(heartbeat);if(upstream.readyState===WebSocket.OPEN)upstream.close();});
});
