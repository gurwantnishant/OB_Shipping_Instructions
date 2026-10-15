import type {CustomerRequirement as R} from '../types';
import cfg from '../config/lists.json';
export const DEMO_IMPORT_DATE='2026-10-15';
const C=[
 {n:'Northstar Retail Demo Co.',b:'B-100201',so:'PCONA',bu:'Consumer Electronics',m:'LTL — customer routing guide',car:'Customer-assigned carrier; liftgate not required',r:'Book via customer portal 48h ahead; use assigned appointment window.',p:'Double-wall cartons; max 60 in. pallet height.',l:'Customer PO label on top-right of each carton face.',d:'BOL and packing list attached to pallet.'},
 {n:'Lakeshore Distribution Demo Inc.',b:'B-100455',so:'PESNA',bu:'Industrial Devices',m:'FTL — prepaid',car:'Approved carrier list only',r:'Dock appointment required; notify consignee 24h before pickup.',p:'ESD-safe bags inside cartons; corner boards on all pallets.',l:'ASN barcode label on two adjacent pallet faces.',d:'BOL, packing list, certificate of conformance.'},
 {n:'Summit Energy Systems Demo LLC',b:'B-100782',so:'PPNDA',bu:'Energy Solutions',m:'Ocean container — consolidated',car:'Forwarder-nominated',r:'Deliver to CFS cut-off; no weekend gate-in.',p:'Heat-treated pallets (ISPM-15); max 2 layers.',l:'Marks and numbers on three pallet sides.',d:'Commercial invoice, packing list, DG declaration.'},
 {n:'Harbor Point Wholesale Demo Corp.',b:'B-100913',so:'PCEC',bu:'Consumer Electronics',m:'Parcel — ground',car:'Customer account number required on label',r:'Ship in master cartons of 12 only.',p:'Single-SKU master cartons; void fill required.',l:'UPC visible on one carton face.',d:'Packing slip inside carton.'},
 {n:'Redwood Integrators Demo Ltd.',b:'B-101120',so:'PCONA',bu:'Industrial Devices',m:'LTL — collect',car:'Customer carrier; call for pickup 48h ahead',r:'Route through customer cross-dock.',p:'Shrink-wrap each layer; no mixed-SKU pallets.',l:'Customer part number label on each carton.',d:'BOL with customer PO reference.'},
 {n:'Prairie Fleet Services Demo Inc.',b:'B-101377',so:'PESNA',bu:'Energy Solutions',m:'Expedited air',car:'Time-critical carrier',r:'Same-day tender to carrier; confirm tracking to customer.',p:'Cushioned crates for battery modules.',l:'Hazard labels per documentation.',d:'Air waybill, DG paperwork.'}];
const P=[['DEMO-BAT-1865-A','Lithium-ion cell pack (demo)','Class 9 DG paperwork; max 3 layers.'],['DEMO-DSP-4K-55','55 in. display panel (demo)','Transport upright; no stacking.'],['DEMO-SNS-IR-220','Infrared sensor module (demo)',''],['DEMO-CAM-HD-07','HD camera unit (demo)','Protect lens; keep dry.'],['DEMO-PSU-480W','480W power supply (demo)',''],['DEMO-CTL-PLC-12','PLC controller (demo)','ESD-sensitive.']];
const DCS=cfg.distributionCenters;
export function buildSample():R[]{
 const out:R[]=[];
 for(let i=0;i<28;i++){
  const c=C[i%6],f=Math.floor(i/6),p=P[(i+f)%6],id=`REQ-${String(i+1).padStart(4,'0')}`;
  const sl=(i+1)%6===0?null:`2025-${String(1+(i*5)%12).padStart(2,'0')}-${String(3+(i*7)%25).padStart(2,'0')}`;
  const dcs=i%4===0?[DCS[i%3],DCS[(i+1)%3]]:[DCS[i%3]];
  out.push({id,customerType:'B2B',businessUnit:c.bu,salesOrganization:c.so,applicableDCs:dcs,customerName:c.n,
   billToCustomerNumber:c.b,shipToCustomerNumber:`${c.b.replace('B','S')}-0${(f%3)+1}`,partNumber:p[0],partDescription:p[1],
   shippingMethod:c.m,carrierRequirements:i%7===0?undefined:c.car,routingInstructions:c.r,
   shippingInstructions:`Confirm carrier and appointment before staging. Ship-to ${f%3+1} receives Mon–Thu only.`,
   packagingInstructions:c.p,palletizationInstructions:i%9===0?undefined:`Pallet footprint 48x40 in.; max height 60 in.; ${i%2?'column':'interlock'} stack.`,
   labelingRequirements:c.l,documentationRequirements:i%7===3?undefined:c.d,specialHandlingInstructions:p[2]||undefined,
   complianceNotes:i%5===0?'DEMO note: customer compliance review pending.':undefined,referenceImageIds:[],
   sourceSystem:'DEMO-SAMPLE (not HWY905)',sourceLastMaintainedDate:sl,importedAt:DEMO_IMPORT_DATE,
   validationStatus:i%6===1?'Needs Review':'Draft',recordStatus:i===27?'Inactive':'Active',isDemo:true,createdAt:DEMO_IMPORT_DATE,updatedAt:DEMO_IMPORT_DATE});}
 // Intentional conflicts: same bill-to/ship-to/part as REQ-0001 and REQ-0002, different method/routing
 for(const [src,nid] of [[0,'REQ-0029'],[1,'REQ-0030']] as const){
  out.push({...out[src],id:nid,shippingMethod:'Parcel — air (conflicting demo record)',routingInstructions:'Conflicting demo routing: ship direct, skip cross-dock.',applicableDCs:[DCS[(src+2)%3]],sourceLastMaintainedDate:'2024-03-18',validationStatus:'Draft'});}
 return out;}
