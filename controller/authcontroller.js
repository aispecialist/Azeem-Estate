const Joi = require("joi");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const mobileNumberPattern = /^\d{11}$/;
const rolepattern= /^(admin|customer)$/ ;
const authcontroller = {
  async register(req, res, next) {
   
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().max(30).required(),
      mobileNumber: Joi.string().regex(mobileNumberPattern).required(),
      email: Joi.string().email().required(),
      role:Joi.string().regex(rolepattern).required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const { username, mobileNumber, email, password,role } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const mobileNumberInUse = await User.exists({ mobileNumber });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };

        return next(error);
      }

      if (mobileNumberInUse) {
        const error = {
          status: 409,
          message: "Mobile Number is already registered, use another Mobile Number!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db
    
    let accessToken;
    let refreshToken;

  
   

    let user;

    try {
      const userToRegister = new User({
        username,
        email,
        mobileNumber,
        role,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id );

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // 6. response send

    const userDto = new UserDTO(user);

    return res.status(201).json({ user: userDto, auth: true });
  
},

  //  async update(){ 
  //   console.log('user is updated');
  //   },
  async login(req, res, next) {
   
    // 2. if validation error, return error
    // 3. match wand password
    // 4. return response

    // we expect input data to be in such shape
    // 1. validate user input
    const userLoginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

     let user;  

    try {
      // match email
       user = await User.findOne({ email: email });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid email or password",
        };

        return next(error);
      }

      // match password
      // req.body.password -> hash -> match

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid email or password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
//     async refresh(){
//         console.log('user is refreshed');
//     } ,
//     async readUser(){
//       try {
//         const authorizedbyRole = await User.findOne({ role: "admin" });
//         if(authorizedbyRole){
//           const users = await User.find();
//           const userDto = new UserDTO(users);
//           return res.status(200).json({ usera: userDto, authorize: true });
//         }
//       else if (!authorizedbyRole){
//         const error = {
//           status: 401,
//           message: "You are not authorized",
//         }
// }
//       } catch (error) {
//         return next(error);
//       }
      
     
//      },
//     async deleteUser(){
//         console.log('user is  deleteUser');
//     } ,
async logout(req, res, next) {
  // 1. delete refresh token from db
  const { refreshToken } = req.cookies;

  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (error) {
    return next(error);
  }

  // delete cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // 2. response
  res.status(200).json({ user: null, auth: false });
  
},
async refresh(req, res, next) {
  // 1. get refreshToken from cookies
  // 2. verify refreshToken
  // 3. generate new tokens
  // 4. update db, return response

  const originalRefreshToken = req.cookies.refreshToken;

  let id;
 
  try {
    id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
  } catch (e) {
    const error = {
      status: 401,
      message: "Unauthorized",
    };

    return next(error);
  }

  try {
    const match = RefreshToken.findOne({
      _id: id,
      token: originalRefreshToken,
    });

    if (!match) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }
  } catch (e) {
    return next(e);
  }

  try {
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    await RefreshToken.updateOne({ _id: user._id }, { token: refreshToken });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
  } catch (e) {
    return next(e);
  }

  const user = await User.findOne({ _id: id });

  const userDto = new UserDTO(user);

  return res.status(200).json({ user: userDto, auth: true });
},


}

module.exports = authcontroller;