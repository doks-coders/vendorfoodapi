const express = require('express')
const router = express.Router();
const API = require('../controllers/api');
const multer = require('multer');
let storage = multer.diskStorage({
    destination:function(req,file,cb){
     cb(null, '.././client/public');  
    // cb(null, './uploads');   
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})

let upload = multer({
    storage:storage,
}).single("image");

router.get("/allitems/",API.fetchAllItems)

router.get("/chosenrecipes",API.fetchChosenItem)
router.get("/chosenequipments",API.fetchChosenItem)
router.get("/chosenproducts",API.fetchChosenItem)
router.get("/chosenprocurers",API.fetchChosenItem)

router.get("/chosenrecipes/:id",API.fetchChosenItemId)
router.get("/chosenproducts/:id",API.fetchChosenItemId)
router.get("/chosenequipments/:id",API.fetchChosenItemId)
router.get("/chosenprocurers/:id",API.fetchChosenItemId)
router.get("/selecteduser/:id",API.getSelectedUser)

router.get("/choseningredients",API.fetchProductItem)
router.get("/chosenutensils",API.fetchProductItem)

//Get All User in Pagination




module.exports = router