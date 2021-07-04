var sign = require('jsonwebtoken').sign;
var { URL } = require('url');
const express = require('express')
const fetch = require('node-fetch');
const app = express()


async function getvals(username, password) {
    const url = 'https://elastic.messangi.me/kingslanding/login';

    const dataString = { username: username, password: password};

    const options = {
        method: 'POST',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(dataString)
    };

    return await fetch(url, options)
        .then( res => {
            console.log(res);

            const r =  res.headers.get('authorization').substring(7);
            console.log(r);
            return r;

        });


}


module.exports = (req, res) => {

    (async function (){
        var { email, password } = req.body;
        const username = email;

        const bearer = await getvals(username, password)
        const user = {name: username, email: username, apiKey: bearer, version: 1};
        const jwt = sign(user, process.env.JWT_SECRET);
        const url = new URL(process.env.HUB_URL);
        url.searchParams.set('auth_token', jwt);
        console.log('Redirecting to: ', url.toString());
        return res.redirect(url);
    })();
}




