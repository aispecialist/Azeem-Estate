const mongoose= require("mongoose");
const {Schema}=mongoose;


const propertySchema=new Schema({
    imagePath1:{type:String, require:true},
    imagePath2:{type:String, require:true},
    imagePath3:{type:String, require:true},
    imagePath4:{type:String, require:true},
    imagePath5:{type:String, require:true},
    imagePath6:{type:String, require:true},
    imagePath7:{type:String, require:true},
    honor:{type:mongoose.SchemaTypes.ObjectId, ref:'users'},
    houseNumber:{type:String, require:true},
    mohala:{type:String, require:true},
    area:{type:String, require:true},
    town:{type:String, require:true},
    city:{type:String, require:true},
    amountAsked:{type:String, require:true},
    amountAdvance:{type:String, require:true},
    type:{type:String, require:true},
},
{timestamps:true},
);

module.exports=mongoose.model('Property',propertySchema,'property');
