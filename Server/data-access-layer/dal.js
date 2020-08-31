const mongoose = require('mongoose');

function connectAsync() {
    return new Promise((resolve, reject) => {
        const connStr = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`;

        const options = { useNewUrlParser: true, useUnifiedTopology: true };

        mongoose.connect(connStr, options, (err, db) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(db);
        })
    })
}


(async() => {
    try {
        const db = await connectAsync();
        console.log(`connected to ${db.name}`);
    } catch (err) { console.log(err); }
})();