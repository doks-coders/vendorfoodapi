const sgMail = require('@sendgrid/mail')
const Chatrooms = require('../models/chatrooms')
const Procurers = require('../models/procurers')
const Recipes = require('../models/recipes');
const Products = require('../models/products');
const Equipments = require('../models/equipments');
const Users = require('../models/users')
const Cart = require('../models/cart')

require('dotenv').config();


 const configureProcurement =  ({array,target})=>{
    let finalItems = []


    array.forEach((val)=>{
    val._doc[target].map((valEntered)=>{
      console.log(valEntered)
      finalItems.push({...valEntered,location:val.name})
    }
    )})
  

  
  finalItems = finalItems.map((val)=>{
   if((val.testimonials)&&(val.testimonials.length>0)){
        let averageRating = getAverageRating(val.testimonials)
          return {...val,rating:averageRating,price:parseCurrency(val.price)}
        }
      return {...val,rating:0,price:parseCurrency(val.price),testimonials:[]}
    })
    console.log({finalItems})
    return finalItems
  }

  const sendEmail =({msg})=>{
  

    return new Promise((resolve,reject)=>{
      sgMail.setApiKey(process.env.SENDGRIDKEY) 

    console.log(process.env.SENDGRIDKEY)
console.log(msg)
  
      sgMail.send(msg)
      .then((response) => { 
        resolve('Success')
          console.log({statusCode:response[0].statusCode}) 

          console.log({headers:response[0].headers}) 
        }) .catch((error) => { 
              console.error(error) 
           reject(error)
          })
    })


}








  const getAverageRating = (testimonials)=>{
    let ratings = testimonials.map((val)=>Number(val.rating))
    let total =  ratings.reduce((total,val)=>val+total)
    let average= total/ratings.length
    return (average)
  }


  
  const  parseCurrency = (amount)=> { 
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('.00','')
}


const getSelectedChatRooms = (chatrooms)=>{
  return new Promise(async (resolve, reject) => {

  
      getRooms(chatrooms).then(val=>{
          resolve(val)
      }).catch(err=>{
          reject(err)
      })
  })
}




function getRooms(chatrooms) {
  return new Promise( async(resolve, reject) => {
    console.log({chatrooms})
     const chosenRooms =  await Chatrooms.find({_id:{$in:chatrooms}})
     console.log(chosenRooms)
      const chosenRoomsE = []
      const unavailable = []

      chosenRooms.forEach(async(val)=>{ 
      let item = val['_doc'] 
    const procurerInfo =  await  Procurers.findById(item.procurerId)
     const usersInfo = await  Users.findById(item.userId)

   try{
        item = {...item,name:usersInfo['_doc'].name,procurerName:procurerInfo['_doc'].name}
        chosenRoomsE.push(item)
       }catch(err){
        console.log(err)
        unavailable.push(1)
       }

        if((chosenRoomsE.length+unavailable.length) == chosenRooms.length){
      console.log({chosenRoomsE})
      resolve(chosenRoomsE)
     }
      })

  })
}

const uidNumber = ()=>{
  let randomNumberString = '';
  for (let i = 0; i < 5; i++) {
    randomNumberString += Math.floor(Math.random() * 10);
  }
  return randomNumberString
    }

     const uid = ()=>{ 
      let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    
    }


module.exports = {configureProcurement,sendEmail,getSelectedChatRooms,uidNumber,uid}





