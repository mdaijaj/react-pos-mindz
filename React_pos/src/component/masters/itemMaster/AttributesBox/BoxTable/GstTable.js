import "./../BoxTable/BoxTable.scss";

const BoxTable = props => {
  // console.log('gsttable', props)
  return (
    <>
      <div className="customersTable">
        <table className="table">
          <thead>
            <tr style={{ backgroundColor: "#1A5F9E" }}>
              <th style={{ width: "30%" }}>HSN Code</th>
              <th>HSN Name</th>
              <th>Applicable Date</th>
            </tr>
          </thead>

          <tbody>
            {props.data.length > 0?
              props.data.map(val=>
                <tr>
                  <td>{val.HSNCode}</td>
                  <td>{val.HSNName}</td>
                  <td>{val.ApplicableDate}</td>
                </tr>
              )
              :
              <>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                </tr>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                </tr>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                </tr>
              
              </>
              
            
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoxTable;
