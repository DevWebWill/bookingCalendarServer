import mongoose from 'mongoose';

async function connect() {
    try {
        //const PORT = process.env.PORT || 27017;
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch((error) => console.log(`No se pudo conectar: ${error}`))
    } catch (error) {
        
    }
}

export default connect

/** MONGOOSE SETUP */

