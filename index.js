const functions = require("firebase-functions");
//const fetch = require("node-fetch");
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const app = require("express")();
firebase.initializeApp();

var transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure:false,
    requireTLC:true,
    auth: {
      user: "eduardoplsoares@gmail.com",
      pass: "cDMCB2xHNpI8tQd0"
    }
  });

exports.sendAffiliationAccepted = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const email = req.query.email;
        const name = req.query.name;
        // const login = req.query.login;
        // const password = req.query.password;

        const mailOptions = {
            from: 'PDT <noreply@pdt-app-fe29a.firebaseapp.com>',
            to: email,
            subject: 'Parabéns! Sua filiação foi aceita!', // email subject
            html:
                ` 
            <body style="margin:0;padding:0;font-family: Open Sans;">
            <table width="700" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:30px 0 30px 0" align="center">
                        <img width="180px" height="100px" alt="Imagem" style="display:block;"
                            src="https://i.imgur.com/6Etq71W.png" />
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 0" bgcolor="#263272" align="center">
                        <h2 style="color: #fff;margin: 0;font-size: 35px;">Parabéns! Sua filiação foi aceita!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 20px 20px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="border-bottom: 2px solid #ccc;padding: 30px 0 50px 0;">
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Agora você já é um filiado do Partido Democrático Trabalhista!
        
                                    </p>
        
                                    <p
                                        style="color:#263272;margin-top: 10px;font-size: 16px;padding-bottom: 10px;font-weight: 500;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Para acessar seu perfil e a sua carteirinha digital, basta abrir o app,
                                        ir em Perfil e digitar seu e-mail e senha.
        
                                    </p>
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Esqueceu sua senha? Não tem problema.
                                        Em Perfil, clique em "Esqueci minha senha" antes de digitar seu e-mail
                                        e nós enviaremos uma redefinição de senha para o seu e-mail.
        
                                    </p>
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Fique atento também a sua pasta de Spam e Lixo Eletrônico,
                                        pois nosso e-mail poderá cair lá.
                                      
                                    </p>
        
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Um grande abraço!
                                        Equipe PDT
        
                                    </p>
        
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
            `

            // email content in HTML
        };
        
        function insertInDataBase() {
            let res = firebase.database().ref("listaDeEmail")
            let key = res.push().key

            res.child(key).set(
                { 
                    email:email,
                    name: name
                })

        }

        insertInDataBase()
      

        // returning resulta
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.readDataInDataBase = functions.pubsub.schedule('every 10 minutes').onRun((context) => {
    firebase.database().ref("listaDeEmail").remove();
    //firebase.database().ref('tipo').set('Vendedor');
    return null;
});

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest( (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult =  firebase.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});

});
///////////////////////////////////Expres/////////////////////////////

// const app = require("express")();
// const db = firebase.firestore().collection("todos")

// //funcao 01 get
// app.get( "/todos",function(request, response) {
//    db.get().then(function(docs){
//        let todos = []
//        docs.forEach( function( doc) {
//            todos.push({
//                id: doc.id,
//                description: doc.data().description,
//            })
//        })
//    })
// })

// //funcao 02 get
// app.post( "/todos" , function(request, response) {
//     db.add({description : request.body.description})
//        .then(function () {
//            response.json({ general: 'works' })
//        })
// })


// exports.api = functions.https.onRequest(app)

// function funcaoTeste(){
//     console.log('teste');
// }

// const funcaoTeste = async () => {

// }
////////////////////////////////Express////////////////////////////////////
const db = firebase.firestore().collection("todos");
 
app.get("/todos", function (request, response) {
 db.get()
 .then(function (docs) {
 let todos = [];
 docs.forEach(function (doc) {
 todos.push({
 id: doc.id,
 description: doc.data().description
 })
 })
 response.json(todos);
 });
})

 
app.post("/todos", function (request, response) {
    db.add({ description: request.body.description })
        .then(function () {
            response.json({ general: "Works" });
        })
})
 
exports.api = functions.https.onRequest(app)


////////////////////////////////////////////////////
app.get("/atari", function (request, response) {
    firebase.database().ref("listaDeImagem").on('value', function (snapshot) {
        let res = snapshotToArray(snapshot)
        response.json(res);
    })

    function snapshotToArray(snapshot) {
        let retunrArr = []

        snapshot.forEach(function (childSnapshot) {
            let item = childSnapshot.val();
            item.key = childSnapshot.key

            retunrArr.push(item)
        })

        let numberRandom = Math.floor(Math.random() * 10 + 1)

        return retunrArr[numberRandom]
    }
})


// app.post("/atari", function (request, response) {
//     db.add({ description: request.body.description })
//         .then(function () {
//             response.json({ general: "Works" });
//         })
// })

exports.API = functions.https.onRequest(app)

