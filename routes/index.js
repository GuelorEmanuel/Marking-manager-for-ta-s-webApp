/*
  Based on the example code: "05_4xCookieSession"
  Authors: Tarek Karam 100886712
  Guelor Emanuel 100884107
*/
var loggedInUsers = {};
var color = require('color');
var LoggedIn = 'TheUserIsLoggedIn';
var uns = ["student","ta","professor"]; //Array of user names.
var pswds = ["tneduts","ta","prof"]; //Array of passwords.
var compDates = {onTime: "ON Time", notOnTime: "Late", inPos: "in progress", empty: ""}; //Completion status JSON data.

/*
  The home page, renders data from index.jade.
	If a user is logged in, the page redirects to the users page.
*/
function index(req, res) {
    if (req.session.username) {
        res.redirect("/users");
    } else {
	res.render('index', { title: 'COMP 2406 TA Marking Progress',
			      error: req.query.error });
    }
}

/*
  The page that displays when when a user is logged in.
	Renders the data from account.jade and displays the TA marking table.
	Shows the appropriate data according to what user is logged in.
*/
function users(req, res) {
  if(req.session.username === uns[0]) {
		res.render("account.jade", {username:req.session.username,
		          userType:"student",
							compDates:compDates,
							title:"Account",
							loggedInUsers: loggedInUsers});
  }
	else if(req.session.username === uns[1]) {
		res.render("account.jade", {username:req.session.username,
		          userType:"ta",
							compDates:compDates,
							title:"Account",
							loggedInUsers: loggedInUsers});
  }
	else if(req.session.username === uns[2]) {
		res.render("account.jade", {username:req.session.username,
							title:"Account",
							compDates:compDates,
							userType:"prof",
							loggedInUsers: loggedInUsers});
  }
	else {
	  res.redirect("/?error=Not Logged In");
  }
};

/*
  Logs a user in if user names and passwords are correct.
	If the credentials are incorrect it redirects the page to display an error message.
*/
function login(req, res) {
    var username = req.body.username;
		var password = req.body.password;
		for(var i=0; i<uns.length;i++) {
		  if(username === uns[i]) {
			  if (password === pswds[i]) {
					req.session.username = username;
					req.session.password = password;
					loggedInUsers[username] = LoggedIn;
					break;
				}
			}
		}
    res.redirect("/users")
}

/*
  Logs a user out, deletes the user's session,
	and redirects to the login page.
*/
function logout(req, res) {
    delete loggedInUsers[req.session.username];
    req.session = null;
    res.redirect("/");
}

/*
  All data from a professor or TA is stored in sessions.
	The table is then updated.
	Called when the update submit button is clicked.
	The account.jade page is then redirected to itself.
*/
function update(req, res) {
    var startAttribute;
    var compAttribute;
		var deadAttribute;
		var commentAttribute;
		for(var i=1; i<17; i++) {
		  startAttribute = 'startdate' + i;
			compAttribute = 'compdate' + i;
			deadAttribute = 'deaddate' + i;
			commentAttribute = 'commentstat' + i;
			if(req.body[startAttribute]) {
			  compDates[startAttribute] = req.body[startAttribute];
			}
			if(req.body[compAttribute]) {
			  compDates[compAttribute] = req.body[compAttribute];
			}
			if(req.body[deadAttribute]) {
			  compDates[deadAttribute] = req.body[deadAttribute];
			}
			if(req.body[commentAttribute]) {
        compDates[commentAttribute] = req.body[commentAttribute];
			}
		}
		console.log('COMP: ' + compDates['compdate1']);
    res.redirect("/users");
}
exports.update = update;
exports.index = index;
exports.users = users;
exports.login = login;
exports.logout = logout;
