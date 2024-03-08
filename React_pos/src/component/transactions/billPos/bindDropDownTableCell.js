import React from "react";
import Select from "react-select";
const BindDropDownTableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  itemList,
  selectedProduct,
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [product, setProduct] = React.useState(selectedProduct);
  const [filterProduct, setFilterProduct] = React.useState(itemList);

  const onChange = (e) => {
    setValue(e.Label);
    updateMyData(index, id, value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  const fn_FilterProduct = (selectedProducts, rowIndex) => {
    let selectedProductsTemp =
      selectedProducts && selectedProducts.length > 1
        ? selectedProducts.filter(
            (x) => x.value !== selectedProducts[rowIndex].value
          )
        : selectedProducts;
    let yFilter =
      selectedProductsTemp && selectedProductsTemp.length > 0
        ? selectedProductsTemp.map((itemY) => {
            return itemY.value;
          })
        : [];

    // Use filter and "not" includes to filter the full dataset by the filter dataset's val.
    let filteredX =
      itemList && itemList.length > 0 && yFilter.length > 0
        ? itemList.filter((itemX) => !yFilter.includes(itemX.value))
        : itemList;
    setFilterProduct(filteredX);
  };
  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
    setProduct(selectedProduct[index].ItemId);
    fn_FilterProduct(selectedProduct, index);
  }, [initialValue, selectedProduct]);

  return (
    <>
      <Select
        value={product}
        isSearchable={true}
        closeMenuOnSelect={true}
        onChange={onChange}
        options={filterProduct}
        placeholder={value}
        maxMenuHeight={250}
      />
    </>
  );
};

export default BindDropDownTableCell;
