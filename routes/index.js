const express= require('express');
const authcontroller=require('../controller/authcontroller');
const router= express.Router();
const propertycontroller=require('../controller/propertycontroller');
const auth=require('../middlewares/auth');
//testing

router.get('/', (req, res) => {
    res.send('Hello World! working on updated code');
  })

////user



//register
router.post('/register', authcontroller.register);

// //login

router.post('/login', authcontroller.login);
// //update
// router.post('/update', authcontroller.update);

// //read by admin
// router.post('/readUser', authcontroller.readUser);

// //delete by admin
// router.post('/deleteUser', authcontroller.deleteUser);

// //refresh
// router.post('/refresh', authcontroller.refresh);
// logout
router.post('/logout', authcontroller.logout)

// //property...

// //creat
router.post('/property', auth , propertycontroller.create)
// //update
// router.put('/property/all',auth, propertycontroller.update)
// // //read all property
// router.get('/property/all',auth, propertycontroller.getAll)
// // //get property by id
// router.get('/property/:id',auth, propertycontroller.getById)
// // //delete
// router.delete('/property/:id',auth, propertycontroller.delete)

// //comment


// //creat

// //update


// //read


// //read comment by property id

// //delete by user


module.exports=router;