export interface Region {
  city:string;
  region_code:string;
}
export interface Coordination {
 coord:any;
 chosedData:Data
}
interface Data{
  item:any;
  id:any;
}
export const INITIAL_REGION: Region = {
  city:'',
  region_code:'370000'
};
export  const INITIAL_COORD:Coordination = {
 coord:'',
  chosedData:{
   item:'',
    id:''
  }
};
