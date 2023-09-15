import mongoose from "mongoose";
import Task from "../models/Task.model.js";
import Client from "../models/Client.model.js"
import createSlug from "./utils.js";
import User from "../models/User.model.js";

export const list = async (req, res, company) => {
    let id = null;
    User.findOne({ slug: company }).then(data => {
        if(!data) {
            return res.status(404).json({'message': 'No se encontró el registro.'});
        } else {
            Task.find({ user: data._id }).then(data => {
                if(!data) {
                    return res.status(404).json({'message': 'No se encontró el registro.'});
                } else {
                    return res.json({
                        status: 'Success',
                        data: data,
                        message: "Listado de registros"
                    });
                }
            });
        }
    })

    
}

export const create = async (req, res) => {
    let docs = req.body;

    let nonexistenceArray = [];
    let existenceArray = [];

    for (const element of docs) {
        try {
            const item = await Task.exists({user: element.user, date: element.date}).exec();
            console.log('Existe: ', item);
            if (item) {
                existenceArray.push(element);
            } else {
                nonexistenceArray.push(element);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    console.log('Array: ', nonexistenceArray)
    if(nonexistenceArray.length > 0) {
        await Task.insertMany(nonexistenceArray)
        .then((data) => {
            return res.json({
                status: 'Success',
                data: data,
                message: 'Horarios de reservas cargados con éxito.'
            });
        })
        .catch((error) => {
            return res.json({
                status: 'Failed',
                data: error,
                message: 'Error al intentar guardar.'
            });
        });
    } else {
        return res.json({
            status: 'Failed',
            data: 'Nada para insertar',
            message: 'No se pudo guardar. El horario ya estaba disponible.'
        })
    }
    /* const Task = mongoose.model('Task');
    await Task.insertMany(docs)
        .then((data) => {
            return res.json({
                status: 'Success',
                data: data,
                message: 'Archivos recibidos y guardados correctamente.'
            });
        })
        .catch((error) => {
            return res.json({
                status: 'Failed',
                data: error,
                message: 'Error al intentar guardar.'
            });
        });   */

        /* return res.json({
            status: 'Success',
            data: 'hola',
            message: 'Archivo eliminado con éxito'
        }) */
}

export const update = async (req, res) => {
    
}

export const deleteTask = async (req, res) => {
    let body = req.body;

    const Task = mongoose.model('Task');

    Task.findOneAndRemove({ _id: body.id, user: body.user }).then(() => {
        return res.json({
            status: 'Success',
            data: body,
            message: 'Archivo eliminado con éxito'
        });
    }).catch((e) => {
        return res.status(404).json({'message': 'No se encontró el registro.'});
    });
}

export const booking = async (req, res) => {
    const { name, phone, email, booking } = req.body;
    
    //Validación para verificar que existen los parámetros necesarios
    if(!name || !phone) {
        return res.status(422).json({'message': 'Faltan parámetros'});
    }

    //const takenEmail = await Client.exists({email: email}).exec();

    const dbClient = new Client({
        name: name,
        phone: phone,
        email: email
    });
    const newClient = await dbClient.save();

    const filter = { _id: booking, client: null };
    const update = { client: newClient._id, availability: 'Ocupado' };
    let doc = await Task.findOneAndUpdate(filter, update);

    if(doc === null) {
        return res.json({
            status: 'Failed',
            data: doc,
            message: 'La reserva no se pudo completar.'
        });    
    }

    return res.json({
        status: 'Success',
        data: doc,
        message: 'Reserva realizada con éxito'
    });  
}