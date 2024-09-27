import User from "../models/User.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createSlug } from "./utils.js";
import { transporter } from "../config/mailer.js";

export const register = async (req, res) => {
    const { email, name, password, password_confirm } = req.body;
    
    //Validación para verificar que existen los parámetros necesarios
    if(!email || !name || !password || !password_confirm) {
        return res.status(422).json({'message': 'Invalid fields'});
    }

    //Validación para verificar la confirmación de la contraseña
    if(password !== password_confirm) {
        return res.status(422).json({'message': 'Password do not match'});
    }

    //Otras validaciones
    //...

    //Chequea si el usuario existe
    const takenEmail = await User.exists({email: email}).exec();

    if(takenEmail) {
        return res.status(409).json({'message': 'Este usuario ya existe'});
    } else {

        try {
            let hashedPassword = await bcrypt.hash(password, 10);

            const dbUser = new User({
                username: name,
                slug: createSlug(name),
                email: email,
                first_name: name,
                password: hashedPassword,
                roles: ['ROLE_ADMIN']
            });

            await dbUser.save();

            return res.status(201).json({message: 'Registro finalizado con éxito.'});

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Hubo un error al intentar el registro.'});
        }
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    //Validación para verificar que existen los parámetros necesarios
    if(!email || !password) {
        return res.status(422).json({'message': 'Invalid fields'});
    }

    User.findOne({email: email}).then(dbUser => {
        if(!dbUser) {
            return res.status(401).json({
                message: "Usuario o contraseña inválidos.."
            })
        }

        main().catch(console.error);

        bcrypt.compare(password, dbUser.password).then(isCorrect => {
            if(isCorrect) {
                const payload = {
                    id: dbUser._id,
                    email: dbUser.email
                }

                //Token de actualización
                const refreshToken = jwt.sign(
                    payload,
                    process.env.JWT_REFRESH,
                    {expiresIn: 86400}
                );

                //Guardamos el token de actualización en la BD
                dbUser.refresh_token = refreshToken;
                dbUser.save();

                //Creamos una cookie con el token de actualización
                /** Poner los parámetros { sameSite y secure } cuando trabajo con una app frontend */
                //res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
                /** Se eliminan los parámetros para poder probar la api con Postman */
                res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });

                let full_record = dbUser.full_record;
                //console.log(full_record);
                
                //Token de acceso
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token) => {
                        if(err) return res.json({message: err})

                        res.cookie('secret_token', token, { httpOnly: true, maxAge: 24*60*60*1000 });

                        return res.json({
                            full_record: full_record,
                            message: 'Success',
                            token: token
                        })
                    }
                )

                
            } else {
                return res.status(401).json({
                    message: 'Usuario o contraseña inválidos.'
                })
            }
        })
    })
}

export const logout = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies.refresh_token) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.refresh;
    const user = await User.findOne({ refresh_token: refreshToken }).exec();

    if(!user) {
        /** Poner los parámetros { sameSite y secure } cuando trabajo con una app frontend */
        //res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
        /** Se eliminan los parámetros para poder probar la api con Postman */
        res.clearCookie('refresh_token', { httpOnly: true });
        return res.sendStatus(204);
    }

    user.refresh_token = null;
    await user.save();

    /** Poner los parámetros { sameSite y secure } cuando trabajo con una app frontend */
    //res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
    /** Se eliminan los parámetros para poder probar la api con Postman */
    res.clearCookie('refresh_token', { httpOnly: true });
    return res.sendStatus(204);
}

export const refresh = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies.refresh_token) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.refresh_token;

    const user = await User.findOne({ refresh_token: refreshToken }).exec();

    if(!user) {
        return res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH,
        (error, decoded) => {
            if(error || user._id.toString() !== decoded.id || user.email !== decoded.email) {
                return res.sendStatus(403);
            }

            const payload = {
                id: user._id,
                email: user.email
            }

            //Token de acceso
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 86400},
                (err, token) => {
                    if(err) return res.json({message: err})

                    res.cookie('secret_token', token, { httpOnly: true, maxAge: 24*60*60*1000 });
                    
                    return res.json({
                        message: 'Success',
                        token: token
                    })
                }
            )
        }
    )
}

export const complete = async (req, res) => {
    const { user, company, type_entity, website, country, type_of_trade } = req.body;
    
    //Validación para verificar que existen los parámetros necesarios
    if(!user, !company || !type_entity || !website || !country || !type_of_trade) {
        return res.status(422).json({'message': 'Invalid fields'});
    }

    let slug = createSlug(company);
    const filter = { _id: user };
    const update = { 
        company: company, 
        slug: slug, 
        type_entity: type_entity, 
        website: website, 
        country: country, 
        type_of_trade: type_of_trade,
        full_record: true

    };
    let doc = await User.findOneAndUpdate(filter, update);

    if(doc === null) {
        return res.json({
            status: 'Failed',
            data: doc,
            message: 'El usuario no se ha encontrado.'
        });    
    }

    return res.json({
        status: 'Success',
        data: doc,
        message: 'Ha completado el registro exitosamente'
    });  
}

export const user = async (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
}

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Booxita" <soporte@booxita.com>', // sender address
        //to: "dev.web.will@gmail.com, baz@example.com", // list of receivers
        to: "dev.web.will@gmail.com", // list of receivers
        subject: "Alerta de inicio de sesión", // Subject line
        //text: "Se ha iniciado sesión en Booxita", // plain text body
        html: "<b>Se ha iniciado sesión en Booxita.</b>", // html body
    });
  
    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  