const mongoose = require('mongoose');
const { Schema } = mongoose;

// Function to drop problematic indexes (vehicleId_1 and vehicleNumber_1)
async function dropProblematicIndexes() {
    try {
        const collection = mongoose.connection.collection('vehicles');
        const indexes = await collection.indexes();
        const problematicIndexes = ['vehicleId_1', 'vehicleNumber_1'];

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

// Drop the existing Vehicle model if it exists
// if (mongoose.models.Vehicle) {
//     mongoose.model('Vehicle').discard();
// }

// Define the vehicle schema
const vehicleSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        plateNumber: { type: String, required: true, unique: true, trim: true }, // “CAX-1234”
        type: { type: String, required: true, trim: true }, // “Bike”, “Van”, “Truck”…
        capacityKg: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ['Available', 'Assigned', 'Maintenance'], default: 'Available' },
        assignedInventories: [{ type: Schema.Types.ObjectId, ref: 'Inventory' }],
    },
    { timestamps: true }
);

// Create the Vehicle model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Expose dropProblematicIndexes as a static method
Vehicle.dropProblematicIndexes = dropProblematicIndexes;

// Drop problematic indexes when the connection opens
mongoose.connection.once('open', async () => {
    try {
        await dropProblematicIndexes();
    } catch (error) {
        console.error('Failed to drop problematic indexes on connection:', error.message);
    }
});

module.exports = Vehicle;