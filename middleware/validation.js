const Validator = require('Validator');



var validate = {
    checkValidation: function (res, request, rules, messages) 
    {
        const v = Validator.make(request, rules, messages);
        if (v.fails()) {
            var error = "";
            const errors = v.getErrors();
            // console.log(errors)
            for (var key in errors) {
                var error = errors[key][0];
                console.log(error)
                break;
            }
            response_data = {
                code: '0',
                message: error
            }
            // res.status(200);
            res.send(response_data)
            return false;
        }else{
            return true;
        }

        },

        send_response : function(res,req,code,message,data){

            if (data == null) {
                response_data = {
                    code: code,
                    message: message,
                  
                }
                // res.status(200);
                res.send(response_data);
                
            } else {
                response_data = {
                    code: code,
                    message: message,
                    data:data
                  
                }
                // res.status(200);
                res.send(response_data);
            }
           
            
        },
    }


module.exports = validate;