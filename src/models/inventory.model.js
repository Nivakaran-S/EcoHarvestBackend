const mongoose = require('mongoose');
const { Schema } = mongoose;

// Function to drop the inventoryProductId_1 index
async function dropProblematicIndexes() {
    try {
        const collection = mongoose.connection.collection('inventories');
        const indexes = await collection.indexes();
        const problematicIndexes = ['inventoryProductId_1'];

        for (const indexName of problematicIndexes) {
            const index = indexes.find((idx) => idx.name === indexName);
            if (index) {
                await collection.dropIndex(indexName);
                console.log(`Dropped ${indexName} index`);
            } else {
                console.log(`No ${indexName} index found`);
            }
        }
    } catch (error) {
        console.error('Error dropping indexes:', error.message);
        throw error;
    }
}

// // Drop the existing Inventory model if it exists
// if (mongoose.models.Inventory) {
//     mongoose.model('Inventory').discard();
// }

// Define the inventory schema
const inventorySchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        productName: { type: String, required: true },
        category: { type: String, enum: ['Resale', 'Recycle', 'Fertilizer'], required: true },
        quantity: { type: Number, required: true },
        vendorName: { type: String, required: true },
        collectedTime: { type: Date, default: Date.now },
        status: { type: String, enum: ['Active', 'Dispatched'], default: 'Active' },
        dispatchedTime: { type: Date },
        collectedFertilizerCompany: { type: String },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    },
    { timestamps: true }
);

// Create the Inventory model
const Inventory = mongoose.model('Inventory', inventorySchema);

// Expose dropProblematicIndexes as a static method
Inventory.dropProblematicIndexes = dropProblematicIndexes;

// Drop problematic indexes when the connection opens
mongoose.connection.once('open', async () => {
    try {
        await dropProblematicIndexes();
    } catch (error) {
        console.error('Failed to drop problematic indexes on connection:', error.message);
    }
});

module.exports = Inventory;