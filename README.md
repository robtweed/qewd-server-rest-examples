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


## Installing the Example APIs

Clone this repository onto the machine hosting your Docker *qewd-server* Container

eg, on Linux:

      git clone https://github.com/robtweed/qewd-server-rest-examples

You should now find a directory named qewd-server-rest-examples.

## Running the Examples

Start up the Docker *qewd-server* Container:

- mapping its internal port 8080 to the external port you want the host server to listen on
- mapping the *qewd-server-rest-examples* folder to the Container's /opt/qewd/mapped folder

ie:

      docker run -d -p {{external_port}}:8080 -v {{/path/to/qewd-server-rest-examples}}:/opt/qewd/mapped rtweed/qewd-server


### For example, on Linux

Assuming you were:

- in your home directory when you ran *git clone*
- you want to listen on port 8081

To run as a foreground process:

      sudo docker run -it -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped rtweed/qewd-server

or, to run it as a Daemon process:

      sudo docker run -d -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped rtweed/qewd-server

Note: the first time you run it, the Docker *qewd-server* Container has to be downloaded.  This will take a 
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



## How to set up your own APIs using the Docker *qewd-server* Container

This section will help to explain what the files in this repository are for.

First, create a directory in which you'll run *qewd-server*, eg *~/myAPIs*

The rest of these instructions will assume this directory name - adjust them to match the folder name you've
decided to use.

### Base Directory Files

You'll see from this repository's example that there are a number of files that *qewd-server* expects to find in the directory from which you run it, and which control its behaviour.

We'll refer to the directory from which you'll run *qewd-server* as the *Dase Directory*.  In our case, the base directory will be *~/myAPIs*.

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
