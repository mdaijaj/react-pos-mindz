import './../ItemImage/ItemImage.scss';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useState } from 'react';

const ItemImage = () => {
  const [state, setState] = useState({ image: "" });
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }
  }
  return (
    <>
      <div className="ItemImage">
        <div className="row">
          <div className=" col w35">
            <div className="file">
              <input type="file" onChange={onImageChange} className="filetype" id="img" name="img" accept="image/*" />
              {/*               <input type="file" id="img" name="img" accept="image/*" />
 */}              <p>Select Image </p>
            </div>
          </div>

          <div className=" col w35">
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedB"
                  color="default"

                />
              }
              label="Remove"
            />
          </div>
        </div>

        <div className="row">
          <div className=" col w100">
            <div className="imgHeight">
              <img src={state.image} />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ItemImage;