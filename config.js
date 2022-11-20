
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
         