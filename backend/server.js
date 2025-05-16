require('dotenv').config();         // ✅ Load .env
const app = require('./app');
const sequelize = require('./config/db');

// ✅ DEBUG: Check if DB name is being picked up
console.log('Connecting to DB:', process.env.DB_NAME);

const PORT =  5050;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected');

        await sequelize.sync(); // Sync models with DB

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to DB:', error.message);
    }
};

startServer();
