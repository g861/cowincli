// To check if we have any api available for the states 


const Table = require('tty-table')
const axios = require('axios');
const {config,options} = require('./config')
module.exports = function(){
// Make a request for a user with a given ID
axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states',config)
  .then(function (response) {
    // handle success
    // console.table();
    let header = [{
        value: "state_id",
        headerColor: "cyan",
        color: "white",
        align: "left",
        alias: "STATE ID",
        width: 20
      },
      {
        value: "state_name",
        color: "red",
        alias: "State Names",
        width: 40,
      }]
      const out = Table(header,response.data.states,options).render()
      console.log(out); 
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  
}