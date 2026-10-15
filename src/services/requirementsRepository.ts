import type {CustomerRequirement,ReferenceImage} from '../types';
import {buildSample} from '../data/sampleRequirements';
import {buildImages} from '../data/sampleImages';
import {isInScope,isValidRecord} from '../utils/validation';
/** Replace with an API-backed implementation (HWY905 import / SAP-BY) without touching the UI. */
export interface RequirementsRepository{list():Promise<CustomerRequirement[]>;images():Promise<ReferenceImage[]>}
export function prepare(raw:CustomerRequirement[]):{reqs:CustomerRequirement[];images:ReferenceImage[]}{
 const reqs=raw.filter(isValidRecord).filter(isInScope);
 const images=buildImages(reqs.map(r=>r.id),'2026-10-15');
 reqs.forEach(r=>{r.referenceImageIds=images.filter(i=>i.requirementIds.includes(r.id)).map(i=>i.id)});
 return {reqs,images};}
const data=prepare(buildSample());
export const sampleRepository:RequirementsRepository={
 list:()=>new Promise(res=>setTimeout(()=>res(data.reqs),250)),
 images:()=>Promise.resolve(data.images)};
