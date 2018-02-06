const express = require('express');
const path = require('path')
const simpleOauthModule = require('simple-oauth2');
const expressVue = require('express-vue');

const vueOptions = {
    rootPath: path.join(__dirname, '../Homepage/src'),
    layout: {
        start: '<div id="app">',
        end: '</div>'
    }
};

const expressVueMiddleware = expressVue.init(vueOptions);

const app = express();
app.use(expressVueMiddleware);

const oauth2 = simpleOauthModule.create({
    client: {
        id: process.env.OAUTH_APP_ID,
        secret: process.env.OAUTH_APP_SECRET
    },
    auth: {
        tokenHost: 'https://hmkrl.com',
        tokenPath: '/gitlab/oauth/token',
        authorizePath: '/gitlab/oauth/authorize'
    }
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'https://hmkrl.com/callback',
    scopes: 'read_user+api',
    state: '8787'
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
    const code = req.query.code;
    const options = {
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://hmkrl.com/callback'
    };


    oauth2.authorizationCode.getToken(options, (error, result) => {
        if (error) {
            console.error('Access Token Error', error.message);
            return res.json('Authentication failed');
        }

        console.log('The resulting token: ', result);
        const token = oauth2.accessToken.create(result);

        console.log(token['token']['access_token'])

            const GitlabAPI = require('node-gitlab-api')({
                url:   'https://hmkrl.com/gitlab', // Defaults to http://gitlab.com
                    oauthToken: token['token']['access_token']
            })

        var images = '<html>';

        GitlabAPI.users.all()
            .then((users) => {
                users.forEach((user) => {
                    images += '<img src="' + user['avatar_url'] + '"/><br>\n';
                })
                res.end(images + '</html>')
            })
    });

});

app.use(express.static(path.resolve(process.cwd() + '/../Homepage/dist')));

app.get('/', (req, res, next) => {
})

app.listen(3000, () => {
    console.log('Express server started on port 3000'); // eslint-disable-line
});

