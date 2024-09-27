import mongoose from "mongoose";
import Task from "../models/Task.model.js";
import Client from "../models/Client.model.js"
import { createSlug, formatDateToDDMMYYYY, parseDDMMYYYYToDate } from "./utils.js";

import User from "../models/User.model.js";

// Lista todos los horarios disponibles
export const list = async (req, res, company) => {
    const date = new Date();
    const rangeDate = req.query.range_date || formatDateToDDMMYYYY(date) + "-" + formatDateToDDMMYYYY(new Date(date.getTime() + (8 * 24 * 60 * 60 * 1000)));
    
    const dates = rangeDate.split("-");
    let startDate = parseDDMMYYYYToDate(dates[0]);
    let endDate = parseDDMMYYYYToDate(dates[1]);

    let id = null;
    User.findOne({ slug: company }).then(data => {
        if(!data) {
            return res.status(404).json({'message': 'No se encontró el registro.'});
        } else {
            Task.find({ 
                user: data._id,
                date: {
                    $gte: startDate, // Fecha de inicio
                    $lte: endDate    // Fecha de fin
                }
                /* $expr: {
                    $eq: [{ $year: "$date" }, year],
                    $eq: [{ $month: "$date" }, month]
                } */
            }).then(data => {
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

// Crea horarios de reserva disponibles
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
}

export const update = async (req, res) => {
    
}


// Elimina un horario de reserva. TO DO Verificar que no este reservado ya
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

// Reservar horario
export const booking = async (req, res) => {
    const { name, phone, email, booking } = req.body;
    let number_res = 1
    
    //Validación para verificar que existen los parámetros necesarios
    if(!name || !phone) {
        return res.status(422).json({'message': 'Faltan parámetros'});
    }

    

    const filter = { 
        _id: booking,
        $expr: {
            $gte: ['$reservations_available', '$number_of_reserved' + number_res ] // Compara los dos campos
        },
        availability: 'Disponible'
    };

    let doc = await Task.findOne(filter);

    if(!doc) {
        return res.json({
            status: 'Failed',
            data: doc,
            message: 'La reserva no se pudo completar.'
        });
    }

    const dbClient = new Client({
        name: name,
        phone: phone,
        email: email,
        task: booking
    });
    await dbClient.save();

    let update = {}
    if(doc.reservations_available > doc.number_of_reserved + number_res) {
        update = { 
            $inc: { 'number_of_reserved': number_res },
            availability: 'Disponible'
        };
    } else {
        update = { 
            $inc: { 'number_of_reserved': number_res },
            availability: 'Ocupado'
        };
    }
    let docUpdate = await Task.findOneAndUpdate(filter, update, { new: true });

    if(!docUpdate) {
        return res.json({
            status: 'Failed',
            data: docUpdate,
            message: 'La reserva no se pudo completar.'
        });    
    }

    return res.json({
        status: 'Success',
        data: docUpdate,
        message: 'Reserva realizada con éxito'
    });  
}