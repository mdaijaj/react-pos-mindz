
export default  function fnGetFinalProduct(existingproduct,product){
   
    let finalProduct = [...existingproduct,product];
    console.log("finalprod util", finalProduct);
    return finalProduct;
}