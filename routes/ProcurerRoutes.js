const express = require('express')
const router = express.Router();
const API = require('../controllers/ProcurerApi');
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



//
//Get All Doctors in Pagination


router.post("/sendmail/",upload,API.sendMail)
router.patch('/add-item/:id',upload,API.addItem)
router.patch('/edit-item',upload,API.editItem)

router.post('/add-procurer',upload,API.addProcurer)
router.patch('/edit-procurer/:id',upload,API.editProcurer)


router.get('/getinfo',API.getInfo)
router.get("/chosenprocurers/:id",API.fetchChosenItemId)

router.post("/cartheaders",upload,API.getCartHeaders)

router.get("/items",API.getProcurerItems)
router.delete("/items",API.deleteProcurerItems)
router.get("/accept-order/:id",API.acceptOrder)
router.get("/order-delivered/:id",API.orderDelivered)
router.post("/get-all-chatrooms",upload,API.getAllChatrooms)


router.post("/create-user",upload,API.createUser)
router.post("/email-otp/:id",upload,API.emailOTPProcess)
router.post("/verify-otp",upload,API.verifyOTP)
router.post("/register-user-details",upload,API.registerUserMethod)
router.get("/fireid/:id",API.getUserWithFirebaseid)






module.exports = router