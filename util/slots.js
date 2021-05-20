// To check if we have any api available for the states 
const Table = require('tty-table')
const axios = require('axios');
const {config,options} = require('./config')
var inquirer = require('inquirer');
const chalk = require('chalk')

module.exports = function(districtid){
    var date = new Date() ; 
    var currdate = `${date.getDate()}-${String(date.getMonth()+1).padStart(2,"0")}-${date.getFullYear()}`;
// Make a request for a user with a given ID
inquirer
  .prompt([{
    type:"list",
    name:'choice',
    message:'Please chooose age group',
    choices:[
        {
            name:'All Ages',
            value:""
        },{
            name:"45+",
            value:"45"
        },
        {
            name:"18-45",
            value:"18"
        }

    ]
  }])
  .then(answers => {
    axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtid}&date=${currdate}`,config)
    .then(function (response) {
      // handle success
      // console.table();
      let header = [
          {
            value: "center",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Center Name",
            width: 80,
          },
          {
            value: "address",
            color: "red",
            alias: "Center Address",
            width: 140,
          },
          {
            value: "available",
            color: "red",
            alias: "Available Slot",
            width: 40,
          },
          {
            value: "age",
            color: "red",
            alias: "Age",
            width: 20,
          },
          {
            value: "date",
            color: "red",
            alias: "Date",
            width: 30,
          },
        ];
  
      var finalData = [] ; 
      var districtName;
      response.data.centers.forEach((item)=>{
          districtName = item.district_name;
          item.sessions.forEach((session)=>{
              if(answers.choice==""){
             // console.log(session) ; 
              let ourData = {
                  center:item.name,
                  address:item.address,
                  available: session.available_capacity,
                  age:session.min_age_limit,
                  date:session.date
              }
          finalData.push(ourData)
            }
          else if(answers.choice==session.min_age_limit){
             let ourData = {
                 center:item.name,
                 address:item.address,
                 available: session.available_capacity,
                 age:session.min_age_limit,
                 date:session.date
             }
             finalData.push(ourData)
            }
            })
      })
        const out = Table(header,finalData,options).render()
        console.log(chalk.blue.bgGreen.bold(`Date for which run -> ${currdate}`))
        console.log(chalk.blue.bgRed.bold(`District -> ${districtName}`))
        console.log(out); 
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

  
}