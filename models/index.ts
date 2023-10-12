import { Sequelize } from 'sequelize';
import { SEQUELIZE_CONFIG } from '../sequalizeConfig/seq.config';



const sequelize = new Sequelize(SEQUELIZE_CONFIG.database, SEQUELIZE_CONFIG.username, SEQUELIZE_CONFIG.password, {
  host:SEQUELIZE_CONFIG.host,
  dialect:'mysql',
});


export async function authenticateDB() {
    try{

        await sequelize.authenticate();
        console.log("connection established")
    
    }catch(error){
    
        console.log("error")
    }
    
}

authenticateDB();


export default sequelize;