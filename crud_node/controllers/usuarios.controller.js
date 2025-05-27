const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../data/usuarios.json')

const readUsers = () => {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
}

let usuarios = readUsers()


const writeUsers = (usuarios) => {
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2))
}

// get 
const getUsers = ((req, res) => {
    res.json(usuarios)
})

// get por id 
const getUserById = ((req, res) => {
    const usuario = usuarios.find(item => item.id == req.params.id)

    /* por si no encuentro */
    if (!usuario) return res.json({status: 404, message: "Usuario no encontrado"})

    /* si encuentro */
    res.json(usuario)
})

// post 
const createUser = ((req, res) => {
    const nuevoUsuario = req.body

    const email = nuevoUsuario.email

    // Validar que el email no esté vacío o incompleto 
    if (!email || email.trim() === '') {
        return res.status(400).json({ status: 400, message: "El Email está vacío" })
    }

    // Validar que el email no esté repetido,
    // busco coincidencias con some
    // si devuelve true está repetido
    const emailExiste = usuarios.some(usuario => usuario.email === email)
    if (emailExiste) {
        return res.status(400).json({ status: 400, message: "El Email ya está registrado" })
    }


    nuevoUsuario.id = usuarios.length + 1 /* para aumentar su id */

    usuarios.push(nuevoUsuario)
    writeUsers(usuarios)

    res.json(usuarios)
})

// put 
const updateUser = ((req, res) => {
    /* obtengo el usuario */ 
    const usuario = usuarios.find(item => item.id == req.params.id)
    
    /* por si no encuentro */
    if (!usuario) return res.json({status: 404, message: "Usuario no encontrado"})
    
    /* desestructuro el objeto para manejarlo */
    const {name, email, age, address} = req.body
    
    /* creo el nuevo usuario */
    usuario.name = name || usuario.name 
    usuario.email = email || usuario.email
    usuario.age = age || usuario.age
    usuario.address = address || usuario.address

    writeUsers(usuarios)
    
    res.json(usuarios)
})

// delete  
const deleteUser = ((req,res) => {
     /* obtengo el usuario */ 
    let usuario = usuarios.find(item => item.id == req.params.id)
    
     /* por si no encuentro */
    if (!usuario) return res.json({status: 404, message: "Usuario no encontrado"})

    usuarios = usuarios.filter(item => item.id !== parseInt(req.params.id))

    writeUsers(usuarios)

    res.json(usuarios)
})


module.exports={
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser
}