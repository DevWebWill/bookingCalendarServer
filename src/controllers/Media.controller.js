import mongoose from "mongoose";
import Media from "../models/Media.model.js";
import fs from 'fs';
import path from 'path';

// Endpoint para recibir la imagen
export const uploadImages = async (req, res) => {

    if (!req.files || req.files.length === 0) {
        res.status(400).send('No se han enviado archivos');
    } else {
        //req.files.map(file => ({name: file.filename}));

        const Media = mongoose.model('Media');

        const media_array = req.files.map(file => (
            new Media({
                name: file.filename,
                mimetype: file.mimetype,
                destination: file.destination
            })
        ));
        
        
        Media.insertMany(media_array)
            .then(() => {
                console.log('Archivos guardados');
            })
            .catch((error) => {
                console.error('Error al guardar los artículos:', error);
            });  

        res.status(200).send({message: 'Archivos recibidos y guardados correctamente'});
    }
      
    //Opcion
    /* if (!req.headers['content-type'].startsWith('multipart/form-data')) {
        res.status(400).send('La solicitud no es de tipo multipart/form-data');
        return;
    }
    
    // Verificar que la solicitud tenga un cuerpo (body)
    if (!req.readable) {
        res.status(400).send('No se ha enviado ninguna imagen');
        return;
    }

    let data = Buffer.from('');

    req.on('data', chunk => {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', () => {
        // Guardar la imagen en el disco
        const filename = 'uploaded_image.jpg'; // Nombre del archivo a guardar
        fs.writeFile(filename, data, err => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al guardar la imagen en el servidor');
            } else {
                console.log('Imagen guardada:', filename);
                res.status(200).send('Imagen recibida y guardada correctamente');
            }
        });
    }); */
}

export const getMedia = async (req, res) => {
    //Buscamos una colleccion de Media y excluimos la propiedad "destination de los documentos"
    Media.find({}, '-destination').then(collectionMedia => {
        if(!collectionMedia) {
            return res.json({
                status: 404,
                message: 'No existen Archivos'
            });
        } else {
            return res.json({
                status: 200,
                collectionMedia: collectionMedia,
                message: "Listado de Archivos"
            });
        }
    });
    
}

export const deleteMedia = async (req, res) => {
    const body = req.body;
    const Media = mongoose.model('Media');

    let eliminado = false;

    Media.findOne({ _id: body.id }).then((media) => {
        if(!media) {
            return res.sendStatus(404);
        } else {
            const imagePath = path.join(__dirname, 'public', 'media', media.name);

            //Eliminando archivo del servidor
            fs.unlink(imagePath, (err) => {
                if (err) {
                    return res.json({
                        status: 400,
                        message: 'El archivo no se pudo eliminar'
                    });
                } else {
                    //Eliminar archivo de la Base de Datos
                    Media.findOneAndRemove({ _id: body.id }).then(() => {
                        return res.json({
                            status: 200,
                            message: 'Archivo eliminado con éxito'
                        });
                    });
        
                }
            });
        }
        
    });

    
}