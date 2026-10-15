import type {CustomerRequirement} from '../types';
/** Production scope: B2B only. VDF / B2C records are excluded. */
export function isInScope(r:Pick<CustomerRequirement,'customerType'|'customerName'>):boolean{
 return r.customerType==='B2B'&&!/\b(VDF|B2C)\b/i.test(r.customerName);}
export function isValidRecord(r:Partial<CustomerRequirement>):boolean{
 return !!(r.id&&r.customerName&&r.partNumber&&r.salesOrganization&&Array.isArray(r.applicableDCs)&&r.applicableDCs.length);}
