const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/admin_db');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error in connecting the databases'));
db.once('open',function()
{
    console.log('databases are succesfully connected');
})
           