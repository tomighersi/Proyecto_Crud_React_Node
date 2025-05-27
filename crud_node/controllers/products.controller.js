const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../data/products.json')

const readProducts = () => {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
}

let productos = readProducts()


const writeProducts = (productos) => {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2))
}

// get 
const getProducts = ((req, res) => {
    res.json(productos)
})

// get por id 
const getProductById = ((req, res) => {
    const producto = productos.find(item => item.id == req.params.id)

    /* por si no encuentro */
    if (!producto) return res.json({status: 404, message: "producto no encontrado"})

    /* si encuentro */
    res.json(productos)
})

// post 
const createProduct = ((req, res) => {
    const nuevoproducto = req.body

    const price = nuevoproducto.price

    // Validar que el price no esté vacío o incompleto 
    if (!price || price === null || price === undefined ||  price < 1) {
        return res.status(400).json({ status: 400, message: "El price está vacío o es incorrecto" })
    }


    nuevoproducto.id = productos.length + 1 /* para aumentar su id */

    productos.push(nuevoproducto)
    writeProducts(productos)

    res.json(productos)
})

// put 
const updateProduct = (req, res) => {
    const producto = productos.find(item => item.id == req.params.id);

    if (!producto) {
        return res.status(404).json({ status: 404, message: "Producto no encontrado" });
    }

    const { name, price, stock } = req.body;

    // Usamos !== undefined para aceptar valores válidos como 0 o cadenas vacías
    if (name !== undefined) producto.name = name;
    if (price !== undefined) producto.price = price;
    if (stock !== undefined) producto.stock = stock;

    writeProducts(productos);

    res.json(productos);
};


// delete  
const deleteProduct = ((req,res) => {
     /* obtengo el producto */ 
    let producto = productos.find(item => item.id == req.params.id)
    
     /* por si no encuentro */
    if (!producto) return res.json({status: 404, message: "Producto no encontrado"})

    productos = productos.filter(item => item.id !== parseInt(req.params.id))

    writeProducts(productos)

    res.json(productos)
})


module.exports={
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}