const cds = require("@sap/cds");
const { UPDATE } = require('@sap/cds/lib/ql/cds-ql');

const updateActiveStatus = async(EmailId)=>{
  try{
    const { SSIUserDetails } = cds.entities;
    
    await UPDATE.entity(SSIUserDetails)
        .set({ 'IsActive': 'Not' })
        .where({ EmailId });

    return true;
  }catch(err){
    throw err;
  }
}

module.exports = {updateActiveStatus};