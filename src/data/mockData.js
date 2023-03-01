import { tokens } from "../theme";

export const productsRowsDemoData = [
  {
    id: "1",
    product: {name: "Product 1"},
    SKU: "ABCD01",
    createDate: "2022-12-12",
    qtyInStock: "100",
    price: "25$",
    image: "product1.png",
  },
  {
    id: "2",
    product: {name: "Product 2"},
    SKU: "ABCD02",
    createDate: "2022-12-12",
    qtyInStock: "89",
    price: "50$",
    image: "product2.png",
  },
  {
    id: "3",
    product: {name: "Product 3"},
    SKU: "ABCD02",
    createDate: "2022-12-12",
    qtyInStock: "15",
    price: "169$",
    image: "product3.png",
  }
]

export const invoicesRowsDemoData = [
  {
    id: "1",
    user: {fullname: "Demo 1"},
    userPaymentMethod: {paymentType: {value: "Tiền mặt"}},
    createDate: "2023-01-01",
    address: {addressLine: "HCM"},
    deliveryMethod: {name: "Nhanh"},
    orderTotal: "$100",
    orderStatus: true,
  },
  {
    id: "2",
    user: {fullname: "Demo 1"},
    userPaymentMethod: {paymentType: {value: "Chuyển khoản"}},
    createDate: "2023-01-02",
    address: {addressLine: "HCM"},
    deliveryMethod: {name: "Chậm"},
    orderTotal: "$122",
    orderStatus: true,
  },
  {
    id: "3",
    user: {fullname: "Demo 2"},
    userPaymentMethod: {paymentType: {value: "Ví điện tử"}},
    createDate: "2023-02-28",
    address: {addressLine: "HN"},
    deliveryMethod: {name: "Nhanh"},
    orderTotal: "$300",
    orderStatus: false,
  }
]

export const mockDataSubcategory = [
  {id:1, name: 'Category 1'},
  {id:2, name: 'Category 2'},
  {id:3, name: 'Category 3'}
]

export const mockLineData = [
  {
    id: "Users",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "Jan",
        y: 101,
      },
      {
        x: "Feb",
        y: 75,
      },
      {
        x: "Mar",
        y: 36,
      },
      {
        x: "Apr",
        y: 216,
      },
      {
        x: "May",
        y: 35,
      },
      {
        x: "Jun",
        y: 236,
      },
      {
        x: "Jul",
        y: 88,
      },
      {
        x: "Aug",
        y: 232,
      },
      {
        x: "Sep",
        y: 281,
      },
      {
        x: "Oct",
        y: 1,
      },
      {
        x: "Nov",
        y: 35,
      },
      {
        x: "Dec",
        y: 14,
      },
    ],
  },
  {
    id: "Products",
    color: tokens("dark").blueAccent[300],
    data: [
      {
        x: "Jan",
        y: 212,
      },
      {
        x: "Feb",
        y: 190,
      },
      {
        x: "Mar",
        y: 270,
      },
      {
        x: "Apr",
        y: 9,
      },
      {
        x: "May",
        y: 75,
      },
      {
        x: "Jun",
        y: 175,
      },
      {
        x: "Jul",
        y: 33,
      },
      {
        x: "Aug",
        y: 189,
      },
      {
        x: "Sep",
        y: 97,
      },
      {
        x: "Oct",
        y: 87,
      },
      {
        x: "Nov",
        y: 299,
      },
      {
        x: "Dec",
        y: 251,
      },
    ],
  },
  {
    id: "Money",
    color: tokens("dark").redAccent[200],
    data: [
      {
        x: "Jan",
        y: 191,
      },
      {
        x: "Feb",
        y: 136,
      },
      {
        x: "Mar",
        y: 91,
      },
      {
        x: "Apr",
        y: 190,
      },
      {
        x: "May",
        y: 211,
      },
      {
        x: "Jun",
        y: 152,
      },
      {
        x: "Jul",
        y: 189,
      },
      {
        x: "Aug",
        y: 152,
      },
      {
        x: "Sep",
        y: 8,
      },
      {
        x: "Oct",
        y: 197,
      },
      {
        x: "Nov",
        y: 107,
      },
      {
        x: "Dec",
        y: 170,
      },
    ],
  },
];