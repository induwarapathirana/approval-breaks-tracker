function dataUpdating_breaks()
{
  var sheetInterface = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`${interfaceSheetName}`); // write sheet name
  var sheetBreaks = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Broken Approvals"); // write sheet name 
  var startDate = Utilities.formatDate(sheetInterface.getRange(19,2).getValue(), "GMT+5.30", "dd/MM/yyyy");
  
  var page_number = 1
  var allData = []
  try{
  do{
    var queryApplications = `query{\n  allOpportunityApplication(\n    filters:{\n \tsort: created_at\n\tperson_home_mc:1585\n status:\"approval_broken\"\n \n\t\t\t\n  date_matched:{from:\"${startDate}\"}\n     \n    }\n    page:${page_number} \n    per_page:2000\n  ){\n    data{\n      id\n      person{\n  \tcreated_at\n\t\t      full_name\n        id\n        contact_detail{        phone\n        }        home_lc{\n          name\n        }\n  home_mc{\n          name\n        }\n cvs{\n          url\n        }\n   }\n opportunity{\n    id\n   title\n    programme{\n          short_name_display\n        }\n      }\n      created_at\n  \n\t\t\tdate_matched\n\t\t\tdate_approved\n\t\t\tdate_approval_broken\n\t\t\tdate_realized\n\t\t\texperience_end_date\n\t\t\t\n    status\n      host_lc_name\n  home_mc{\n        name\n      }\n   }\n  }\n}`
    var query = JSON.stringify({query: queryApplications})
    var data = dataExtraction(query)
    if(data.length != 0)  allData.push(data)
    page_number++
  }while(data.length !=0)

  var ids = sheetBreaks.getRange(1,1,sheetBreaks.getLastRow(),1).getValues()
  var ids = ids.flat(1)
  var newRows = []
  for(let data of allData){
    for(let i = 0; i < data.length; i++){
      Logger.log(i)
        
        var index = ids.indexOf(parseInt(data[i].id))
        if(index<0){      
          
          Logger.log("new")
          newRows.push([
          
          data[i].id ? data[i].id:"",
          data[i].person ? data[i].person.full_name :"",
          data[i].person.contact_detail ? data[i].person.contact_detail.phone:"",
          data[i].person ? data[i].person.id:"",
          data[i].opportunity ? data[i].opportunity.id:"",
          data[i].opportunity ? data[i].opportunity.title:"",
          data[i].person.home_lc.name,
          data[i].person.home_mc.name,
          data[i].opportunity.programme ? data[i].opportunity.programme.short_name_display : "",
          data[i].status ? data[i].status :"",
          data[i].host_lc_name,
          data[i].home_mc.name,
          data[i].person.cvs[0]? data[i].person.cvs[0].url: "-",
          data[i].person.created_at.toString().substring(0,10),  
          data[i].created_at.toString().substring(0,10),  
          data[i].date_matched != null? data[i].date_matched.toString().substring(0,10):"",  
          data[i].date_approval_broken != null?data[i].date_approval_broken.toString().substring(0,10):"",
           
          ])
        }
        else{
          
          Logger.log("old")
          var row = []
          row.push([
          
          data[i].id ? data[i].id:"",
          data[i].person ? data[i].person.full_name :"",
          data[i].person.contact_detail ? data[i].person.contact_detail.phone:"",
          data[i].person ? data[i].person.id:"",
          data[i].opportunity ? data[i].opportunity.id:"",
          data[i].opportunity ? data[i].opportunity.title:"",
          data[i].person.home_lc.name,
          data[i].person.home_mc.name,
          data[i].opportunity.programme ? data[i].opportunity.programme.short_name_display : "",
          data[i].status ? data[i].status :"",
          data[i].host_lc_name,
          data[i].home_mc.name,
          data[i].person.cvs[0]? data[i].person.cvs[0].url: "-",
          data[i].person.created_at.toString().substring(0,10),  
          data[i].created_at.toString().substring(0,10),  
          data[i].date_matched != null? data[i].date_matched.toString().substring(0,10):"",  
          data[i].date_approval_broken != null?data[i].date_approval_broken.toString().substring(0,10):"",

          
          ])
          sheetBreaks.getRange(index+1,1,1,row[0].length).setValues(row)

        }
      }
    }
    if(newRows.length > 0){
        sheetBreaks.getRange(sheetBreaks.getLastRow()+1,1,newRows.length,newRows[0].length).setValues(newRows)
    }
  

    sheetInterface.getRange(19,3).setValue("Succeeded")
    sheetInterface.getRange(19,4).setValue(new Date)
  }
  catch(e){
    console.log(e.toString())
     sheetInterface.getRange(19,3).setValue("Failed")
     sheetInterface.getRange(19,4).setValue(new Date)
  }
  
}

