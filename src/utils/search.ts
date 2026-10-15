import type {CustomerRequirement as R,ValidationStatus} from '../types';
export interface Filters{q:string;bu:string[];so:string[];dc:string[];part:string;customer:string;billTo:string;shipTo:string}
export const emptyFilters:Filters={q:'',bu:[],so:[],dc:[],part:'',customer:'',billTo:'',shipTo:''};
const has=(h:string,n:string)=>!n.trim()||h.toLowerCase().includes(n.trim().toLowerCase());
const hay=(r:R)=>Object.values(r).flat().filter(v=>typeof v==='string').join(' ');
export function filterReqs(rs:R[],f:Filters):R[]{
 return rs.filter(r=>(!f.bu.length||f.bu.includes(r.businessUnit))&&(!f.so.length||f.so.includes(r.salesOrganization))&&
  (!f.dc.length||r.applicableDCs.some(d=>f.dc.includes(d)))&&has(r.partNumber,f.part)&&has(r.customerName,f.customer)&&
  has(r.billToCustomerNumber,f.billTo)&&has(r.shipToCustomerNumber,f.shipTo)&&has(hay(r),f.q));}
export type SortKey='customerName'|'partNumber'|'shipToCustomerNumber'|'salesOrganization'|'sourceLastMaintainedDate'|'validationStatus';
export function sortReqs(rs:R[],k:SortKey,dir:1|-1):R[]{
 return [...rs].sort((a,b)=>String(a[k]??'').localeCompare(String(b[k]??''))*dir);}
/** Same bill-to + ship-to + part with differing instructions => conflict. Never merged; both shown. */
export function detectConflicts(rs:R[]):Record<string,string[]>{
 const g:Record<string,R[]>={};
 rs.filter(r=>r.recordStatus==='Active').forEach(r=>{(g[`${r.billToCustomerNumber}|${r.shipToCustomerNumber}|${r.partNumber}`]??=[]).push(r)});
 const out:Record<string,string[]>={};
 Object.values(g).forEach(list=>{
  const sig=(r:R)=>[r.shippingMethod,r.routingInstructions,r.palletizationInstructions].join('|');
  if(list.length>1&&new Set(list.map(sig)).size>1)list.forEach(r=>{out[r.id]=list.filter(o=>o.id!==r.id).map(o=>o.id)});});
 return out;}
export const effectiveStatus=(r:R,c:Record<string,string[]>):ValidationStatus=>c[r.id]?'Conflict Detected':r.validationStatus;
