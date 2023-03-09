

const { sendEmail, getSelectedChatRooms,uidNumber,uid } = require('../misc/index');
const Procurers = require('../models/procurers')
const Recipes = require('../models/recipes');
const Products = require('../models/products');
const Equipments = require('../models/equipments');
const Users = require('../models/users')
const Cart = require('../models/cart')

const getItems = (value) => {
    let objectOfValues = {
        'recipes': Recipes,
        'procurers': Procurers,
        'products': Products,
        'equipments': Equipments,
    }

    return objectOfValues[value]
}

module.exports = class API {
    //fetch all posts

    static async createUser(req, res) {
        const { firebaseId,name,email } = req.body
        const userbody = { firebaseId,username:name,email,id:uid() }
        console.log({userbody})
        try {

            const newProcurer = await Procurers.create(userbody)
            res.status(201).json(newProcurer)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }


    static async verifyOTP(req, res) {
        const {userId,otpNumber} = req.body
        
        try {
            const user = await Procurers.find({_id:userId})
            const userOtp = user[0]['_doc'].otp
            if(userOtp){
                if(otpNumber==userOtp){
                    res.status(201).json({message:'It matches'})
                }else{
                    res.status(201).json({message:`It doesn't match`})
                }
            }else{
                res.status(404).json({message:'No OTP'})
            }

        } catch (error) {
            res.status(404).json({message:error.message})
        }
    }

    
    
static async registerUserMethod(req,res){
    const {value,key,userId} = req.body

    try {
        let setObject = {}
        setObject[key] = value 
        let result = await Procurers.updateOne({_id:userId},{$set:setObject})
    res.status(201).json({message:'Success'})
    } catch (error) {
        res.status(404).json({message:error.message})
    }

}

static async getUserWithFirebaseid(req,res){
    const fireid = req.params.id
     try {
    let procurers = await Procurers.find({firebaseId:fireid})
    console.log({procurers})
         res.status(201).json(procurers[0])
     } catch (error) {
         res.status(404).json({message:error.message})
     }
 }


    static async emailOTPProcess(req,res){
        console.log('Email Commenced')
        const userId =  req.params.id
        console.log({userId})
        const code = uidNumber()
        try {
              await Procurers.updateOne({_id:userId},{$set:{otp:code}})
            const user  = await Procurers.find({_id:userId})
            const email = user[0]['_doc'].email
            const name = user[0]['_doc'].username
            console.log({email})
            const msg = {
                from: 'guonnie@gmail.com',
                to: email,
                subject: 'Verification Code For App',
                text: `${name}, please use this verification code ${code} to create your account`,
              //  html: '<></>',
            }
            console.log({msg})
            sendEmail({ msg }).then(() => {
    
                res.status(200).json({ message: 'Message Sent Successfully' })
            }).catch(err => {
                res.status(404).json({ message: err.message })
            })

            
        } catch (error) {
            
        }
       

    }



    //update a sendMail
    static async sendMail(req, res) {

        //req.body

        const msg = {
            from: 'guonnie@gmail.com',
            to: 'guonnie@gmail.com',
            // Change to your recipient from: 'test@example.com', 
            // Change to your verified sender 

            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        console.log('Email About to be sent In Server')


        sendEmail({ msg }).then(() => {

            res.status(200).json({ message: 'Post Updated Sucessfully' })
        }).catch(err => {
            res.status(404).json({ message: err.message })

        })




    }

    static async getCartHeaders(req, res) {
        /**@param {Array} array **/
        /**@param {Array} cartItems **/
        /**@param {Array} userKeys **/
        /**@param {Array} items **/
        /**@param {Array} userItemArray **/
        /**@param {Array} userItems **/



        const array = req.body

        try {

            const cartInitial = await Cart.find({ _id: { $in: array } })
            const cartItems = cartInitial.filter((val) => val['_doc'].orderSent == true)
            const userKeys = cartItems.map((val) => val.userId)
            const items = cartItems.map((val) => ({ items: val.items, userId: val.userId, cartId: val._id, orderAccepted: val.orderAccepted }))
            const userItemArray = await Users.find({ _id: { $in: userKeys } })
            const userItems = userItemArray.map((val) => {
                const { name, image, _id, id } = val['_doc']

                let itemsArray = items.map((val) => val.userId)

                let indexEL = itemsArray.findIndex((val) => val == _id)
                const { cartId, procurerId, userId, orderAccepted } = items[indexEL]

                return {
                    name, image, _id, id,
                    items: items[indexEL].items,
                    cartId,
                    procurerId,
                    userId,
                    orderAccepted
                }


            })


            res.status(200).json(userItems)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }


    static async fetchChosenItemId(req, res) {
        const path = req.route.path
        const strVal = path.replace('/:id', '').replace('/chosen', '')
        const id = req.params.id;


        try {
            const chosenItems = await getItems(strVal).find({ id });
            res.status(200).json(chosenItems);

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }


    static async getProcurerItems(req, res) {


        try {
            const { id, itemid, type } = req.query;
            const procurer = await Procurers.find({ id });
            let entries = Object.entries(procurer[0])
            let value = entries.filter(val => val[0] == '_doc')[0]
            let ingredients = value[1][type]
            let ingredientsDetails = ingredients.filter((val) => val.id == itemid)[0]
            res.status(200).json(ingredientsDetails);
        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }

    }


    static async deleteProcurerItems(req, res) {


        try {
            let array = {}
            const { id, itemid, type } = req.query;
            const procurer = await Procurers.find({ id });
            let entries = Object.entries(procurer[0])
            let value = entries.filter(val => val[0] == '_doc')[0]
            let ingredients = value[1][type]
            let indexOfItem = ingredients.findIndex((val) => val.id === itemid)
            ingredients.splice(indexOfItem, 1)
            array[type] = ingredients
            /**array -> {ingredients:  Array:ingredients} */
            await Procurers.updateOne({ id }, { $set: array })


            res.status(200).json('Product Deleted Sucessfully');
        } catch (err) {
            console.log(err);
            res.status(404).json({
                error: err
            })
        }

    }


    static async acceptOrder(req, res) {
        try {
            const cartId = req.params.id
            console.log({ cartId })
            const result = await Cart.updateOne({ _id: cartId }, { $set: { orderAccepted: true } })
            console.log({ result })
            res.status(201).json({ message: 'Updated Successfully' })
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: error.message })
        }

    }


    static async orderDelivered(req, res) {
        try {
            const cartId = req.params.id
            console.log({ cartId })
            const result = await Cart.updateOne({ _id: cartId }, { $set: { orderDelivered: true } })
            console.log({ result })
            res.status(201).json({ message: 'Updated Successfully' })
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: error.message })
        }

    }




    static async addItem(req, res) {
        const item = req.body;
        const id = req.params.id
        let object = {}
        object[item.path] = item
        try {
            await Procurers.updateOne({ id }, { $push: object })
            let procs = await Procurers.find({ id })

            res.status(201).json({ message: 'Post Created' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }


    static async editItem(req, res) {
        const { id, itemid } = req.query;
        const item = req.body;
        let procurer = await Procurers.find({ id })

        let entries = Object.entries(procurer[0])
        let value = entries.filter(val => val[0] == '_doc')[0]
        let items = value[1][item.path]
        let index = items.findIndex((val) => val.id == itemid)
        items[index] = item

        let object = {}
        object[item.path] = items

        try {
            await Procurers.updateOne({ id }, { $set: object })
            res.status(201).json({ message: 'Post Edited Sucessfully' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }






    }





    static async addProcurer(req, res) {
        const procurer = req.body;

        try {
            const result = await Procurers.create(procurer)
            res.status(201).json({ result })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

    static async editProcurer(req, res) {
        const procurer = req.body;
        const id = req.params.id


        try {
            await Procurers.updateOne({ id }, { $set: procurer })
            res.status(201).json({ message: 'Post Edited' })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }




    static async getInfo(req, res) {

        //req.body



        res.status(200).json({ message: 'Post Updated Sucessfully' })


    }

    static async getAllChatrooms(req, res) {
        const chatRoomarray = req.body
        getSelectedChatRooms(chatRoomarray).then(val => {
            res.status(201).json(val)
        }).catch(err => {
            res.status(404).json({ message: err.message })
        })
    }
}


/* 
db.users.insertOne({name:"A"})


[  db.users.updateOne({"comments":'{"id1":{"name":"2","number":3}}'})  ]


//to get All items
db.users.find()

//to insert many items
db.users.insertMany([{name:'A'},{name:'B'}])


//to limit to one search
db.users.find().limit(2)


// to limit and sort "name" in an alphabetical order
db.users.find().sort({name:1}).limit(2)

// to limit and sort "name" in the reverse alphabetical order
db.us
ers.find().sort({name:-1}).limit(2)

//to sort by "age" and sort by "name" ->[age] numerically and then [name]alphabetically
db.users.find().sort({age:1,name:1}).limit(2)


//to skip. this skips the first query
db.users.find().skip(1).limit(2)
 
QUERIES
//to find the name
db.users.find({name:"kyle"})

//to find age
db.users.find({age:26}) -> dont use "26" if its a number

//getting specific keys of an object -> name and age
db.users.find({name:"kyle"}, {name:1,age:1})

//if you dont want the id, you can specify -> _id
db.users.find({name:"kyle"}, {name:1,age:1, _id:0})

//if you dont want a key, you can specify -> age
db.users.find({name:"kyle"}, {age:0})

COMPLEX QUERIES
//find all names equal to sally
db.users.find({name:{$eq:"Sally"}})

//find all names not equal to sally
db.users.find({name:{$ne:"Sally"}})

//find all ages greater than 13
db.users.find({age:{$gt:13}})

//find all ages greater than or equal to 13
db.users.find({age:{$gte:13}})

//find all ages less than 
db.users.find({age:{$lt:13}})

//find all ages less than or equal to 13
db.users.find({age:{$lte:13}})


//find all names that are kyle and sally

db.users.find({name:{$in:["Kyle","Sally"]}})

//find all names that are not kyle and sally

db.users.find({name:{$nin:["Kyle","Sally"]}})

//check if key [age] exists -> returns objects that have age as a key
db.users.find({age:{$exists:true}})

#note -> if key is equal to null, it still exists

//check if key [age] does not exists -> returns objects that do not have age as a key
db.users.find({age:{$exists:false}})


COMBINED QUERIES

//users that have age greater than or equal to 20 and 
less than or equal to 40

db.users.find({age:{$gte:20,$lte:40}})


//users that have age greater than or equal to 20 and 
less than or equal to 40 and the name has to be sally
db.users.find({age:{$gte:20,$lte:40}, name:"Sally"})

//doing "and" queries
it gets you the ages and the names that are selected
db.users.find({$and:[{age:26},{name:"Kyle"}]})

//doing "or" queries
it gets you the ages that are less than 20 or the names that are selected
db.users.find({$or:[{age:{$lte:20}},{name:"Kyle"}]})


//get users that their age is "not" less than or equal to 20
db.users.find({age:{$not:{$lte:20}}})


COMPARING TO DATA OBJECT
{name:"Tom",balance:100,debt:200},{name:"Kristin",balance:20,debt:0}

Lets see where the debt is greater than the balance
  
db.users.find({$expr:{$gt:["$debt","$balance"]}}) -> Tom

EXTRA KNOWLEDGE
to get object properties or keys in objects

//This would get the key in the address object

#you can query further with this format based on the above examples

db.users.find({"address.street":"123 Main St"})


//find one

db.users.findOne({age:{$lte:40}})

//you can count documents

db.users.countDocuments({age:{$lte:40}}) -> 2




UPDATING DATA

//You can use $set to set new values
db.users.updateOne({_id:ObjectId("skjnskdj")},{$set:{age:27}})

and just to search, you can use this command
db.users.findOne({_id:ObjectId('skjnskdj')})


//INCREMENT
You can also use $inc to increment the user values

db.user.updateOne({_id:ObjectId('fsf')},{$inc:{age:3}})
if "age was" 3 , now it would be "6" because 3 + 3 = 6


//RENAME KEY
//You can use $rename to set new values
db.users.updateOne({_id:ObjectId("sfss")},{$rename:{name:"firstName"}})

//REMOVING A KEY or Object property
//You can use $unset to set new values
db.users.updateOne({_id:ObjectId("sjkj")},{$unset:{age:""}})


//ARRAY MANIPULATION

hobbies:["Weight Lifting","Bowling"]

//adding to array list
db.users.updateOne({_id:ObjectId("dsds")},{$push:{hobbies:"Swimming"}})

//removing from array list
db.users.updateOne({_id:ObjectId("dsds")},{$pull:{hobbies:"Swimming"}})

using queries
you can say remove everything less than or equal to the value of 3 in 
//-> My Edit
db.users.updateOne({_id:ObjectId("dsds")},{$pull:{hobbies:{$gte:3}}})

#note the queries in mongodb work anywhere in mongodb


//check if all users have an address and then delete address field -> using updateMany
db.users.updateMany({address:{$exists:true}},{$unset:{address:""}})


You can replace entire objects with this style

db.users.replaceOne({age:30},{name:"John"})


DELETE METHODS

db.users.deleteOne({name:"John"})

db.users.deleteMany({age:{$exists:false}})

*/