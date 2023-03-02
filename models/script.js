
/*

let value = [
  {
    id:'4242424',
    name:'Frying Pan',
    type:"Cookware",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/fryingpan.png",
    image:"Utensils/fryingpan.png",
    link:'/utensilsdetails'
  },

  {
    id:'535353',
    name:'Ladle',
    type:"Utensils",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/ladle.png",
    image:"Utensils/ladle.png",
    link:'/utensilsdetails'
  },

  {
    id:'856464',
    name:'Wooden Spatula',
    type:"Cookware",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/woodenspatula.png",
    image:"Utensils/woodenspatula.png",
    link:'/utensilsdetails'
  },

  {
    id:'53657676',
    name:'Pressure Cooker',
    type:"Appliances",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/pressurecooker.png",
    image:"Utensils/pressurecooker.png",
    link:'/utensilsdetails'
  },

]
*/
/*
const cookingutensils = value.map((val)=>{

return ({...val,link:`/utensildetails/${val.id}`})
})

  document.getElementById('document').innerText = JSON.stringify(cookingutensils[3]).slice(1,-1)

  */


let value ={
  name:'Odokuma Ogheneguono',
  email:'guonnie@gmail.com',
  coverimage:'Images/blog-1.jpg',
  image:'Images/blog-1.jpg',
  favouriteItems:{
    procurers:['3264743252'],
    ingredients:['3264422','32323642','32423132'],
    equipments:['3234242','564242','323532'],
    recipes:['433t5y3','64864445','3y5y563'],
    },

    chatRooms:['63add7085abb7f53ba9727ac'],
    cartItems1:[
      {
        procurerId:'63869bf69d53fd13bc797d92',
        orderId:'5667878',
        items:[{amount:1, id:'3264422', price: '1000', unit: '10kg', store: 'Zomato', image: 'Images/yam.jpeg' },
        {amount:1, id:'32323642',  price: '1000', unit: '20kg', store: 'Zomato', image: 'Images/pepper.jpeg' },
        {amount:1, id:'32423132',  price: '1000', unit: '10kg', store: 'Zomato', image: 'Images/lettuce.jpeg' },]
      },

      {
        procurerId:'63869bf69d53fd13bc797d92',
        orderId:'5667878',
        items:[{amount:1, id:'3264422', price: '1000', unit: '10kg', store: 'Zomato', image: 'Images/yam.jpeg' },
        {amount:1, id:'32323642', price: '1000', unit: '20kg', store: 'Zomato', image: 'Images/pepper.jpeg' },]
      }
    ],


  cartItems:[{ id:'3264422', name: 'Yam', price: '1000', unit: '10kg', store: 'Zomato', image: 'Images/yam.jpeg' },
  { id:'32323642', name: 'Pepper', price: '1000', unit: '20kg', store: 'Zomato', image: 'Images/pepper.jpeg' },
  { id:'32423132', name: 'Lettuce', price: '1000', unit: '10kg', store: 'Zomato', image: 'Images/lettuce.jpeg' },
  ],
  notifications:[
    {message:'Your order has been delivered',mode:'success'},
    {message:'Your order has been taken by the driver',mode:'info'},
{message:'You have successfully cancelled your order',mode:'success'},
{message:'Your account has expired',mode:'error'},],
  orderInformation:[{procurerId:`63869bf69d53fd13bc797d92`,orderId:'1213242',completed:false},
  {procurerId:`63869bf69d53fd13bc797d92`,orderId:'1213242',completed:true},]
,
  coordinates:[],
  location:[]
}




document.getElementById('document').innerText = JSON.stringify(value).slice(1,-1)
