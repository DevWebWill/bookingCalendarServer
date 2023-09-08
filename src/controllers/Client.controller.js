import User from "../models/User.model.js"
import Client from "../models/Client.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const create = async (req, res) => {
    const { name, phone, email } = req.body;
    
    //Validación para verificar que existen los parámetros necesarios
    if(!name || !phone) {
        return res.status(422).json({'message': 'Faltan parámetros'});
    }

    //Chequea si el usuario existe
    const takenEmail = await Client.exists({email: email}).exec();

    /* if(takenEmail) {
        return res.status(409).json({'message': 'Este usuario ya existe'});
    } */

 
    const dbClient = new Client({
        name: name,
        phone: phone,
        email: email
    });

    const newClient = await dbClient.save();

    return res.status(201).json({message: 'Registro finalizado con éxito.'});

    
}



export const user = async (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
}