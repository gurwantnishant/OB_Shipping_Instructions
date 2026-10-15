export const UNKNOWN_DATE='Unknown — awaiting source validation';
export function fmtDate(d?:string|null,fallback=UNKNOWN_DATE):string{
 if(!d)return fallback;const t=new Date(d+'T00:00:00');
 return isNaN(t.getTime())?fallback:t.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit'});}
