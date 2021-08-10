const express = require('express');
const app = express();
const mongojs = require('mongojs');
const dbChat = mongojs('chatDB1', ['users', 'charroom']);
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(express.static(__dirname + '/public/pickUser'));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/Chat', (req, res) => {
    console.log('I received a GET request');

    dbChat.users.find((err, docs) => {
        console.log(docs);
        res.status(200).json(docs);
    });
});

app.get('/Chat/finduser:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    dbChat.users.findOne({_id: mongojs.ObjectId(id)}, (err,doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findProfile/:userID', (req, res) => {
    const {userID} = req.params;
    console.log(userID);
    dbChat.users.find({userID: userID}, {userID:"", password:"", name:"", email:"", image:"", sex:""},
    (err,doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findProfile1/:userID', (req, res) => {
    const {userID} = req.params;
    console.log(userID);
    dbChat.users.find({userID: userID}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findMemPic/:userID', (req, res) => {
    const {userID} = req.params;
    console.log(userID);
    dbChat.users.find({"userID":"user1"}, {"image":""}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findMem/:userID&:oo', (req, res) => {
    const {userID} = req.params;
    const {oo} = req.params;
    console.log(userID+oo);
    dbChat.users.findOne({userID: userID}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findroom/:ch', (req, res) => {
    const {ch} = req.params;
    console.log(ch);
    dbChat.charroom.find({chatroomID: ch}, {"Message":[{}]}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get("/Chat/findrooms/:ch", (req, res) =>{
    const {ch} = req.params;
    console.log(ch);
    dbChat.charroom.find({chatroomID: ch}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/checkuserLogin/:id&:pass', (req, res) => {
    var id = req.params.id;
    var pass = req.params.pass;
    console.log(id);
    dbChat.users.find({userID: id, password: pass}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/checkuserRegister/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    dbChat.users.find({userID: id}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findfriend/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    dbChat.users.find({userID: id}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findaddfriend/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    dbChat.users.find({userID: id}, {userID:"", name:"", image:""}, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.get('/Chat/findRequestF/:id&:RID', (req, res) => {
    const id = req.params.id;
    const RID = req.params.RID;
    console.log(id);
    dbChat.users.find({userID: id}, {"RequestF":{"$elemMatch":{"RequestID": RID}}}, (err, doc) => {
        res.status(200).json(doc);
    });
});






app.post('/Chat/adduser', (req, res) => {
    console.log(req.body);
    dbChat.users.insert(req.body, (err, doc) => {
        res.status(200).json(doc);
    });
});

app.post('/Chat/addroom', (req, res) => {
    console.log(req.body);
    dbChat.charroom.insert(req.body, (err, doc) => {
        res.status(200).json(doc);
    });
});





app.put('/Chat/updateuser:id', (req, res) => {
    const {id} = req.params;
    console.log(req.body.userID);
    db.member.findAndModify({
        query: {_id: mongojs.ObjectId(id)},
        update: {$set: {userID: req.body.userID, Password: req.body.Password, Name: req.body.Name, Email: req.body.Email, Sex: req.body.Sex}},
        new: true}, (err, doc) => {
            res.status(200).json(doc);
    });

});

app.put('/Chat/addmessage/:ch', (req, res) => {
    const {ch} = req.params;
    const date = new Date();
    const current_hour = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"-"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
    console.log(ch);
    dbChat.charroom.update(
        {chatroomID:ch},
        {$push:{Message:{
            userID: req.body.userID,
            name: req.body.name,
            imageM: req.body.imageM,
            message: req.body.message,
            time_state: new Date().toISOString().
                                    replace(/T/, ' ').
                                    replace(/\..+/, '')
        }}}, (err, doc) => {
            res.status(200).json(doc);
    });
});

app.put('/Chat/addrequestF/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    dbChat.users.update(
         {userID: id},
         {$push:{RequestF:{
             RequestID: req.body.RequestID,
             name: req.body.name,
             imageR: req.body.imageR
         }}}, (err, doc) => {
              res.status(200).json(doc);
    });
});

app.put('/Chat/updaterequestF/:id&:RID', (req, res) => {
    const id = req.params.id;
    const RID = req.params.RID;
    console.log(id);
    dbChat.users.update(
        {userID: id}, {$pull: {"RequestF" : {RequestID: RID}}}, (err, doc) => {
            res.status(200).json(doc);
    });
});

app.put('/Chat/addfriendbyRequest/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    dbChat.users.update(
        {userID: id},
        {$push:{friend:{
            friendID: req.body.friendID,
            name: req.body.name,
            imageFr: req.body.imageFr
        }}}, (err, doc) => {
            res.status(200).json(doc);
    });
});

app.delete('/Chat/deleteuser/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    dbChat.users.remove({userID: id}, (err, doc) => {
        res.status(200).json(doc);
    });
});


app.listen(3000);
console.log('Server running on port 3000');







