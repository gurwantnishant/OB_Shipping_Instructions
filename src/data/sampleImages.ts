import type {ReferenceImage} from '../types';
export const IMAGE_CATEGORIES=['Correct pallet stacking','Stretch wrapping and load securing','Shipping label placement','Carton labeling and barcode visibility','Packaging and product protection','Pallet dimensions and preparation'];
const blurb=['Cartons are column-stacked within the pallet footprint with no overhang.','Wrap starts at the base and overlaps upward; corners are secured.','Shipping label is placed on the upper right of the pallet face, unobstructed.','Barcode faces outward on every carton; no wrap covers the label.','Product is protected with corner boards and dunnage as specified.','Pallet is built within the specified footprint and height limit.'];
export function demoSvg(cat:number,title:string):string{
 const boxes=Array.from({length:3+cat%3}).map((_,i)=>`<rect x="${70+(i%2)*90}" y="${200-Math.floor(i/2)*45}" width="85" height="42" fill="#c9a875" stroke="#7a5c2e"/>`).join('');
 const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#eef3fb"/><rect width="400" height="26" fill="#b45309"/><text x="200" y="17" font-size="11" fill="#fff" text-anchor="middle" font-family="Arial" font-weight="bold">ILLUSTRATIVE EXAMPLE — NOT AN APPROVED STANDARD</text><rect x="55" y="245" width="270" height="10" fill="#8b6b3d"/>${boxes}${cat%2?'<rect x="250" y="190" width="50" height="32" fill="#fff" stroke="#0b2a5b"/><rect x="256" y="196" width="38" height="14" fill="#0b2a5b"/>':''}<text x="200" y="240" font-size="10" fill="#0b2a5b" text-anchor="middle" font-family="Arial">${title.replace(/&/g,'and')}</text></svg>`;
 return 'data:image/svg+xml;utf8,'+encodeURIComponent(s);}
export function buildImages(reqIds:string[],now:string):ReferenceImage[]{
 const out:ReferenceImage[]=[];
 reqIds.forEach((rid,i)=>{
  if(i%5===4)return; // some requirements intentionally have no images
  const n=1+(i%3);
  for(let k=0;k<n;k++){const c=(i+k)%6;
   out.push({id:`IMG-${rid}-${k+1}`,requirementIds:[rid],title:IMAGE_CATEGORIES[c],description:blurb[c],category:IMAGE_CATEGORIES[c],
    imagePath:demoSvg(c,IMAGE_CATEGORIES[c]),imageSource:'Local generated demo asset',approvalStatus:'Illustrative',
    lastReviewedDate:null,isIllustrative:true,createdAt:now});}});
 return out;}
