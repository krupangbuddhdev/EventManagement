var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});


router.post('/user', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,user){
				if(!user){
					var c;
					User.findOne({},function(err,user){

						if (user) {
							console.log("if");
							c = user.unique_id + 1;
						}else{
							c=1;
						}

						var user = new User({
							unique_id:c,
							username: personInfo.username,
							email:personInfo.email,
							role: personInfo.role,
							enroll: personInfo.enroll,
							college: personInfo.college,
							mobile: personInfo.mobile,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						user.save((err) => {
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					req.session.message = {
						type: 'success',
						message: 'You are registered,You can login now.'
					};
					res.redirect("/login");
				}else{
					req.session.message = {
						type: 'success',
						message: 'Email is already used.'
					};
					res.redirect("/register");
				}
			});
		}else{
			req.session.message = {
				type: 'success',
				message: 'Password does not match.'
			};
			res.redirect("/register");
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,user){
		if(user){
			
			if(user.password==req.body.password && user.role==req.body.role){
				//console.log("Done Login");
				req.session.userId = user.unique_id;
				//console.log(req.session.userId);
				req.session.message = {
					type: 'success',
					message: 'You have successfully logged in!'
				};
				res.redirect("/home1");
				
			}else if (user.role!=req.body.role){
				req.session.message = {
					type: 'success',
					message: 'Select your correct role'
				};
				res.redirect("/login");
			}
			else if (user.password!=req.body.password){
				req.session.message = {
					type: 'success',
					message: 'Enter correct password'
				};
				res.redirect("/login");
			}
		}else{
			req.session.message = {
				type: 'success',
				message: 'This Username is not registered'
			};
			res.redirect("/register");
		}
	});
});

// router.get('/profile', function (req, res, next) {
// 	console.log("profile");
// 	User.findOne({unique_id:req.session.userId},function(err,user){
// 		console.log("user");
// 		console.log(user);
// 		if(!user){
// 			res.redirect('/index');
// 		}else{
// 			//console.log("found");
// 			return res.render('profile.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
// 		}
// 	});
// });

router.get('/profile', (req, res) => {
	User.find().exec((err,users) => {
		if (err) {
			res.json({ message: err.message });
		} else {
			//console.log("found");
			return res.render('profile.ejs', {users: users});
		}
	});
});

// Edit User
router.get('/editUser/:id', (req, res) => {
	let id = req.params.id;
	User.findById(id, (err, user) => {
		if(err){
			res.redirect('/register');
		} else {
			if(user == null){
				res.redirect('/register');
			} else {
				res.render('editUser.ejs', {
					title: "Edit User",
					user: user,
				});
			}
		}
	});
});

// Update User
router.post('/editUser/:id', (req, res) => {
	// let id = req.params.id;
	User.findOneAndUpdate({_id: req.body.unique_id},{ $set:{username: req.body.username} });
	res.redirect('/profile');
});
  
  //Delete event
  router.get("/deleteUser/:id", (req, res) => {
	let id = req.params.id;
	User.findByIdAndRemove(id, (err, result) => {
	  if (result.image != "") {
		try {
		  fs.unlinkSync("./uploads/" + result.image);
		} catch (err) {
		  console.log(err);
		}
	  }
	  if (err) {
		res.json({ message: err.message, type: "danger" });
	  } else {
		req.session.message = {
		  type: "info",
		  message: "User deleted successfully",
		};
		res.redirect("/profile");
	  }
	});
  });

router.get('/event', function (req, res, next) {
	// console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,user){
		// console.log("user");
		// console.log(user);
		if(!user){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('eventAdd.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
		}
	});
});

router.get('/home1', function (req, res, next) {
	// console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,user){
		// console.log("user");
		// console.log(user);
		if(!user){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('home1.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
		}
	});
});

router.get('/about1', function (req, res, next) {
	// console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,user){
		// console.log("user");
		// console.log(user);
		if(!user){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('about1.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
		}
	});
});

router.get('/contact1', function (req, res, next) {
	// console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,user){
		// console.log("user");
		// console.log(user);
		if(!user){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('contact1.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
		}
	});
});

// router.get('/eventView', function (req, res, next) {
// 	// console.log("profile");
// 	User.findOne(function(err,user){
// 		// console.log("user");
// 		// console.log(user);
// 		return res.render('eventView.ejs', {"id":user.unique_id,"name":user.username,"email":user.email,"role":user.role});
// 	});
// });

router.get('/logout', function (req, res, next) {
	// console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
			console.log("logout");
    		return res.redirect('/home');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,user){
		// console.log(user);
		if(!user){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			user.password=req.body.password;
			user.passwordConf=req.body.passwordConf;

			user.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;