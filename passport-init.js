var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
// var users = {};
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user._id);
		//return the unique id for the user
		return done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(id, done) {
		User.findById(id,function(err,user){
			if(err){
				return done(err,false);
			}
			if(!user){
				return done('user not found!',false); 
			}
			return done(null,user);
		});
		// return done(null,);
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			User.findOne({username:username},function(err,user){
				// if(err){
				// 	console.log('error');
				// 	return done("failed",false);
				// }
				// console.log('success');
				// return done(user,true);
				if(err){
					return done(err,false);
				}	 

				if(!user){
					return done('user '+username+' not found!',false);
				}

				if(!isValidPassword(user,password)){
					return done('incorrect password',false);
				}
				console.log('successfully login !');
				return done(null,user);
			});

			// if(!users[username]){
			// 	console.log('User Not Found with username '+username);
			// 	return done(null, false);
			// }

			// if(isValidPassword(users[username], password)){
			// 	//sucessfully authenticated
			// 	return done(null, users[username]);
			// }
			// else{
			// 	console.log('Invalid password '+username);
			// 	return done(null, false)
			// }
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			User.findOne({username:username},function(err,user){
				if(err){
            		console.log('error');	
					return done(err,false);
				}

				if(user){
					console.log('user taken');
					return done('username already taken',false);
				}

				var user = new User();
				user.username = username;
				user.password = createHash(password);
			
				user.save(function(err,user){
					if(err){
            			console.log('error');
						return done(err,false);
					}
					
					console.log('successfully signed up user '+username);
					return done(null,user);
				});
			});

			// if (users[username]){
			// 	console.log('User already exists with username: ' + username);
			// 	return done(null, false);
			// }
	
			//store user in memory 
			
			// users[username] = {
			// 	username: username,
			// 	password: createHash(password)
			// }
			
			// console.log(users[username].username + ' Registration successful');
			// return done(null, users[username]);
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};