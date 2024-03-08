
export const getInfoSystem=()=>{
let browserName = "";   
let OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!==-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!==-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("Linux")!==-1) OSName="Linux";
    const x = navigator.productSub
    const hsKey = OSName+x;
    return hsKey;
}