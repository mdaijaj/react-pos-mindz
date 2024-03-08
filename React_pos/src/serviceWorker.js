// if('serviceWorker' in navigator){
//   console.log("eee");
// }
export function serviceWorker(){
  console.log('ddd',`${process.env.PUBLIC_URL}`);
  if('serviceWorker' in navigator){
      window.addEventListener('load',()=>{
      navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
      .then(reg => console.log('service worker:Registered'))
      .catch(err=> console.log(`service worker: Error:${err}`))
      })
    }
}
