const mongoose=require('mongoose');
const { CONNSTRING }=require('../config/index');
// const connectionString="mongodb+srv://mw9977720:Pi4E6XmBViJGx0W8@azeem-estate.idaurtk.mongodb.net/mw9977720?retryWrites=true&w=majority";

const dbConnect= async ()=>{
  
    try {
       const conn= await mongoose.connect(CONNSTRING);
        console.log(`database connected with host: ${conn.connection.host}`);

    } catch (error) {
        console.log(`database not connected. Please check require maintiances`);
    }
}


module.exports=dbConnect;