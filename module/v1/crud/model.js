

const { request } = require('express');
var con = require('../../../config/database')
var asyncLoop = require('node-async-loop');
var crud = {


    /////////////////////////////////////////add customer details///////////////////////////////////
    AddCustomer: function (request, callback) {

        const { first_name, last_name, city, company } = request;

        // Check if all fields are provided
        if (!first_name || !last_name || !city || !company) {
            callback('0', 'All fields are required!', null);
            return;
        }

        // Check if the provided city and company exist for an existing customer
        const checkExistingCustomerQuery = `
        SELECT id
        FROM tbl_customer
        WHERE is_delete = 0 AND city = ? AND company = ?
    `;

        con.query(checkExistingCustomerQuery, [city, company], (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                callback('0', 'Something went wrong, please try again later!', null);
                return;
            }

            // If no matching customer found, reject the request
            if (results.length === 0) {
                callback('0', 'City and company do not exist for an existing customer!', null);
                return;
            }

            let insertObj = {
                first_name: request.first_name,
                last_name: request.last_name,
                city: request.city,
                company: request.company
            };

            let sql = `INSERT INTO tbl_customer SET ?`;

            con.query(sql, [insertObj], (error, result) => {
                if (!error) {
                    // Retrieve the insert ID of the newly inserted customer
                    const insertId = result.insertId;

                    // Use the insertId to get customer details
                    crud.GetCustomerDetails(insertId, function (custDetails) {
                        if (custDetails == null) {
                            callback('0', 'Something went wrong!!', null);
                        } else {
                            callback("1", "record inserted!!!!", custDetails);
                        }
                    });
                } else {
                    console.log(error);
                    callback("0", "insert_data_error_message", {});
                }
            });
        })
    },


    GetCustomerDetails: function (insertId, callback) {
        con.query("SELECT * FROM tbl_customer WHERE id = ? AND is_delete = '0'", [insertId], (error, result) => {
            if (!error && result.length > 0) {
                customerData = result[0];
                callback(customerData);
            } else {
                callback(null);
            }
        });
    },



    ///////////////////////////////////////////////////////customer listing////////////////////////////////////////

    customerListing: function (req, callback) {
        let query = 'SELECT * FROM tbl_customer WHERE is_delete = 0';

        // Destructure query parameters
        const { page, limit, first_name, last_name, city } = req.query;

        // Calculate the offset based on page and limit
        const offset = (page - 1) * limit;

        // Add filtering conditions based on query parameters
        if (first_name) {
            query += ` AND first_name LIKE '%${first_name}%'`;
        }

        if (last_name) {
            query += ` AND last_name LIKE '%${last_name}%'`;
        }

        if (city) {
            query += ` AND city LIKE '%${city}%'`;
        }

        // Add pagination using LIMIT and OFFSET
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        // Execute the SQL query
        con.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                callback('0', 'Something went wrong, please try again later!!', null);
            } else {
                callback('1', 'Customer Listing', results);
            }
        });
    },

    /////////////////////////////////////////////////customer by id/////////////////////////////////////////

    getCustomerById: function (customer_id, callback) {
        con.query("SELECT * FROM tbl_customer where is_delete =0 AND is_active = 1 AND id= ?", [customer_id], function (err, result) {
            if (err) {
                console.error('Error executing query:', err);
                callback('0', 'Something went wrong, please try again later!!', null);
            } else {
                callback('1', 'Customer founded', result);
            }
        })
    },
    /////////////////////////////////////////////////customers from a particular city/////////////////////////////////////////


    customerListingByCity: function (req, callback) {
        let query = `SELECT city, COUNT(*) as customer_count
        FROM tbl_customer
        WHERE is_delete= 0
        GROUP BY city
      `;
        con.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                callback('0', 'Something went wrong, please try again later!!', null);
            } else {
                const cityData = results.map((result) => ({
                    city: result.city,
                    customer_count: result.customer_count
                }));

                callback('1', 'Customer Listing', cityData);
            }
        });
    },


}





module.exports = crud;
