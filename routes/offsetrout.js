const express= require('express');
const authcontroller=require('../controller/authcontroller');
const router= express.Router();
const auth=require('../middlewares/offsetuserauth');


router.get('/admin-page', (req, res, next) => {
    if (req.user.role === 'admin') {
        // //update
// router.post('/update', authcontroller.update);

// //read by admin
// router.post('/readAllUser', authcontroller.readAllUser);

// //delete by admin
// router.post('/deleteUser', authcontroller.deleteUser);
    } else {
        // User does not have admin role, deny access
        const error = {
            status: 403,
            message: 'Forbidden'
        };
        next(error);
    }
});