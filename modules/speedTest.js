/*

 ----------------------------------------------------------------------------
 | NodeM / YottaDB Speed Test                                               |
 |                                                                          |
 | Copyright (c) 2018 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  26 September 2018

*/

module.exports = {

  handlers: {
    runTest: function(messageObj, session, send, finished) {
      var max = messageObj.params.max || 10000;

      var gloName = 'qewdSpeedTest';

      var node = {
        global: gloName
      };
      this.db.kill(node);
      var start = Date.now();

      for (var i = 0; i < max; i++) {
        node = {
          global: gloName,
          subscripts: [i],
          data: Date.now()
        };
        this.db.set(node);
      }
      var finish = Date.now();
      var elap = (finish - start) / 1000;

      node = {
        global: gloName
      };
      this.db.kill(node);

      finished({
        no_of_sets: max,
        elapsed_time: elap,
        global_nodes_set_per_sec: max/elap
      });
    }
  }

};