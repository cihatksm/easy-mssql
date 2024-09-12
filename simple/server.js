const config = require('./config');

const { Connect, Table, SetConfig, Procedure, Types } = require('../database');
const date = () => new Date()

console.log(date(), 'System opened!')

//SetConfig.logingMode(true);
Connect(config.sql, async () => {
    console.log(date(), 'Database connected!');

    // const user = await Table('account').find({ id: 1 });
    // console.log(user);

    // const user = await Table('account').find({ id: 1 }, { selected_keys: ['username'] });
    // console.log(user);

    // const user = await Table('account').find({}, { selected_keys: ['username'], likes: { username: 'ciha....' } });
    // console.log(user);

    // const user = await Table('account').findOne({ id: 1 }, { selected_keys: ['username'] });
    // console.log(user);

    // const createdUser = await Table('account').createOne({ id: 1, username: 'cihatksm', email: 'me@cihatksm.com' });
    // console.log(createdUser);

    // const updatedUser = await Table('account').updateOne({ id: 1 }, { username: 'cihatksm', email: 'contact@cihatksm.com' });
    // console.log(updatedUser);

    // const info = await Table('company').functions.info(); 
    // console.log(info); 

    // const procedure = await Procedure('CreateLog').Execute({ id: 1, name: 'cihat' });
    // console.log(procedure);

    // const query = await Request.query('SELECT * FROM company', true);
    // console.log(query);

    // const schema = {
    //     id: Types.int() + Types.options.primaryKey(),
    //     name: Types.varchar(255),
    //     created_at: Types.datetime(),
    //     updated_at: Types.datetime(),
    //     deleted_at: Types.datetime()
    // }

    // const createdTable = await Table('test').functions.create(schema);
    // console.log(createdTable);

    // const removedTable = await Table('company').functions.remove();
    // console.log(removedTable);
});