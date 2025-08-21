

const { createProductCategory, getAllProductCategories } = require('../../models/productCategories.model')


const httpGetAllProductCategories = async (req, res) => {
    try {
        return res.status(200).json(await getAllProductCategories())
    } catch(err) {
        console.error("Error in getting all product categories", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const httpCreateProductCategory = async (req, res) => {
    try {
        return res.status(200).json(await createProductCategory(req.body))
    } catch(err) {
        console.error("Error in creating product category", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports ={
    httpGetAllProductCategories,
    httpCreateProductCategory
}