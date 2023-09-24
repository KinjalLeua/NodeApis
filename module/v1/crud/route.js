var express = require('express');
var con = require('../../../config/database');
var modal = require('./model')
var router = express.Router();
var validate = require('../../../middleware/validation')



///////////// insert customer details////////////////////////


router.post('/addcustomer', function (req, res) {
    var request = req.body;
    var rules = {
        first_name: 'required',
        last_name: 'required',
        city: 'required',
        company: 'required',
        

    };
    var messages = {
        required: "Please Enter :attr",

    }
    if (validate.checkValidation(res, request, rules, messages)) {
        modal.AddCustomer(request, function (code, message, data) {
           validate.send_response(res, req, code,message, data);
        });


    }
})

///////////////////////////////////////////////////////customer listing////////////////////////////////////////


router.get('/customerListing', (req, res) => {
    modal.customerListing(req,function (code, message, data) {
        validate.send_response(res, req, code, message,data);
    });
  });


/////////////////////////////customer by id///////////////////////////////


router.post('/getcustomerbyid', function (req, res) {
   
    var request = req.body;
    var rules = {
        customer_id: 'required'

    };
    var messages = {
        required: "Please Enter :attr",

    }
        if (validate.checkValidation(res, request, rules)) {
            modal.getCustomerById(request.customer_id, function (code, data, message,) {
                validate.send_response(res, req, code, data, message);
            });

        }
    })


    ///////////////////////////////////////////////////////customers from a particular city///////////////////////////////////////


router.get('/customerListingCity', (req, res) => {
    modal.customerListingByCity(req,function (code, message, data) {
        validate.send_response(res, req, code, message,data);
    });
  });


module.exports = router;