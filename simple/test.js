const { sqlConfig } = require('./config');
const EasyMssql = require('../dist/database.js');
require('colors');

console.log('\neasy-mssql Test Suite');
console.log('===================');
console.log('Starting tests...\n');

// Enable logging mode
EasyMssql.Config.logingMode(true);

// Test 1: Database Connection
console.log('Test 1: Testing database connection...');
console.log('Waiting for SQL Server to be ready...');

// Connect to the database
EasyMssql.Connect(sqlConfig, async (config, err) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
    console.log('✅ Connection successful\n');

    // Test 2: Table Operations
    console.log('Test 2: Testing table operations...');
    try {
        // Create test table
        const schema = {
            id: EasyMssql.Types.int() + EasyMssql.Types.options.primaryKey(),
            name: EasyMssql.Types.varchar(255),
            created_at: EasyMssql.Types.datetime()
        };

        // First, ensure the table doesn't exist
        const table = EasyMssql.Table('test_table');
        await table.functions.remove();

        const createResult = await table.functions.create(schema);
        if (createResult) {
            console.log('✅ Table creation successful');
        } else {
            console.log('❌ Table creation failed');
            throw new Error('Table creation failed');
        }

        // Format date in SQL Server format
        const now = new Date();
        const sqlDate = now.toISOString().slice(0, 19).replace('T', ' ');

        // Insert test data
        const insertResult = await table.createOne({
            id: 1,
            name: 'Test Record',
            created_at: sqlDate
        });
        if (insertResult) {
            console.log('✅ Data insertion successful');
        } else {
            console.log('❌ Data insertion failed');
            throw new Error('Data insertion failed');
        }

        // Query test data
        const queryResult = await table.find();
        if (queryResult && queryResult.length > 0) {
            console.log('✅ Data query successful');
        } else {
            console.log('❌ Data query failed');
            throw new Error('Data query failed');
        }

        // Clean up
        const removeResult = await table.functions.remove();
        if (removeResult) {
            console.log('✅ Table cleanup successful\n');
        } else {
            console.log('❌ Table cleanup failed\n');
            throw new Error('Table cleanup failed');
        }

        // Test 4: Comprehensive Table Function Tests
        console.log('Test 4: Testing all table functions...');
        try {
            // Recreate the table for these tests
            await table.functions.create(schema);
            console.log('✅ Table recreated for comprehensive tests');

            // Insert multiple test records
            const testRecords = [
                { id: 1, name: 'Test Record 1', created_at: sqlDate },
                { id: 2, name: 'Test Record 2', created_at: sqlDate },
                { id: 3, name: 'Test Record 3', created_at: sqlDate }
            ];

            // Test createOne
            const createOneResult = await table.createOne(testRecords[0]);
            if (createOneResult) {
                console.log('✅ createOne test successful');
            } else {
                throw new Error('createOne test failed');
            }

            // Test findOne
            const findOneResult = await table.findOne({ id: 1 });
            if (findOneResult && findOneResult.id === 1) {
                console.log('✅ findOne test successful');
            } else {
                throw new Error('findOne test failed');
            }

            // Test updateOne
            const updateOneResult = await table.updateOne({ id: 1 }, { name: 'Updated Record' });
            if (updateOneResult) {
                console.log('✅ updateOne test successful');
            } else {
                throw new Error('updateOne test failed');
            }

            // Test deleteOne
            const deleteOneResult = await table.deleteOne({ id: 1 });
            if (deleteOneResult) {
                console.log('✅ deleteOne test successful');
            } else {
                throw new Error('deleteOne test failed');
            }

            // Insert records for remaining tests
            for (const record of testRecords) {
                await table.createOne(record);
            }

            // Test first
            const firstResult = await table.first({ id: 1 });
            if (firstResult && firstResult.id === 1) {
                console.log('✅ first test successful');
            } else {
                throw new Error('first test failed');
            }

            // Test firstOrDefault
            const firstOrDefaultResult = await table.firstOrDefault({ id: 999 });
            if (firstOrDefaultResult === null) {
                console.log('✅ firstOrDefault test successful');
            } else {
                throw new Error('firstOrDefault test failed');
            }

            // Test single
            const singleResult = await table.single({ id: 2 });
            if (singleResult && singleResult.id === 2) {
                console.log('✅ single test successful');
            } else {
                throw new Error('single test failed');
            }

            // Test singleOrDefault
            const singleOrDefaultResult = await table.singleOrDefault({ id: 999 });
            if (singleOrDefaultResult === null) {
                console.log('✅ singleOrDefault test successful');
            } else {
                throw new Error('singleOrDefault test failed');
            }

            // Test last
            const lastResult = await table.last();
            if (lastResult && lastResult.id === 3) {
                console.log('✅ last test successful');
            } else {
                throw new Error('last test failed');
            }

            // Test lastOrDefault
            const lastOrDefaultResult = await table.lastOrDefault({ id: 999 });
            if (lastOrDefaultResult === null) {
                console.log('✅ lastOrDefault test successful');
            } else {
                throw new Error('lastOrDefault test failed');
            }

            // Test count
            const countResult = await table.count();
            if (countResult === 3) {
                console.log('✅ count test successful');
            } else {
                throw new Error('count test failed');
            }

            // Test min
            const minResult = await table.min('id');
            if (minResult === 1) {
                console.log('✅ min test successful');
            } else {
                throw new Error('min test failed');
            }

            // Test max
            const maxResult = await table.max('id');
            if (maxResult === 3) {
                console.log('✅ max test successful');
            } else {
                throw new Error('max test failed');
            }

            // Test average
            const averageResult = await table.average('id');
            if (averageResult === 2) {
                console.log('✅ average test successful');
            } else {
                throw new Error('average test failed');
            }

            // Test deleteAll with parameter (only using name field to avoid date conversion issues)
            const deleteAllWithParamResult = await table.deleteAll({ name: 'Test Record 2' });
            if (deleteAllWithParamResult) {
                console.log('✅ deleteAll with parameter test successful');
            } else {
                throw new Error('deleteAll with parameter test failed');
            }

            // Test deleteAll without parameter
            const deleteAllResult = await table.deleteAll();
            if (deleteAllResult) {
                console.log('✅ deleteAll without parameter test successful');
            } else {
                throw new Error('deleteAll without parameter test failed');
            }

            // Final cleanup
            await table.functions.remove();
            console.log('✅ All table function tests completed successfully\n');
        } catch (error) {
            console.error('❌ Comprehensive table function tests failed:', error);
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Table operations failed:', error);
        process.exit(1);
    }

    // Test 3: Stored Procedure
    console.log('Test 3: Testing stored procedure...');
    try {
        // Create test stored procedure
        // ... (rest of the stored procedure test code)
    } catch (error) {
        console.error('❌ Stored procedure test failed:', error);
        process.exit(1);
    }
});