import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  FactoryAddress: {
        type: String, 
    },
    CorporateAddress: {
        type: String, 
    },
    SalesAddress: {
        type: String, 
    },
    addresslink:{
        type:String,
    },
    phoneNo: {
        type: String,
       
    },
    location:{
        type:String,
       
    },
    email: {
        type: String,
       
    },
    email2: {
        type: String,
       
    },
    
    description:{
        type:String,
    }
 
});

const Footer = mongoose.models.Footer || mongoose.model('Footer', footerSchema);

export default Footer;
