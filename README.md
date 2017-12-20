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

### On Linux

Assuming you were in your home directory when you ran *git clone*:

      sudo docker run -it -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped rtweed/qewd-server

or, to run it as a Daemon process:

      sudo docker run -d -p 8081:8080 -v ~/qewd-server-rest-examples:/opt/qewd/mapped rtweed/qewd-server

Note: the first time you run it, the Docker *qewd-server* Container has to be downloaded.  This will take a 
couple of minutes.  When you run it again, it will start immediately.


Now, using a REST Client (eg PostMan or Advanced Rest Client for Chrome), try the APIs, eg:

      http://192.168.1.100:8081/test/me

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
