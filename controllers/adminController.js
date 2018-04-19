var md5 = require('md5');
var Admin = require(process.cwd() + "/models/Admin");
exports.bootstrap = function(req, res, next) {

    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');

    next();

};
exports.login = function(req, res) {
    res.render('admin/index.ejs');
};
exports.admin_login = function(req, res) {
    var condition = {
        "username": req.body.username,
        "password": md5(req.body.password),
    }
    
    Admin.find(condition, function(err, result) {
    	
    	if(result.length > 0)
    	{
    	    res.redirect("/admin/dashbaord")
    	}else {
    		req.flash('error_messages', 'Invalid email or password');
            res.redirect("/admin")
    	}
    });
};
exports.dashbaord= function(req,res){
	res.render('admin/dashbaord.ejs');
};
exports.logout= function(req,res){
	req.flash('success_messages', 'You have successfully logged out');
	res.redirect("/admin")
};