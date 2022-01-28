import url, { URL, URLSearchParams } from 'url'
import http, { request } from 'http'
import path from 'path'
import fs from 'fs'
// import mailer from 'nodemailer'
import { connect } from 'connect'
import net from 'net'
import requestIp from 'request-ip'

console.log('main')

const s = 'http://www.etutorialspoint.com/index.php/nodejs/node-js-filesystem/q?abc=xyz&one=1'

const testUrl = () => {
  const myURL = new URL(s)
  console.log(myURL.pathname)
  console.log(myURL.href)
  console.log(myURL.password)

  const p: URLSearchParams = myURL.searchParams
  console.log(p)
}

const testCookies = () => {
  http.createServer((req, res) => {
    const cookies = req.headers.cookie;
    if (!cookies) {
      const n = 'kname'
      const v = 'kvalue'
      var exp = new Date()
      exp.getDate() + 1

      var cookie = n + '=' + v + ';expires=' + exp.toUTCString() + ';'
      res.setHeader('Set-Cookie', cookie)
      res.writeHead(302, { 'Location': '/' })
      return res.end()
    } else {
      const newCs: string[] = []
      cookies.split(';').forEach(function (cookie) {
        const m: { [key: string]: any } = cookie.split('=')
        newCs[m[1]] = (m[2] || '').trim();
      });
      res.end('Cookie set: ' + cookies.toString())
    }
  }).listen(8080)
}

const testRegExp1 = () => {
  const s = 'aaewewedsdewddsxac'
  console.log(s.replace(new RegExp(/[Aa]{2,}/), 'b'))
}

const testObjectDeleteKey = () => {
  const user = {
    first_name: "John",
    last_name: "Smith",
    age: "38",
    department: "Software"
  };

  let keys = Object.keys(user)
  keys.splice(1, 1)
  console.log(keys.length)
}

const testFS1 = () => {
  const p = path.join(__dirname)
  fs.readdir(p, (err, files) => {
    if (err) {
      return console.log('unable to read dir ', p)
    }
    // console.log(JSON.stringify(files, null, 2))
    console.log(files)
  })
}

const testZip1 = () => {
  const zlib = require('zlib');

  const gzip = zlib.createGzip();
  const r = fs.createReadStream('./index.ts');
  const w = fs.createWriteStream('./index.ts.gz');
  r.pipe(gzip).pipe(w);
}

const testEmail = () => {

  const smtpProtocol = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sender@gmail.com",
      pass: "password"
    }
  });

  var mailoption = {
    from: "sender@gmail.com",
    to: "receiver@gmail.com",
    subject: "Test Mail",
    html: 'Good Morning!'
  }

  smtpProtocol.sendMail(mailoption, function (err, response) {
    if (err) {
      console.log(err);
    }
    console.log('Message Sent' + response.message);
    smtpProtocol.close();
  });
}

// all the express MiddleWare

const testExpress = () => {
  /*
require('source-map-support').install()
import fs, { access } from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { resolvers } from './resources/gql/dictResolver'

import axios from 'axios'
import { IWordInfo, parseWordInfo } from './wordResultParser'
import { ApolloServer } from 'apollo-server-express'
import { emptyWordInfo, typeDefs } from './resources/gql/dictSchema'
import jwt from 'jsonwebtoken'

import crypto from 'crypto'
// Consts

const PORT_HTTPS = 8888
const PORT_HTTP = 8887
const DICT_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const corsOptions = {
    origin: '*',
    credentails: true // allow to send coories over CORS
}
dotenv.config()
const app = express();

const getCredsForHttps = () => {
    console.log(`----- ${__dirname}`)
    const privateKey = fs.readFileSync(path.join(__dirname, './localhost.key'))
    const certificate = fs.readFileSync(path.join(__dirname, './localhost.crt'))
    // const privateKey = fs.readFileSync('/Users/kundanbapat/.localhost-ssl/localhost.key')
    // const certificate = fs.readFileSync('/Users/kundanbapat/.localhost-ssl/localhost.crt')
    return { key: privateKey, cert: certificate, }
}

// --- Express middleware
if ('production'.length > 0) {
    app.use(express.static("build"))
}
// bodyParser() deprecated.  factory methods still available.
// express 4.16+ - express.json() and express.urlencoded() prefered.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));

const jsonParser = bodyParser.json();
app.use(jsonParser)
app.use(bodyParser.raw());

// GQL (Apollo) server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
})
apolloServer.start().then(() => {
    apolloServer.applyMiddleware({
        app,
        cors: corsOptions
    })
})

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        data: `Hello from Node Server at ${PORT_HTTPS}`
    })
})


const users = [
    {
        email: 'kundan.bapat@gmail.com',
        username: 'kundan',
        enc_password: 'ece3040fc3d84622bed5713df4b4edc12cfe2da1471f11cadc2928a704b21f89',
    }
]

app.post('/testjwt', jsonParser, (req: express.Request, res: express.Response) => {
    const token = req.body.token
    console.log('testjwt: token received: ', token)
    const verifyResult = jwt.verify(token, 'abcd')
    console.log('token you sent: ', token)
    console.log(`result of verification: ', ${verifyResult}`)
    console.log('next time provide op to perform')

    res.status(200).json({
        result: verifyResult,
        token_you_sent: token
    })
    return
})

app.post('/login', jsonParser, (req: express.Request, res: express.Response) => {

    console.log('....', req.body)
    const email = req.body.email
    const password = req.body.password
    const enc = crypto.createHash('sha256').update(password).digest('hex')
    console.log(`${email}, ${password}`)
    console.log(`encoded: ${enc}`)

    console.log(`enc: ${enc}, from db: ${users[0].enc_password}`)
    // TODO: use docker psql - client is expected to hash their password. if stoken, orig password stays safe
    //  server - frequenty update token.
    if (users[0].email === email && users[0].enc_password === enc) {
        const payload = {
            data: enc,
        }
        let accessToken = jwt.sign(payload, 'abcd', {
            expiresIn: '60d',
        })
        console.log(`accesstoken: ${accessToken}`)
        res.status(200).json({
            login: true,
            token: accessToken,
        })
    } else {
        res.status(400).json({
            login: true,
            token: '',
            message: 'email and/or password did not match'
        })
    }
})

app.get('/dict/:lookupWord', (req, res) => {
    let word = req.params.lookupWord
    console.log(`received URL: ', ${req.url} for word: ${word}`)
    const url = `${DICT_URL}${word}`

    try {
        axios.get(url)
            .then(result => {
                let data = result.data
                let parsedResult = parseWordInfo(data)
                console.log(parsedResult)
                res.json(parsedResult)
            })
            .catch(err => {
                console.log('axios get failed.')
                res.json(Object.assign(emptyWordInfo, { error: `${err.response.status}: ${err.response.data.title}` }))
            })
    } catch (err) {
        console.log(`GET from ${url} failed... `, err)
        res.json(Object.assign(emptyWordInfo, { error: `${err.response.status}: ${err.response.data.title}` }))
    }
})
// Move ABOVE out of this file.

const credOptions = getCredsForHttps()
// http.createServer(app)
https.createServer(credOptions, app)
    .listen(PORT_HTTPS, () => {
        console.log(`Express and 🚀 Server are running at: ${PORT_HTTPS}`)
    })
*/
}

// testUrl()
// testCookies()
// testRegExp1()
// testObjectDeleteKey()
// testFS1()
// testZip1()
// testEmail()

// Angular

const testInput = () => {
  /*
  // app.component.ts
  <hello[name]="name"[myArray] = "myArray" > </hello>

  // hello.component.ts

  @Component({
    selector: 'hello',
    template: `<h1>Hello {{name}}!</h1>`,
    styles: [`h1 { font-family: Lato; }`]
  })
  export class HelloComponent implements OnInit {
    public array;
    @Input() name: string;
    @Input()
    set myArray(value) {
      if (value) {
        this.array = value;
      }
    }

    ngOnInit() {
      console.log('array is', this.array);
    }
  }
  */
}

const testOutput = () => {
  /*
  // Child
  @Component({
    selector: 'app-child',
    template: `<button class='btn btn-primary' (click)="valueChanged()">Click me</button> `
  })
  export class AppChildComponent {

    @Output() valueChange = new EventEmitter();
    Counter = 0;

    valueChanged() { // You can give any function name

      this.counter = this.counter + 1;
      this.valueChange.emit(this.counter);
    }
  }

  // PARENT
  import { Component, OnInit } from '@angular/core';
  @Component({
    selector: 'app-root',
    template: `<app-child (valueChange)='displayCounter($event)'></app-child>`
  })
  export class AppComponent implements OnInit {
    ngOnInit() {

    }
    displayCounter(count) {
      console.log(count);
    }
  }
*/
}

const testElementByClassName = () => {
  /*
  var cName = elementNodeReference.className;
  elementNodeRefere:w
  nce.className = cName;
Copy to Clipboard
cName is a string variable representing the class or space - separated classes of the current element.
    Example
  let el = document.getElementById('item');

  if (el.className === 'active') {
    el.className = 'inactive';
  } else {
    el.className = 'active';
  }

  // also note:
  elm.setAttribute('class', elm.getAttribute('class'))
  */
}

const testObservable = () => {
  /*
  // componentService.ts
  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';

  @Injectable()
  export class ComponentService {
    public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    constructor() { }
    onDataReceived = (close: boolean) => this.dataObsevable.next(close);
  }

  import { OnInit } from '@angular/core';
  import { ComponentService } from '../../componentService.ts';

  // Component
  export class Component implements OnInit {

    public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    constructor(
      private componentService: ComponentService
    ) { }

    // Is important to always call the method to subscribe in the ngOnInit or constructor
    ngOnInit() {
      this.onDataChangeReceived();
    }

    onDataChangeReceived = () => {
      this.componentService.onDataReceived.subscribe((change: boolean) => {
        if (change) {
          // ....
        }
      });
    }
  }
  */
}

const testCanActivate = () => {
/*
  // INTERFACE
  interface CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  }

  // COMPONENT

  class UserToken { }
  class Permissions {
    canActivate(user: UserToken, id: string): boolean {
      return true;
    }
  }

  @Injectable()
  class CanActivateTeam implements CanActivate {
    constructor(private permissions: Permissions, private currentUser: UserToken) { }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.permissions.canActivate(this.currentUser, route.params.id);
    }
  }

  {path: 'games', component: GameListComponent},
  {
      path: 'games/:id',
      canActivate: [GameDetailGuard],
      component: GameDetailComponent
  },
  */
}
