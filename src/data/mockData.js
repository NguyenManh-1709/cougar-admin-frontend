import { tokens } from "../theme";

export const mockDataUser = [
  {
    username: "jonsnow",
    fullname: "Jon Snow",
    phone: "(665)121-5454",
    email: "jonsnow@gmail.com",
    createdate: "01-01-2023",
    status: 0,
  },
  {
    username: "cerseilannister",
    fullname: "Cersei Lannister",
    phone: "(421)314-2288",
    email: "cerseilannister@gmail.com",
    createdate: "01-02-2023",
    status: 1,
  },
  {
    username: "jaimelannister",
    fullname: "Jaime Lannister",
    phone: "(422)982-6739",
    email: "jaimelannister@gmail.com",
    createdate: "01-02-2023",
    status: 0,
  },
];

export const mockDataProduct = [
  {
    id: 1,
    name: 'Sản phẩm 1',
    subcategory: {id:1, name: 'Category 1'},
    createdate: "01-01-2023", 
    price: 100,
    description: 'Đây là sản phẩm 1',
    image: 'sp1.png'
  },
  {
    id: 2,
    name: 'Sản phẩm 2',
    subcategory: {id:2, name: 'Category 2'},
    createdate: "01-01-2023", 
    price: 200,
    description: 'Đây là sản phẩm 2',
    image: 'sp2.png'
  },
  {
    id: 3,
    name: 'Sản phẩm 3',
    subcategory: {id:3, name: 'Category 3'},
    createdate: "01-01-2023", 
    price: 300,
    description: 'Đây là sản phẩm 3',
    image: 'sp3.png'
  },
];

export const mockDataInvoices = [
  {
    id: 1,
    customer: {
      username: "jonsnow",
      fullname: "Jon Snow",
      phone: "(665)121-5454",
      email: "jonsnow@gmail.com",
      createdate: "01-01-2023",
      status: 0,
    },
    total: "800",
    date: "03/12/2022",
    details: [
      {
        id: 1,
        product: {
          id: 1,
          name: 'Sản phẩm 1',
          subcategory: {id:1, name: 'Category 1'},
          createdate: "01-01-2023", 
          price: 100,
          description: 'Đây là sản phẩm 1',
          image: 'sp1.png'
        }, 
        quantity: 5,
      },
      {
        id: 2,
        product: {
          id: 3,
          name: 'Sản phẩm 3',
          subcategory: {id:3, name: 'Category 3'},
          createdate: "01-01-2023", 
          price: 300,
          description: 'Đây là sản phẩm 3',
          image: 'sp3.png'
        },
        quantity: 1
      },
    ],
  },
  {
    id: 2,
    customer: {
      username: "jonsnow",
      fullname: "Jon Snow",
      phone: "(665)121-5454",
      email: "jonsnow@gmail.com",
      createdate: "01-01-2023",
      status: 0,
    },
    total: "700",
    date: "06/15/2021",
    details: [
      {
        id: 1,
        product: {
          id: 1,
          name: 'Sản phẩm 1',
          subcategory: {id:1, name: 'Category 1'},
          createdate: "01-01-2023", 
          price: 100,
          description: 'Đây là sản phẩm 1',
          image: 'sp1.png'
        }, 
        quantity: 1,
      },
      {
        id: 2,
        product: {
          id: 3,
          name: 'Sản phẩm 3',
          subcategory: {id:3, name: 'Category 3'},
          createdate: "01-01-2023", 
          price: 300,
          description: 'Đây là sản phẩm 3',
          image: 'sp3.png'
        },
        quantity: 2
      },
    ],
  },
];

export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];

export const mockLineData = [
  {
    id: "japan",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "plane",
        y: 101,
      },
      {
        x: "helicopter",
        y: 75,
      },
      {
        x: "boat",
        y: 36,
      },
      {
        x: "train",
        y: 216,
      },
      {
        x: "subway",
        y: 35,
      },
      {
        x: "bus",
        y: 236,
      },
      {
        x: "car",
        y: 88,
      },
      {
        x: "moto",
        y: 232,
      },
      {
        x: "bicycle",
        y: 281,
      },
      {
        x: "horse",
        y: 1,
      },
      {
        x: "skateboard",
        y: 35,
      },
      {
        x: "others",
        y: 14,
      },
    ],
  },
  {
    id: "france",
    color: tokens("dark").blueAccent[300],
    data: [
      {
        x: "plane",
        y: 212,
      },
      {
        x: "helicopter",
        y: 190,
      },
      {
        x: "boat",
        y: 270,
      },
      {
        x: "train",
        y: 9,
      },
      {
        x: "subway",
        y: 75,
      },
      {
        x: "bus",
        y: 175,
      },
      {
        x: "car",
        y: 33,
      },
      {
        x: "moto",
        y: 189,
      },
      {
        x: "bicycle",
        y: 97,
      },
      {
        x: "horse",
        y: 87,
      },
      {
        x: "skateboard",
        y: 299,
      },
      {
        x: "others",
        y: 251,
      },
    ],
  },
  {
    id: "us",
    color: tokens("dark").redAccent[200],
    data: [
      {
        x: "plane",
        y: 191,
      },
      {
        x: "helicopter",
        y: 136,
      },
      {
        x: "boat",
        y: 91,
      },
      {
        x: "train",
        y: 190,
      },
      {
        x: "subway",
        y: 211,
      },
      {
        x: "bus",
        y: 152,
      },
      {
        x: "car",
        y: 189,
      },
      {
        x: "moto",
        y: 152,
      },
      {
        x: "bicycle",
        y: 8,
      },
      {
        x: "horse",
        y: 197,
      },
      {
        x: "skateboard",
        y: 107,
      },
      {
        x: "others",
        y: 170,
      },
    ],
  },
];