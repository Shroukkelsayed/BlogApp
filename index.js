const mysql2 = require('mysql2')
const express = require('express');
const app = express();

app.use(express.json());
const DBconnection = mysql2.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"blogapp"
})
DBconnection.connect(err=>{
    if (err) {
         console.error("fail to connect DB")
        
    } else {
         console.log("DB connected")
        
    }
}

)
// DBconnection.on('error', (e)=>{
// console.error("fail to connect DB")
// })
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.post('/auth/signup', (req, res, next )=>{
    const{ firstName, lastName , email , password}= req.body
    console.log({firstName, lastName, email, password})
    DBconnection.execute(' select u_email from users where u_email=?', [email], (err, data)=>{
    if (err) {
        return res.status(500).json({message:'fail to excute', err})
    }
    if(data.length){
       return res.status(409).json({message:'email exist'})

    }
    DBconnection.execute(' insert into users (u_firstName, u_lastName, u_email, u_password) values(?,?,?,?)',
         [firstName, lastName, email, password], (err, data)=>{
    if (err) {
        return res.status(500).json({message:'fail to excute', err})
    }

       return res.status(201).json({message:'Done'})

    })
})
})

app.post('/auth/login', (req, res, next )=>{
    const{  email , password}= req.body
    DBconnection.execute(' select u_id from users where u_email=? and u_password=?', [email, password], (err, data)=>{
    if (err) {
        return res.status(500).json({message:'fail to excute', err})
    }
    if(!data.length){
       return res.status(404).json({message:'email or password mismatch'})

    }
           return res.status(200).json({message:'login successfuly', user:data[0].u_id})

   
})
})

app.get('/user/:id/profile', (req, res, next)=>{
    const{id}= req.params;
    DBconnection.execute(' select u_id as id , concat(u_firstName, " ", u_lastName) as username, u_email as email , convert(DATEDIFF(NOW(), u_DOB)/ 365.5, int ) as age from users where u_id=?',
        [id],(err, data)=>{
             if (err) {
        return res.status(500).json({message:'fail to excute', err})
    }
         return res.status(200).json({message:'Done', user: data[0]})
        })

})

app.patch('/user/:id', (req,res, next)=>{
    const {id}= req.params;
    const {DOB , gender}= req.body;

    DBconnection.execute('update users set  u_DOB = IFNULL(?, u_DOB),u_gender = IFNULL(?, u_gender) WHERE u_id = ?' , [DOB ?? null, gender ?? null, id], 
        (err, data)=>{
            if (err){
                return res.status(500).json({message:'fail to excute', err})
            }
                 return data.affectedRows ?res.status(200).json({message:'Done',  data}) : res.status(404).json({message:'in-valid account id'})

        } 
    )
})

app.delete('/user/:id', (req,res, next)=>{
    const {id}= req.params;

    DBconnection.execute('delete from users WHERE u_id = ?' , [ id], 
        (err, data)=>{
            if (err){
                return res.status(500).json({message:'fail to excute', err})
            }
                 return data.affectedRows ?res.status(204).json() : res.status(404).json({message:'in-valid account id'})

        } 
    )
})

app.get('/user', (req,res, next)=>{
    const {searchKey}= req.query;

    DBconnection.execute(`select * from users WHERE u_firstName like '${searchKey}%'`, 
        (err, data)=>{
            if (err){
                return res.status(500).json({message:'fail to excute', err})
            }
                 return res.status(200).json({message:'Done',  data})
        } 
    )
})

app.post('/blog', (req, res, next)=>{
    const {title, content, userId} = req.body;
    DBconnection.execute('select * from users where u_id=?', [userId], (err, data) =>{
        if (err) {
          return res.status(500).json({message:'fail to excute', err})
        } 
        if (!data.length) {
          return res.status(404).json({message:'in-valid account id'})
        }
        DBconnection.execute('insert into blogs (b_title , b_content, b_userId) values (?,?,?)', [title, content, userId], (err, data)=>{
            if (err) {
          return res.status(500).json({message:'fail to excute', err})
        } 
          return res.status(201).json({message:'Done', data})
        })
        
    })
})

app.get('/blog', (req, res, next)=>{
    DBconnection.execute('select * from blogs left join users on users.u_id = blogs.b_userId union all select * from blogs right join users on users.u_id = blogs.b_userId ', (err, data) =>{
        if (err) {
          return res.status(500).json({message:'fail to excute', err})
        } 
       
          return res.status(200).json({message:'done', data})
       
        
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});