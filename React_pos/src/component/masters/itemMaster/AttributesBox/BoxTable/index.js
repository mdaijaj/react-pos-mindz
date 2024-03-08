import "./../BoxTable/BoxTable.scss";

const BoxTable = (props) => {
  console.log(props, "props");
  const attriButes =
    props &&
    props.idb.AttributeMaster.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.AttributeName}</td>
          <td>
            <select>
              <option>Select</option>
              {item.Value.map((val, i) => (
                <option key={i}>{val.ValueName}</option>
              ))}
            </select>
          </td>
        </tr>
      );
    });
  return (
    <>
      <div className="customersTable">
        <table className="table">
          <thead>
            <tr style={{ backgroundColor: "#1A5F9E" }}>
              <th style={{ width: "30%" }}>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{attriButes}</tbody>
        </table>
      </div>
    </>
  );
};

export default BoxTable;
