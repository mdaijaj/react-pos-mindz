const nav = [
  {
    id: 0,
    name: "Dashboard",
    iconClass: "dashBoard",
    subMenu: [],
  },
  {
    id: 1,
    name: "Master",
    iconClass: "master",
    subMenu: [
      {
        name: "Unit Master",
      },
      {
        name: "Item Group",
      },
      {
        name: "Item Master",
      },
      {
        name: "GST Classification",
      },
      {
        name: "Customer Master",
      },
      {
        name: "Vendor Master",
      },
      {
        name: "Geographical Location",
      },
      {
        name: "Multi Record Alteration",
        subMenu: [
          {
            name: "Vendor Master Alteration",
          },
        ],
      },
      {
        name: "Employee Master",
      },
      {
        name: "Reason Master",
      },
      {
        name: "Currency Master",
      },
      {
        name: "Sale Person Master",
      },
      {
        name: "Item Attribute",
      },
      {
        name: "Designation Master",
      },
      {
        name: "Counter Master",
      },
      {
        name: "Series Master (Transaction)",
      },
      {
        name: "Tax Group",
      },
      {
        name: "Item Tax Rate Structure",
      },
      {
        name: "Apply Series",
      },
      {
        name: "Voucher Type",
      },
      {
        name: "Import Format",
      },
      {
        name: "Tag Report",
      },
    ],
  },
  {
    id: 2,
    name: "Transaction",
    iconClass: "transaction",
    subMenu: [
      { name: "Bill Pos" },
      {name:"Bill Pos with Sale order"},
      { name: "Sale Return (bill wise)" },
      { name: "Purchase Return" },
      { name: "Purchase Return Without Inward" },
      { name: "Advance Adjustment" },
      { name: "Credit Note" },
      { name: "Purchase Order" },
      { name: "Material Inward with GIT" },
      { name: "Stock General" },
      { name: "Indent" },
      { name: "Debit Note" },
      { name: "Sale Order" },
      { name: "Purchase Inward with GIT" },
      { name: "Purchase Invoice" },
      { name: "Credit Note Refund" },
      {name:"Sales Return (Manual)"},
    ],
  },
  {
    id: 3,
    name: "Synchronize",
    iconClass: "synchronize",
    subMenu: [],
  },
  {
    id: 4,
    name: "Report",
    iconClass: "report",
    subMenu: [],
  },
  {
    id: 5,
    name: "Configuration",
    iconClass: "configuration",
    subMenu: [],
  },
  {
    id: 6,
    name: "Security",
    iconClass: "security",
    subMenu: [
      {
        name: "User Management",
      },
      {
        name: "Role Management",
      },
      {
        name: "Change Password",
      },
    ],
  },
  {
    id: 7,
    name: "Tool",
    iconClass: "tool",
    subMenu: [],
  },
];
export default nav;
