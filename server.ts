import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
const request = require('request');
const https = require('https');
const fs = require('fs');
const path = require('path')
// The Express app is exported so that it can be used by serverless Functions.

export interface valueMap{
  key:string,
  value:string
}
function buildHeader(headers:valueMap[]){
  let _header: any = {};
  
  for (let header of headers) {
    _header[header.key] = header.value;
  }
  return _header;

}
function buildForm(forms:valueMap[]){
  let _form: any = {};
  
  for (let form of forms) {
    _form[form.key] = form.value;
  }
  return _form;

}
export function app(): express.Express {
  const server = express();
  
  let distFolder = join(process.cwd(), "browser");
  if (!existsSync(distFolder)) {
    distFolder = join(process.cwd(), 'dist/Angular12BaseProyect/browser');};
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.post('/hola', (req, res) => {
    res.send('Hello World from OTHER BUILD!')
  })

  server.post('/get/loveAPI', (req, res) => {
    const url = 'https://mocktarget.apigee.net/iloveapis';
  
    request.get(url, (error: any, response: any, body: any) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error en la solicitud');
      } else {
        res.send(body);
      }
    });
  });
server.use(express.json());
server.use(express.urlencoded({extended:true}));
  
  server.post('/API/GET', (req, res) => {
    var url = req.body.url;
    var headers =req.body.headers!=undefined? buildHeader(req.body.headers):null;
    var form = req.body.forms!=undefined?buildForm(req.body.forms):null;
    var body = req.body.body;

  // Aquí puedes implementar la lógica para manejar la solicitud GET
  // Puedes utilizar los datos recibidos en el cuerpo de la solicitud para construir la respuesta

  // Ejemplo de construcción de la respuesta
  const response = {
    message: 'Respuesta exitosa para la solicitud GET',
    url: url,
    headers: headers,
    forms: form,
    body: body
  };
  console.log(response)
  request.get({url, headers, form}, (error: any, response: any, body: any) => {
    if (error) {
      console.error(error);
      res.status(500).json({messaje:'Error en la solicitud',error});
    } else {
      res.status(200).send(body);
    }
  });
  });

  server.post('/API/POST', (req, res) => {
    var url = req.body.url;
    var headers =req.body.headers!=undefined? buildHeader(JSON.parse(req.body.headers)):null;
    var form = req.body.forms!=undefined?buildForm(req.body.forms):null;
    var body = req.body.body;

  // Aquí puedes implementar la lógica para manejar la solicitud GET
  // Puedes utilizar los datos recibidos en el cuerpo de la solicitud para construir la respuesta

  // Ejemplo de construcción de la respuesta
  const response = {
    message: 'Respuesta exitosa para la solicitud POST',
    url: url,
    headers: headers,
    forms: form,
    body: body
  };
  console.log(response)
  request.post({url, headers, form}, (error: any, response: any, body: any) => {
    if (error) {
      console.error(error);
      res.status(500).json({messaje:'Error en la solicitud',error});
    } else {
      res.status(200).send(body);
    }
  });
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const host = process.env['HOST'] || '0.0.0.0';
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://${host}:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
