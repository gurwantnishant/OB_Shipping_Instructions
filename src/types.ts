export type ValidationStatus='Draft'|'Validated'|'Needs Review'|'Conflict Detected'|'Inactive';
export interface CustomerRequirement{
 id:string;customerType:'B2B'|'B2C'|'VDF';businessUnit:string;salesOrganization:string;applicableDCs:string[];
 customerName:string;billToCustomerNumber:string;shipToCustomerNumber:string;partNumber:string;partDescription:string;
 shippingMethod:string;carrierRequirements?:string;routingInstructions?:string;shippingInstructions?:string;
 packagingInstructions?:string;palletizationInstructions?:string;labelingRequirements?:string;
 documentationRequirements?:string;specialHandlingInstructions?:string;complianceNotes?:string;
 referenceImageIds:string[];sourceSystem:string;sourceLastMaintainedDate:string|null;importedAt:string;
 validationStatus:ValidationStatus;recordStatus:'Active'|'Inactive';isDemo:boolean;createdAt:string;updatedAt:string;}
export interface ReferenceImage{
 id:string;requirementIds:string[];title:string;description:string;category:string;imagePath:string;imageSource:string;
 approvalStatus:'Illustrative'|'Approved'|'Pending Approval';lastReviewedDate?:string|null;isIllustrative:boolean;createdAt:string;}
