// Launch-price catalogue in BRL cents. Available in store with atomic profile delivery.
// Play purchases will display the localized price returned by Google Play when billing is enabled.
export const GOLD_PACKS=Object.freeze([
 {id:'gold-500',name:'Bolsa de Gold',gold:500,priceCents:149,currency:'BRL',status:'available',image:'/assets/rewards/gold-pack-500.png'},
 {id:'gold-1200',name:'Cofre de Gold',gold:1200,priceCents:290,currency:'BRL',status:'available',image:'/assets/rewards/gold-pack-1200.png'},
 {id:'gold-2500',name:'Baú de Gold',gold:2500,priceCents:490,currency:'BRL',status:'available',image:'/assets/rewards/gold-pack-2500.png'},
 {id:'gold-5500',name:'Tesouro de Gold',gold:5500,priceCents:990,currency:'BRL',status:'available',image:'/assets/rewards/gold-pack-5500.png'},
 {id:'gold-12000',name:'Fortuna de Gold',gold:12000,priceCents:1990,currency:'BRL',status:'available',image:'/assets/rewards/gold-pack-12000.png'},
].map(pack=>Object.freeze(pack)));
export const goldPackPrice=pack=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:pack.currency}).format(pack.priceCents/100);
