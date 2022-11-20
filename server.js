const express =require('express');
const multer=require('multer');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const emailval=require("./libs/emailval");
 app.use(bodyParser.json());
   

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'password', 
  database: 'project_management'
});
   

conn.getConnection((err) =>{
  if(err) throw err;
  console.log('Mysql Connected ');
});
   


app.post('/api/sign_up',(req, res) => {


  //check email is valid or not
  let isEmail = emailval(req.body.email)
  if(isEmail==true)
 
  {
let data = {name: req.body.name, email: req.body.email,password:req.body.password,status: req.body.status,user_type:req.body.user_type};

  let sqlQuery = "INSERT INTO signup_tbl SET ?";

   conn.query(sqlQuery, data,(err, results) => {
    
    if(err) throw err;
   
  
  res.send(apiResponse(results));
  });

  }
  else {
		res.send('Please enter valid email id!');
		res.end();
	}
 
}); 



app.post('/api/login', function(req, res) {
	
	let email = req.body.email;
	let password = req.body.password;
  let user_type=req.body.user_type;
	
	if (email && password) {
		
		conn.query('SELECT * FROM signup_tbl WHERE email = ? AND password = ? AND user_type = ? ', [email, password,user_type], function(err, results) {
			// If there is an issue with the query, output the error
			if (err) throw err;
			
			if (results.length > 0) {
        if (user_type == "mentor"){
          console.log("mentor login");	
         // res.render("/mentor_profile")

        }
        else{
          console.log("employee login");	
         // res.render("/employee_profile")
        }
				
			
				console.log("successfully login");			
			} 
      else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

//File upload
const storage = multer.diskStorage({
  //destination for files
  destination: function (req, file, callback) {
    callback(null, './upload/images');
  },

  //add back the extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

// handle single file upload

//Add Tehcnologies

app.post('/api/add_technologies', upload.single('Image'), (req, res) => {
  const file = req.file;
  if (!file) {
     return res.status(400).send({ message: 'Please upload a file.' });
  }
  let data = {name:req.body.name,Image:req.file.filename,technologies:req.body.technologies,status:req.body.status};
  
  let sqlQuery1 = "INSERT INTO technologies_tbl SET ?";

  conn.query(sqlQuery1, data,(err, results) => {
    if (err) throw err;
      return res.send({ message: 'File is successfully.', file,results });
   });
});
  
//Add project by mentor

 app.post('/api/add_project',(req, res) => {


 let sqlQuery2 = "SELECT * FROM signup_tbl WHERE user_id=" + req.body.user_id +" and user_type='mentor'"; 

   if(sqlQuery2.length>0)
   {
      let data = {project_requirements: req.body.project_requirements, start_date: req.body.start_date,end_date: req.body.end_date,documents: req.body.documents,member_id: req.body.member_id,technology: req.body.technology,assigned_by:req.body.user_id};
      
      let sqlQuery3 = "INSERT INTO project_tbl SET ?";
      
      conn.query(sqlQuery3, data,(err, results) => {
        if(err) throw err;
//         let sqlQuery4 = "SELECT * FROM signup_tbl WHERE user_id=" + req.body.member_id+"";

      

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'pragyan87.das@gmail.com',
//     pass: ''
//   }
// });
//         let email=sqlQuery4.email
//         var mailOptions = {
//           from: 'pragyan87.das@gmail.com',
//           to: `${email}`,
//           subject: 'Sending Email using Node.js',
//           text: 'That was easy!'
//         };
        
//         transporter.sendMail(mailOptions, function(error, info){
//           if (error) {
//             console.log(error);
//           } else {
//             console.log('Email sent: ' + info.response);
//           }
//         });
        res.send(apiResponse(results));
      });
    }
    else{
      res.send('Incorrect User');
    }
  });

  //Mentor can see projects added by them only
  app.get('/api/mentor_profile',(req, res) => {
      let sqlQuery = "SELECT * FROM project_tbl WHERE assigned_by=" + req.body.user_id+"";
        
     conn.query(sqlQuery, (err, results) => {
        if(err) throw err;
        res.send(apiResponse(results));
      });
    });

//Employees can see projects in which they are added as members
    app.get('/api/employee_profile',(req, res) => {
      let sqlQuery = "SELECT * FROM project_tbl WHERE member_id=" + req.body.user_id+"";
        
       conn.query(sqlQuery, (err, results) => {
        if(err) throw err;
        res.send(apiResponse(results));
      });
    });


    //Create task list table
    app.post('/api/add_project_dashboard',(req, res) => {
 

  
      let data = {Estimated_duration: req.body.Estimated_duration, Final_time: req.body.Final_time,
        Status_completed:req.body.Status_completed,Comment: req.body.Comment,Reply:req.body.Reply,QA:req.body.QA,code_quality:req.body.code_quality,Approved_client:req.body.Approved_client,Developer_name:req.body.Developer_name,date:req.body.date};
      
        let sqlQuery = "INSERT INTO project_dashboard SET ?";
      
        conn.query(sqlQuery, data,(err, results) => {
          
          if(err) throw err;
         
        
        res.send(apiResponse(results));
        });
       
      }); 

      //View task list table
      app.get('/api/project_dashboard',(req, res) => {
        let sqlQuery = "SELECT * FROM project_dashboard";
          
        let query = conn.query(sqlQuery, (err, results) => {
          if(err) throw err;
          res.send(apiResponse(results));
        });
      });
  



   
function apiResponse(results){
  return JSON.stringify({"status": 200, "error": null, "response": results});
}

app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});
     
          
          

 