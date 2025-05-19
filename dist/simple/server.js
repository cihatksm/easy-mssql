"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const database_1 = __importDefault(require("../database"));
const date = () => new Date();
console.log(date(), 'System opened!');
//EasyMssql.SetConfig.logingMode(true);
database_1.default.Connect(config_1.sqlConfig, async (config, err) => {
    if (err) {
        console.error(date(), 'Database connection error:', err);
        return;
    }
    console.log(date(), 'Database connected!');
    // Example usage:
    /*
    // Find all users
    const users = await EasyMssql.Table('account').find();
    console.log(users);

    // Find user by ID with selected fields
    const user = await EasyMssql.Table('account').find({ id: 1 }, { selected_keys: ['username'] });
    console.log(user);

    // Find users with LIKE query
    const filteredUsers = await EasyMssql.Table('account').find({}, { selected_keys: ['username'], likes: { username: 'ciha....' } });
    console.log(filteredUsers);

    // Find one user
    const singleUser = await EasyMssql.Table('account').findOne({ id: 1 }, { selected_keys: ['username'] });
    console.log(singleUser);

    // Create user
    const createdUser = await EasyMssql.Table('account').createOne({
        id: 1,
        username: 'cihatksm',
        email: 'me@cihatksm.com'
    });
    console.log(createdUser);

    // Update user
    const updatedUser = await EasyMssql.Table('account').updateOne(
        { id: 1 },
        { username: 'cihatksm', email: 'contact@cihatksm.com' }
    );
    console.log(updatedUser);

    // Get table info
    const info = await EasyMssql.Table('company').functions.info();
    console.log(info);

    // Execute stored procedure
    const procedure = await EasyMssql.Procedure('CreateLog').Execute({ id: 1, name: 'cihat' });
    console.log(procedure);

    // Create table
    const schema = {
        id: EasyMssql.Types.int() + EasyMssql.Types.options.primaryKey(),
        name: EasyMssql.Types.varchar(255),
        created_at: EasyMssql.Types.datetime(),
        updated_at: EasyMssql.Types.datetime(),
        deleted_at: EasyMssql.Types.datetime()
    };
    const createdTable = await EasyMssql.Table('test').functions.create(schema);
    console.log(createdTable);

    // Remove table
    const removedTable = await EasyMssql.Table('company').functions.remove();
    console.log(removedTable);
    */
});
//# sourceMappingURL=server.js.map