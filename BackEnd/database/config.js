require('dotenv').config()
const mongoose = require('mongoose');




 const dbconection = async() => {

    try {
    //cadena de conexion a base de datos
        await mongoose.connect(process.env.DB_CNN,{                    
     
        });
      
        console.log('Se esta subiendo bien')

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbconection
}



// se instalo moongose, dotenv, nodemon , cors