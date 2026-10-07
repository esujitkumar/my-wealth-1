const AMFI_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

export async function fetchAmfiNavs(url=AMFI_URL) {
  const res = await fetch(url, { headers: { Accept: 'text/plain' } });
  if (!res.ok) throw new Error(`AMFI returned ${res.status}`);
  const text = await res.text();
  const rows = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const navs = new Map();
  for (const row of rows) {
    const parts = row.split(';');
    if (parts.length < 6 || !parts[0] || !parts[1]) continue;
    const schemeCode = parts[0].trim();
    const isin = parts[1].trim();
    const name = parts[3]?.trim() || '';
    const nav = Number(parts[4]);
    const date = parts[5]?.trim() || '';
    if (Number.isFinite(nav)) navs.set(isin || schemeCode, { schemeCode, isin, name, nav, date });
  }
  return navs;
}

export async function fetchStockLtp({ baseUrl, token, instruments, proxyUrl }) {
  if (!baseUrl || !token || !instruments?.length) throw new Error('Stock provider is not configured.');
  if (proxyUrl) {
    const res = await fetch(`${proxyUrl.replace(/\/$/,'')}/api/market/stock-ltp?instruments=${encodeURIComponent(instruments.join(','))}`);
    if (!res.ok) throw new Error(`Market proxy returned ${res.status}`);
    const json=await res.json(); return json.data || {};
  }
  const restCodes = instruments.map(x => String(x).replace(':','_'));
  const res = await fetch(`${baseUrl.replace(/\/$/,'')}/market/quotes/ltp?scrip-codes=${encodeURIComponent(restCodes.join(','))}`, {
    headers: { Authorization: token }
  });
  if (!res.ok) throw new Error(`Stock provider returned ${res.status}`);
  const json = await res.json();
  return json.data || {};
}

export function calcHolding(asset, livePrice) {
  const units = Number(asset.units || 0);
  const price = Number(livePrice || asset.price || 0);
  const value = units > 0 && price > 0 ? units * price : Number(asset.value || 0);
  const invested = Number(asset.invested || 0);
  const pnl = value - invested;
  return { ...asset, price, value, pnl, returnPct: invested ? pnl / invested * 100 : 0, updatedAt: new Date().toISOString() };
}


export function connectStockStream({ proxyUrl, instruments, onTick, onStatus }) {
  if (!proxyUrl || !instruments?.length) return null;
  const base = proxyUrl.replace(/^http/,'ws').replace(/\/$/,'');
  const ws = new WebSocket(`${base}/ws/market?instruments=${encodeURIComponent(instruments.join(','))}`);
  ws.onopen=()=>onStatus?.({connected:true});
  ws.onmessage=e=>{try{const msg=JSON.parse(e.data);if(msg.error)onStatus?.({connected:false,message:msg.error});else onTick?.(msg);}catch{}};
  ws.onerror=()=>onStatus?.({connected:false,message:'Live stream connection error'});
  ws.onclose=()=>onStatus?.({connected:false,message:'Live stream disconnected'});
  return ws;
}


export function normalizeStockQuoteMap(data={}) {
  const out={};
  for (const [key,q] of Object.entries(data||{})) {
    const live=Number(q?.live_price ?? q?.ltp ?? q?.data?.ltp);
    if(Number.isFinite(live)) out[key.replace('_',':')]=live;
  }
  return out;
}
