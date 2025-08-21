


const ProductCategory = require('./productCategories.mongo.js')


const createProductCategory = async (data) => {
    return await ProductCategory.create(
        {
            ...data,
            createdAt: Date.now(),
        }
    )
    
}

const getAllProductCategories = async () => {
    return await ProductCategory.find({})
}

module.exports = {
    getAllProductCategories,
    createProductCategory
}