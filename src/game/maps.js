export const MAPS=Object.freeze([
 {id:'vila-byte',phase:1,name:'Vila Byte',description:'Pedras antigas, vegetação e circuitos de energia.',file:'/assets/maps/vila-byte-v001.png',river:'#125366',bridge:'#967656',accent:'#67e8f9'},
 {id:'copper-mines',phase:2,name:'Minas de Cobre',description:'Pátio mineral com cobre, ardósia e cristais.',file:'/assets/maps/copper-mines-v001.png',river:'#173e4c',bridge:'#aa7950',accent:'#fbbf24'},
 {id:'circuit-woods',phase:3,name:'Bosque de Circuitos',description:'Ruínas cobertas por musgo e energia luminosa.',file:'/assets/maps/circuit-woods-v001.png',river:'#19375c',bridge:'#727387',accent:'#c4b5fd'},
]);
export const DEFAULT_MAP_ID='vila-byte';
export function mapById(id){return MAPS.find(m=>m.id===id)||MAPS[0];}
export function setGameMap(game,id){if(!MAPS.some(m=>m.id===id))return false;game.mapId=id;return true;}
