var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');
var app = express();
app.use(bodyParser.json());



app.get('/api/users', function(req, res, next) {
    var language = req.query.language;
    
    if(language) {
        var result = users.filter(function(elem) {
            return elem.language.toLowerCase() === language.toLowerCase();
        })
        return res.status(200).json(result);
    }
    if(req.query.age) {
        var result = users.filter(function(elem) {
            return elem.age === Number(req.query.age);
        })
        return res.status(200).json(result);
    }
    if(req.query.city) {
        var result = users.filter(function(elem) {
            return elem.city.toLowerCase() === req.query.city.toLowerCase();
        })
        return res.status(200).json(result);
    }
    if(req.query.state) {
        var result = users.filter(function(elem) {
            return elem.state.toLowerCase() === req.query.state.toLowerCase();
        })
        return res.status(200).json(result);
    }
    if(req.query.gender) {
        var result = users.filter(function(elem) {
            return elem.gender.toLowerCase() === req.query.gender.toLowerCase();
        })
        return res.status(200).json(result);
    }
    else {
        res.json(users);
    }
})
app.get('/api/users/:id', function(req, res, next) {
    var params = req.params.id;
    if(params) {
        var result = users.filter(function(elem) {
            return elem.type === params;
        })
        res.status(200).json(result);
    }
})
app.post('/api/users', function(req, res, next) {
    var id = users.length+1;
    req.body.id = id;
    users.push(req.body);
    res.status(200).json(users.length+1); 

})
app.post('/api/users/admin', function(req, res, next) {
    var id = users.length + 1;
    req.body.id = id;
    req.body.type = "admin";
    users.push(req.body);
    res.status(200).json(users.length+1);
})
app.post('/api/users/language/:id', function(req, res, next) {
    var params = req.params.id;
    var lang = req.body.language;
    if(params) {
        for(var i = 0; i < users.length; i++) {
            if(users[i].id == params) {
                users[i].language = lang;
            }
        }
    }
    res.status(200).json(users);
})
app.post('/api/users/forums/:id', function(req, res, next) {
    var params = req.params.id;
    var forum = req.body.add;
    if(params) {
        for(var i = 0; i < users.length; i++) {
            if(users[i].id == params) {
                users[i].favorites.push(forum);
            }
        }
    }
    res.json(users);
})
app.delete('/api/users/forums/:id', function(req, res, next) {
    var params = req.params.id;
    var query = req.query.favorite;
    if(params) {
        for(var i = 0; i < users.length; i++) {
            if(users[i].id == params) {
                for(var j = users[i].favorites.length - 1; j >=0; j--) {
                   if(users[i].favorites[j] == query) {
                        users[i].favorites.splice(j, 1);
                   }
                }
            }
        }
    }
    res.send(users);
})
app.delete('/api/users/:id', function(req, res, next) {
    var params = req.params.id;
    if(params) {
        for(var i = 0; i < users.length; i++) {
            if(users[i].id == params) {
                users.splice(i, 1);
            }
        }
    }
    res.json(users);
})
app.put('/api/users/:id', function(req,res,next) {
    var params = req.params.id;
    if(params) {
        for(var i = 0; i < users.length; i++) {
            if(users[i].id == params) {
                for(var key in req.body) {
                    users[i][key] = req.body[key];
                }
            }
        }
    }
    res.send(users);
})

app.listen(3000, function() {
    console.log("Listening");
})
module.exports = app;