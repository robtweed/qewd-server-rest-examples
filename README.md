# qewd-server-example: A basic set of REST APIs to test on your Docker qewd-server
 
Rob Tweed <rtweed@mgateway.com>  
20 December 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

## Pre-Requisites

You must have Docker installed on your machine.

See the Docker documentation, but here's some quick instructions:

### Installing Docker on Linux

      sudo apt-get update
      sudo apt-get install docker.io

### Installing Docker on Raspberry Pi

      curl -sSL https://get.docker.com | sh


## Installing the Example APIs

Clone this repository onto the machine hosting your Docker *qewd-server* Container

eg, on Linux:

      git clone https://github.com/robtweed/qewd-server-rest-examples

You should now find a directory named qewd-server-rest-examples.

## Running the Examples

Start up the Docker *qewd-server* Container:

- mapping its internal port 8080 to the external port you want the host server to listen on
- mapping the *qewd-server-rest-examples* folder to the Container's /opt/qewd/mapped folder
- mapping the *qewd-server-rest-examples/www* folder to the Container's /opt/qewd/www folder

ie:

      docker run -d -p {{external_port}}:8080 -v {{/path/to/qewd-server-rest-examples}}:/opt/qewd/mapped -v {{/path/to/qewd-server-rest-examples}}/www:/opt/qewd/www rtweed/qewd-server

If you're using a Raspberry Pi (RPi), use the RPi-specific Docker version (*qewd-server-rpi*), ie:

      docker run -d -p {{external_port}}:8080 -v {{/path/to/qewd-server-rest-examples}}:/opt/qewd/mapped -v {{/path/to/qewd-server-rest-examples}}/www:/opt/qewd/www rtweed/qewd-server-rpi


### For example, on Linux

Assuming you were:

- in your home directory when you ran *git clone*
- you want to listen on port 8081

To run as a foreground process:

      sudo docker run -it -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped -v ~/qewd-server-rest-examples/www:/opt/qewd/www rtweed/qewd-server

or, to run it as a Daemon process:

      sudo docker run -d -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped -v ~/qewd-server-rest-examples/www:/opt/qewd/www rtweed/qewd-server

Note: the first time you run it, the Docker *qewd-server* Container has to be downloaded.  This will take a 
couple of minutes.  When you run it again, it will start immediately.

### For example, on a Raspberry Pi

Assuming you were:

- in your home directory when you ran *git clone*
- you want to listen on port 8081

To run as a foreground process:

      sudo docker run -it -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped -v ~/qewd-server-rest-examples/www:/opt/qewd/www rtweed/qewd-server-rpi

or, to run it as a Daemon process:

      sudo docker run -d -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped -v ~/qewd-server-rest-examples/www:/opt/qewd/www rtweed/qewd-server-rpi

Note: the first time you run it, the Docker *qewd-server-rpi* Container has to be downloaded.  This will take a 
couple of minutes.  When you run it again, it will start immediately.


## Test it out

Using a REST Client (eg PostMan or Advanced Rest Client for Chrome), try the APIs, eg:

      http://192.168.1.100:8081/test/me

      Change the IP address to that of your Docker's host machine, and the port to the one you specified when starting up the *qewd-server* Container

## What APIs are there?

There are two example routes:

      /test
      /api

**/test** invokes the *example-simple* module.  For its routes, see:

       ~/qewd-server-rest-examples/modules/example-simple/routes.json

The handler methods for each route are in the folder:

       ~/qewd-server-rest-examples/modules/example-simple/handlers


**/api** invokes the *example-db* module.  For its routes, see:

       ~/qewd-server-rest-examples/modules/example-db/routes.json

The handler methods for each route are in the folder:

       ~/qewd-server-rest-examples/modules/example-db/handlers

You'll see that these APIs include a set of CRUD examples for maintaining, accessing and searching persistent JavaScript Objects.  All the source code for the database access is included - see the folder:

       ~/qewd-server-rest-examples/modules/example-db/db


### The Database CRUD Demonstration APIs

Essentially the APIs implement a basic JSON Storage Server, allowing you to save, retrieve, search and delete JSON documents.  The documents can contain any valid JSON - there's no pre-defined schema for the documents.

It's something of a showcase for what's possible with QEWD's persistent JSON storage.

Here's a summary of the APIs - give them a try.

#### Save a JSON document into the database

API:

        POST /api/db/:documentName

        Request body should contain a JSON document

You decide what the Document Name is.  You can have as many separate documents as you like for each of your Document Names.

eg:

        POST /api/db/myDocs

         {
           "this": {
             "is": "cool",
             "works": "great"
           }
         }


If the JSON is valid (eg double quoted names and values (if strings)), your document will be assigned a numeric Id (starting at 1 and incrementing as you add each new document).

Successful response example:


         {
           "ok": true,
           "id": 23
         }


#### List the Ids for a given Document Name

This allows you to discover all the Ids for documents you've stored against a particular Document Name

API:

        GET /api/db/:documentName/list

eg:

        GET /api/db/myDocs/list

Returns an array of Id values.

Successful response example:

        [1,2]


#### Retrieve a specific JSON document for a specific Document Name

API:

        GET /api/db/:documentName/:id

eg:

        GET /api/db/myDocs/2

        Will retrieve document #2 from the myDocs collection

Successful response example:

        {"this":{"is":"cool","works":"great"}}


#### Delete a specific JSON document within a specific Document Name

API:

        DELETE /api/db/:documentName/:id

eg:

        DELETE /api/db/myDocs/2

        Will delete document #2 from the myDocs collection

Successful response example:

        {"ok":true}


#### Seaerch within a specific Document Name

When you save a document, index records are automatically created for each leaf-node path.  This API allows you search against these indices.

API:

        GET /api/db/:documentName/search?:path=:value[&:path=value..etc][&showDetail=true]

eg:

        GET /api/db/myDocs/search?this.works=great

        Will return an array of Ids of all documents in the myDocs collection that have a path of *this.works* with a value of *great*

Successful response example:

        ["2"]

If you add *showDetail=true* to the QueryString, it will retrieve the matching document contents too, eg:

        GET /api/db/myDocs/search?this.works=great&showDetail=true

Response:

        {"2":{"this":{"is":"cool","works":"great"}}}

You can specify as many path/value combinations as you like, eg

        GET /api/db/myDocs/search?this.works=great&this.is=cool&showDetail=true

        Response: {"2":{"this":{"is":"cool","works":"great"}}}

but:

        GET /api/db/myDocs/search?this.works=great&this.is=bad&showDetail=true

        Response: {}   // no matches

Feel free to hack the code to enhance the capabilities of this JSON Server.  Most of the information you'll need is already in the example code.  However, to discover the full capabilities of the built-in QEWD database storage see the [QEWD Training Course](http://docs.qewdjs.com/qewd_training.html) and read Parts 17 to 27


## NodeM / YottaDB Speed Test

As a bonus treat, the QEWD Server Examples Container includes a simple little interactive (WebSocket)
application that allows you to get an idea of the performance of the YottaDB database, accessed via 
the Node.js NodeM interface.

Once you have started the Container, point your browser at:

      http://192.168.1.100:8081/speedTest.index.html

*Note: change the IP address and port to match that used by your Container*

Click the button and it will send a message to one of the QEWD Worker processes which will
run a loop, setting nodes in a Global Storage document.  By default it will set 100,000 nodes. 
You can change the number of nodes to set by changing the value in the form field.

If you're interested, you can 
view the source code of the back-end message handler that actually performs this test 
at *~/qewd-server-rest-examples/modules/speedTest.js*


## How to set up your own APIs using the Docker *qewd-server* Container

This section will help to explain what the files in this repository are for.

First, create a directory in which you'll run *qewd-server*, eg *~/myAPIs*

The rest of these instructions will assume this directory name - adjust them to match the folder name you've
decided to use.

### Base Directory Files

You'll see from this repository's example that there are a number of files that *qewd-server* expects to find in the directory from which you run it, and which control its behaviour.

We'll refer to the directory from which you'll run *qewd-server* as the *Base Directory*.  In our case, the base directory will be *~/myAPIs*.

The Base Directory files are as follows:

- **startup.js**  (eg ~/myAPIs/startup.js).  This should normally contain:

         var config = require('./startup_config.json');
         config.jwt = require('./jwt_secret.json');
         var local_routes = require('./local_routes.json');
         
         module.exports = {
           config: config,
           routes: local_routes
        };

  The only time this pattern changes is when you want to use MicroServices.  However this is beyond the scope of this document.

- **startup_config.json**  (eg ~/myAPIs/startup_config.json).  This is a JSON file containing the basic
configuration settings you want to use for *qewd-server*.  Again, you just stick to this pattern:

        {
          "managementPassword": {{passsword used by the qewd-monitor application}},
          "serverName":         {{name for this QEWD instance, as displayed in the qewd-monitor application}},
          "port":               {{internal port on which QEWD listens}},
          "poolSize":           {{QEWD worker pool size}}
        }

  eg:

        {
          "managementPassword": "keepThisSecret!",
          "serverName": "My QEWD Server",
          "port": 8080,
          "poolSize": 2
        }

- **jwt_secret.json**  (eg ~/myAPIs/jwt_secret.json).  This is a JSON file that specifies the secret used by *qewd-server* for its JSON Web Tokens.  This should contain:

        {
          "secret": {{Your JWT Secret String}}
        }

  eg:

        {"secret": "2038dc5e-452c-42f0-8e50-00d03f4ae9ba"}


- **local_routes.json**  (eg ~/myAPIs/local_routes.json).  This is a JSON file containing an array that defines the API root path(s) and the associated handler module(s).  It should look like this:

        [
          {
            "path": {{API path route}},
            "module": "/opt/qewd/mapped/modules/{{moduleName}}"
          }
        ]

  eg:

        [
          {
            "path": "/api",
            "module": "/opt/qewd/mapped/modules/myTestAPIs"
          }
        ]

  Note that the module path that is used is the one used internally within the *qewd-server* container.

  You can optionally customise the error response that *qewd-server* returns if an invalid path is entered by the user, eg

        [
          {
            "path": "/api",
            "module": "/opt/qewd/mapped/modules/myTestAPIs",
            "errors": {
              "notfound": {
                "text": "Resource Not Recognised",
                "statusCode": 404
              }
            }
          }
        ]


- **install_modules.json** (eg ~/myAPIs/install_modules.json).  This is an optional JSON file that must be defined if your API handler module methods make use of any Node.js modules that are not already used by QEWD itself. The file, if present, must contain an array of module names.

  For example, if your handlers require the modules *request* and *traverse*, your *install_modules.json* file would contain the following array

        ["request", "traverse"]

  If your handlers don't require any additional modules, this file need not exist.

  If any modules are specified in this file, they are installed automatically each time you start the *qewd-server* Container.  QEWD does not start up until they are installed.


### Your API Handler Module

As described in the previous section, in the *local_routes.json* file, you specified the name/path of the Module(s) that will handle the incoming API routes. 

So the next step is to create and define each of these Modules.

You must create each Module in a directory named *modules* within your API directory.  For example, if your *local_routes.json* file contained:

        [
          {
            "path": "/api",
            "module": "/opt/qewd/mapped/modules/myTestAPIs"
          }
        ]

then you would create the directory:

        ~/myAPIs/modules

and within that, the directory:

        ~/myAPIs/modules/myTestAPIs

*myTestAPIs* should contain a module.  As such it should contain a number of files which are described in the next section.

### API Handler Module Files

- **package.json** (eg ~/myAPIs/modules/myTestAPIs/package.json).  This is a standard Node.js Module's *package.json* file.  At the very minimum it should contain a name and version property, eg:

        {
          "name": "myTestAPIs",
          "version": "1.0.0"
        }


- **index.js** (eg ~/myAPIs/modules/myTestAPIs/index.js).  Always use the following code:


        var router = require('qewd-router');
        var routes = require('./routeGenerator');
         
        module.exports = {
          restModule: true,
          init: function() {
            routes = router.initialise(routes, module.exports);
          }
        };


- **routeGenerator.js** (eg ~/myAPIs/modules/myTestAPIs/routeGenerator.js).  Always use the following code:

        var routeDef = require('./routes.json'); 
        var routes = [];
        routeDef.forEach(function(route) {
          route.handler = require('./handlers/' + route.use);
          delete route.use;
          routes.push(route);
       });
        module.exports = routes;

- **routes.json** (eg ~/myAPIs/modules/myTestAPIs/routes.json).  This is the file in which you define the set of REST APIs that will be used by your application.  The file must contain an array of route objects, eg:

        [
          {
            "path": "/test/me",
            "method": "GET",
            "use": "test"
          }
        ]
 
  Each route object is defined using 3 properties:

  - **path**: the API path.  This can define variable path components, eg /test/:a/:b   If a user enterned the path /test/hello/world then the variable *a* would contain the value *hello* and the variable *b* would contain the value *world*.  You'll see how these variables are accessed and handled later.

  - **method**: optionally defines the HTTP method for this route.  If *method* is not defined, the route will be available for all HTTP methods.

  - **use**: the handler method to be invoked for this route.  This method must exist in the Module's */handlers* sub-folder with the same file name and an extension of .js (eg ~/myAPIs/modules/myTestAPIs/handlers/test.js)


### Your Module's Handler Methods

You now create and define each of your API methods.  These are each defined as a module with the following signature/pattern:

        module.exports = function(args, finished) {
        
          // Your handler's logic goes here
          
          finished({{responseObject}});
        };


       where {{responseObject}} is a JSON response created by your handler.  This object is returned to the user/client as the API's response.


What your handler module does is up to you.

The *args* argument is an object containing all the elements of the incoming REST request.  You can easily inspect it by returning it in the responseObject, eg:

        module.exports = function(args, finished) {  
          finished(args);
        };


Note that any variables defined in the API route are available as properties of the *args* object, eg if the API path was */api/test/:a/:b* and the user entered */api/test/hello/world*, then:

        args.a = 'hello'
        args.b = 'world'


Some of the most commonly-used args properties are:

- req.method:  the HTTP request method
- req.query:   object containing any queryString (additional name/value pair) values
- req.body:    object containing the request body payload (eg for POST methods)
- req.headers: HTTP request headers


## Data Persistence using *qewd-server* and *qewd-server-rpi*

The *qewd-server* and RPi-specific *qewd-server-rpi* Docker Containers include [YottaDB](https://yottadb.com) as an embedded Document/JSON database.  BY default, any data you save using this module's CRUD APIs
will be lost when you stop and shut down the Container.

If you want to retain your data permanently on your host machine, follow the instructions that are included
 with the [yotta-gbldir-files](https://github.com/robtweed/yotta-gbldir-files) repository.


## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
