const Joi=require('joi');
const fs=require('fs');
const Property = require("../models/property");
const { BACKEND_SERVER_PATH }=require('../config/index');
const PropertyDTO= require('../dto/property');
const propertycontroller={

    async create(req,res,next){
//    1-validate req body
 // client side -> base64 encoded string -> decode -> store -> save photo's path in db
            const creatPropertySchema=Joi.object({
               
                honor:Joi.string().required('Your exact name is required'),
                houseNumber:Joi.string().required('House Number is required'),
                mohala:Joi.string().required('mohala is required'),
                area:Joi.string().required('area is required'),
                town:Joi.string().required('town is required'),
                city:Joi.string().required('city is required'),
                amountAsked:Joi.string().required('Amount Asked is required'),
                amountAdvance:Joi.string().required('Amount Advance is required'),
                type:Joi.string().required('please mention either what type of property do you have'),
                photo1:Joi.string().required('Image is required'),
                photo2:Joi.string().required('Image is required'),
                photo3:Joi.string().required('Image is required'),
                photo4:Joi.string().required('Image is required'),
                photo5:Joi.string().required('Image is required'),
                photo6:Joi.string().required('Image is required'),
                photo7:Joi.string().required('Image is required'),
            })

            const { error } = creatPropertySchema.validate(req.body);
            if (error) {
                return next(error);
              }
          
              const { honor, houseNumber, mohala, area, town, city,amountAsked,amountAdvance,type,photo1,photo2,photo3,photo4,photo5,photo6,photo7 } = req.body;
//    2-handle photo
// read as buffer
    const buffer1 = Buffer.from(
      photo1.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    // allot a random name
    const imagePath1 = `${Date.now()}-${honor}.png`;
    // read as buffer
    const buffer2 = Buffer.from(
        photo2.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allot a random name
    const imagePath2 = `${Date.now()}-${honor}.png`;
    // read as buffer
      const buffer3 = Buffer.from(
        photo3.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allot a random name
    const imagePath3 = `${Date.now()}-${honor}.png`;
    // read as buffer
      const buffer4 = Buffer.from(
        photo4.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allot a random name
    const imagePath4 = `${Date.now()}-${honor}.png`;
    // read as buffer
      const buffer5 = Buffer.from(
        photo5.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allot a random name
    const imagePath5 = `${Date.now()}-${honor}.png`;
    // read as buffer
      const buffer6 = Buffer.from(
        photo6.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allot a random name
    const imagePath6 = `${Date.now()}-${honor}.png`;
    // read as buffer
      const buffer7 = Buffer.from(
        photo7.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
// allot a random name
const imagePath7 = `${Date.now()}-${honor}.png`;
  // save to cloudinary
  let response;

  try {
    // response = await cloudinary.uploader.upload(photo);
    fs.writeFileSync(`storage/${imagePath1}`, buffer1);
    fs.writeFileSync(`storage/${imagePath2}`, buffer2);
    fs.writeFileSync(`storage/${imagePath3}`, buffer3);
    fs.writeFileSync(`storage/${imagePath4}`, buffer4);
    fs.writeFileSync(`storage/${imagePath5}`, buffer5);
    fs.writeFileSync(`storage/${imagePath6}`, buffer6);
    fs.writeFileSync(`storage/${imagePath7}`, buffer7);
  } catch (error) {
    return next(error);
  }
    
//    3-add to db
let newProperty;
try {
    newProperty = new Property({
    honor,
    houseNumber,
    mohala,
    area,
    town,
    city,
    amountAsked,
    amountAdvance,
    type,
    imagePath1: `${BACKEND_SERVER_PATH}/storage/${imagePath1}`,
    imagePath2: `${BACKEND_SERVER_PATH}/storage/${imagePath2}`,
    imagePath3: `${BACKEND_SERVER_PATH}/storage/${imagePath3}`,
    imagePath4: `${BACKEND_SERVER_PATH}/storage/${imagePath4}`,
    imagePath5: `${BACKEND_SERVER_PATH}/storage/${imagePath5}`,
    imagePath6: `${BACKEND_SERVER_PATH}/storage/${imagePath6}`,
    imagePath7: `${BACKEND_SERVER_PATH}/storage/${imagePath7}`,
  });

  await newProperty.save();
} catch (error) {
  return next(error);
}

const propertyDto = new PropertyDTO(newProperty);

//    4-return response
return res.status(201).json({ property: propertyDto });

    },
    // async update(req,res,next){

    // },
    // async getAll(req,res,next){

    // },
    // async getById(req,res,next){

    // },
    // async delete(req,res,next){

    // },

}


module.exports=propertycontroller;