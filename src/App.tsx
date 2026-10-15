import {useEffect,useMemo,useState} from 'react';
import cfg from './config/lists.json';
import type {CustomerRequirement as R,ReferenceImage as Img} from './types';
import {sampleRepository as repo} from './services/requirementsRepository';
import {downloadCsv} from './services/exportService';
import {emptyFilters,filterReqs,sortReqs,detectConflicts,effectiveStatus,Filters,SortKey} from './utils/search';
import {fmtDate} from './utils/dateFormatting';
const DEMO='DEMO DATA — NOT VALIDATED FOR ACTUAL SHIPMENTS';
const useHash=()=>{const [h,s]=useState(location.hash||'#/');useEffect(()=>{const f=()=>s(location.hash||'#/');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return h;};
const Badge=({s}:{s:string})=><span className={'b '+(s==='Conflict Detected'?'warn':s==='Validated'?'':'amb')}>{s}</span>;
const Val=({v}:{v?:string})=>v?<>{v}</>:<span className="na">Not provided</span>;
function Chips({opts,sel,on}:{opts:string[];sel:string[];on:(v:string[])=>void}){
 return <div>{opts.map(o=><span key={o} role="button" className={'chip'+(sel.includes(o)?' on':'')} onClick={()=>on(sel.includes(o)?sel.filter(x=>x!==o):[...sel,o])}>{o}</span>)}</div>;}
function Lightbox({img,onClose}:{img:Img;onClose:()=>void}){
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose]);
 return <div className="lb" onClick={onClose}><div onClick={e=>e.stopPropagation()}><img src={img.imagePath} alt={img.title}/><h3>{img.title}</h3><p>{img.description}</p>
 <p><span className="b amb">{img.isIllustrative?'ILLUSTRATIVE EXAMPLE — NOT AN APPROVED CUSTOMER STANDARD':img.approvalStatus}</span> · Source: {img.imageSource} · Last reviewed: {fmtDate(img.lastReviewedDate,'Not reviewed')}</p><button onClick={onClose}>Close</button></div></div>;}
function Gallery({imgs,r}:{imgs:Img[];r:R}){
 const [open,setOpen]=useState<Img|null>(null);
 if(!imgs.length)return <p className="na">No approved reference image available for this requirement.</p>;
 return <><div className="gal">{imgs.map(i=><figure key={i.id}><img src={i.imagePath} alt={i.title} loading="lazy" onClick={()=>setOpen(i)} onError={e=>{(e.target as HTMLImageElement).alt='Image unavailable'}}/>
 <figcaption><b>{i.title}</b><br/>{i.description}<br/><small>Applies to: {r.customerName} · {r.partNumber}<br/>Source: {i.imageSource} · Reviewed: {fmtDate(i.lastReviewedDate,'Not reviewed')}</small><br/>
 <span className="b amb">{i.isIllustrative?'ILLUSTRATIVE EXAMPLE — NOT AN APPROVED CUSTOMER STANDARD':i.approvalStatus}</span></figcaption></figure>)}</div>{open&&<Lightbox img={open} onClose={()=>setOpen(null)}/>}</>;}
function Section({t,rows}:{t:string;rows:[string,string|undefined][]}){return <section className="card sec"><h3>{t}</h3><dl>{rows.map(([k,v])=><><dt key={k}>{k}</dt><dd><Val v={v}/></dd></>)}</dl></section>;}
function Detail({r,imgs,conf,all}:{r:R;imgs:Img[];conf:Record<string,string[]>;all:R[]}){
 const st=effectiveStatus(r,conf);
 return <div><p className="noprint"><a href="#/">← Back to results</a> <button className="sec" onClick={()=>window.print()}>Print requirement</button></p>
 <div className="card"><span className="b warn">{DEMO}</span> <Badge s={st}/> {r.recordStatus==='Inactive'&&<span className="b">Inactive</span>}<h2>{r.customerName} — {r.partNumber}</h2></div>
 {conf[r.id]&&<div className="alert"><b>Potential conflict:</b> other records exist for the same customer, ship-to and part with different instructions. Both are shown; resolve before shipping: {conf[r.id].map(id=><a key={id} href={'#/req/'+id}> {id}</a>)}</div>}
 <Section t="1. Customer and account" rows={[['Customer',r.customerName],['Bill-to #',r.billToCustomerNumber],['Ship-to #',r.shipToCustomerNumber],['Business unit',r.businessUnit]]}/>
 <Section t="2. Sales organization and DC" rows={[['Sales organization',r.salesOrganization],['Applicable DC(s)',r.applicableDCs.join(', ')]]}/>
 <Section t="3. Part and product" rows={[['Part number',r.partNumber],['Description',r.partDescription]]}/>
 <Section t="4. Shipping method and routing" rows={[['Shipping method',r.shippingMethod],['Carrier requirements',r.carrierRequirements],['Routing',r.routingInstructions],['Shipping instructions',r.shippingInstructions]]}/>
 <Section t="5. Packaging and pallet" rows={[['Packaging',r.packagingInstructions],['Palletization',r.palletizationInstructions]]}/>
 <Section t="6. Labeling and documentation" rows={[['Labeling',r.labelingRequirements],['Documentation',r.documentationRequirements]]}/>
 <Section t="7. Special handling and compliance" rows={[['Special handling',r.specialHandlingInstructions],['Compliance notes',r.complianceNotes]]}/>
 <section className="card"><h3>8. Reference images — What Good Looks Like</h3><Gallery imgs={imgs} r={r}/></section>
 <Section t="9. Source and maintenance" rows={[['Last maintained (source)',fmtDate(r.sourceLastMaintainedDate)],['Imported into app',fmtDate(r.importedAt)],['Source system',r.sourceSystem],['Validation status',st],['Record ID',r.id],['Change history','Not yet available (audit log planned)']]}/>
 {void all}</div>;}
function Home({all,conf,imgs}:{all:R[];conf:Record<string,string[]>;imgs:Img[]}){
 const [f,setF]=useState<Filters>(emptyFilters);const [sk,setSk]=useState<SortKey>('customerName');const [dir,setDir]=useState<1|-1>(1);const [pg,setPg]=useState(0);
 const set=(p:Partial<Filters>)=>{setF({...f,...p});setPg(0)};
 const rows=useMemo(()=>sortReqs(filterReqs(all,f),sk,dir),[all,f,sk,dir]);
 const page=rows.slice(pg*10,pg*10+10);const th=(k:SortKey,l:string)=><th onClick={()=>{k===sk?setDir(dir===1?-1:1):setSk(k)}}>{l}{k===sk?(dir===1?' ▲':' ▼'):''}</th>;
 const txt=(k:keyof Filters,l:string)=><div><label>{l}<input value={f[k] as string} onChange={e=>set({[k]:e.target.value})}/></label></div>;
 return <><div className="card"><label>Global search<input aria-label="Global search" placeholder="Customer, part, ship-to, instruction text…" value={f.q} onChange={e=>set({q:e.target.value})}/></label>
 <div className="grid" style={{marginTop:10}}>{txt('part','Part number')}{txt('customer','Customer name')}{txt('billTo','Bill-to #')}{txt('shipTo','Ship-to #')}</div>
 <div className="grid" style={{marginTop:10}}><div><label>Business unit</label><Chips opts={cfg.businessUnits} sel={f.bu} on={v=>set({bu:v})}/></div><div><label>Sales organization</label><Chips opts={cfg.salesOrganizations} sel={f.so} on={v=>set({so:v})}/></div><div><label>Distribution center</label><Chips opts={cfg.distributionCenters} sel={f.dc} on={v=>set({dc:v})}/></div></div>
 <p><button className="sec" onClick={()=>{setF(emptyFilters);setPg(0)}}>Clear all filters</button> <button onClick={()=>downloadCsv(rows)} disabled={!rows.length}>Export {rows.length} to CSV</button></p></div>
 <div className="card"><b>{rows.length}</b> matching requirements · <b>{rows.filter(r=>effectiveStatus(r,conf)!=='Validated'&&effectiveStatus(r,conf)!=='Draft').length}</b> need review/conflict · <b>{rows.filter(r=>imgs.some(i=>i.requirementIds.includes(r.id))).length}</b> with reference images</div>
 {!rows.length?<div className="card"><b>No requirements match.</b> Try a partial part number or customer name, remove a DC/sales-org filter (requirements are searchable across all DCs), or clear all filters.</div>:
 <div className="card tw"><table><thead><tr>{th('customerName','Customer')}{th('partNumber','Part')}{th('shipToCustomerNumber','Ship-to')}{th('salesOrganization','Sales Org')}<th>DC(s)</th><th>Method</th>{th('sourceLastMaintainedDate','Last maintained')}{th('validationStatus','Status')}<th>Images</th></tr></thead><tbody>
 {page.map(r=><tr key={r.id} className="row" tabIndex={0} onClick={()=>location.hash='#/req/'+r.id} onKeyDown={e=>e.key==='Enter'&&(location.hash='#/req/'+r.id)}><td>{r.customerName}<br/><small>{r.billToCustomerNumber}</small></td><td>{r.partNumber}</td><td>{r.shipToCustomerNumber}</td><td>{r.salesOrganization}</td><td>{r.applicableDCs.join(' / ')}</td><td>{r.shippingMethod}</td><td>{r.sourceLastMaintainedDate?fmtDate(r.sourceLastMaintainedDate):<span className="na">Unknown</span>}</td><td><Badge s={effectiveStatus(r,conf)}/></td><td>{imgs.some(i=>i.requirementIds.includes(r.id))?'Yes':'—'}</td></tr>)}</tbody></table>
 <p>Page {pg+1} of {Math.max(1,Math.ceil(rows.length/10))} <button className="sec" disabled={!pg} onClick={()=>setPg(pg-1)}>Prev</button> <button className="sec" disabled={(pg+1)*10>=rows.length} onClick={()=>setPg(pg+1)}>Next</button></p></div>}</>;}
function About(){return <div className="card"><h2>About / Data Scope</h2><ul><li>All records are <b>synthetic demo data</b> and not validated for actual shipments. Not official Panasonic customer instructions.</li><li><b>Scope: B2B customers only.</b> VDF and B2C records are excluded from the intended production scope and rejected by the import validation rules.</li><li>Requirements are visible across all DCs; the DC filter only shows where a requirement applies.</li><li>Images are illustrative local assets, not approved customer standards.</li><li>Future source: HWY905 export; possible SAP–Blue Yonder integration. See README.</li></ul></div>;}
export default function App(){
 const h=useHash();const [all,setAll]=useState<R[]>([]);const [imgs,setImgs]=useState<Img[]>([]);const [err,setErr]=useState('');const [load,setLoad]=useState(true);
 useEffect(()=>{Promise.all([repo.list(),repo.images()]).then(([a,b])=>{setAll(a);setImgs(b)}).catch(e=>setErr(String(e))).finally(()=>setLoad(false))},[]);
 const conf=useMemo(()=>detectConflicts(all),[all]);const id=h.startsWith('#/req/')?h.slice(6):'';const r=all.find(x=>x.id===id);
 return <><nav><span className="logo">LOGO</span><b>Customer Outbound Shipping Requirements Lookup</b><a href="#/">Search</a><a href="#/about">About / Data Scope</a><small>Mock user: demo.user (no real authentication)</small></nav>
 <div className="demo noprint">{DEMO}</div><main>
 {err?<div className="alert">Failed to load requirements: {err}</div>:load?<p>Loading requirements…</p>:h==='#/about'?<About/>:id?(r?<Detail r={r} imgs={imgs.filter(i=>i.requirementIds.includes(r.id))} conf={conf} all={all}/>:<div className="card">Requirement not found. <a href="#/">Back</a></div>):<Home all={all} conf={conf} imgs={imgs}/>}</main></>;}
