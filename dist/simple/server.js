"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const database_1 = require("../database");
const date = () => new Date();
console.log(date(), 'System opened!');
//database.SetConfig.logingMode(true);
database_1.database.Connect(config_1.sqlConfig, async (config, err) => {
    if (err) {
        console.error(date(), 'Database connection error:', err);
        return;
    }
    console.log(date(), 'Database connected!');
    // Example usage:
    /*
    // Find all users
    const users = await database.Table('account').find();
    console.log(users);

    // Find user by ID with selected fields
    const user = await database.Table('account').find({ id: 1 }, { selected_keys: ['username'] });
    console.log(user);

    // Find users with LIKE query
    const filteredUsers = await database.Table('account').find({}, { selected_keys: ['username'], likes: { username: 'ciha....' } });
    console.log(filteredUsers);

    // Find one user
    const singleUser = await database.Table('account').findOne({ id: 1 }, { selected_keys: ['username'] });
    console.log(singleUser);

    // Create user
    const createdUser = await database.Table('account').createOne({
        id: 1,
        username: 'cihatksm',
        email: 'me@cihatksm.com'
    });
    console.log(createdUser);

    // Update user
    const updatedUser = await database.Table('account').updateOne(
        { id: 1 },
        { username: 'cihatksm', email: 'contact@cihatksm.com' }
    );
    console.log(updatedUser);

    // Get table info
    const info = await database.Table('company').functions.info();
    console.log(info);

    // Execute stored procedure
    const procedure = await database.Procedure('CreateLog').Execute({ id: 1, name: 'cihat' });
    console.log(procedure);

    // Create table
    const schema = {
        id: database.Types.int() + database.Types.options.primaryKey(),
        name: database.Types.varchar(255),
        created_at: database.Types.datetime(),
        updated_at: database.Types.datetime(),
        deleted_at: database.Types.datetime()
    };
    const createdTable = await database.Table('test').functions.create(schema);
    console.log(createdTable);

    // Remove table
    const removedTable = await database.Table('company').functions.remove();
    console.log(removedTable);
    */
});
//# sourceMappingURL=server.js.map