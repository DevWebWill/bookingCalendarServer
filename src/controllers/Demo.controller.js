import Demo from "../models/Demo.model.js";

export const setDemo = async (req, res) => {
    const obj = req.body
    const demo = obj.demo

    console.log("***************", demo)

    const docDemo = new Demo({
        name: demo.name,
        lastname: demo.lastname
    })
            
    docDemo.save()
    res.json({
        status: 200,
        data: docDemo,
        message: 'Demo creado con éxito'
    })       
}

export const getDemos = async (req, res) => {

    Demo.find().then(collectionDemo => {
        if(!collectionDemo) {
            return res.json({
                status: 404,
                message: 'No existen Demos'
            });
        } else {
            return res.json({
                status: 200,
                demos: collectionDemo,
                message: "Listado de Demos"
            });
        }
    });
    
}