let express = require("express");
let bodyParser = require("body-parser");

let app = express();
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();

});
app.use(bodyParser.json());
let fs  = require("fs");
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let filename = "customers.json";
let {customerData} = require("./task2-3.js")
app.get("/resetData" ,async function(req,res){
    try{
    let data = JSON.stringify(customerData)
    await fs.promises.writeFile(filename,data)
     res.status(200).send("Data reset successfull")}
    catch(err){res.status(400).send(err)}

})

app.get("/customers",async function(req,res){
    try{
    let data = await fs.promises.readFile(filename,"utf-8")
    res.send(data)}
    catch(err){res.sendStatus(400).send(err)}

})

app.post("/customers", async function(req,res){
    let {body} = req;
    try{
        let data = await fs.promises.readFile(filename,"utf-8")
        let obj = JSON.parse(data);
        console.log(req.body);
        obj.push(body);
        let data1 = JSON.stringify(obj);
        try{
        await fs.promises.writeFile(filename,data1)
            res.send(req.body )}
        catch(err){res.status(400).send(err)}
    }
    catch(err){res.status(400).send(err)}
})

app.put("/customers/:id", async function(req,res){
    let id = req.params.id;
    let body = req.body;
    try{
    let data = await fs.promises.readFile(filename,"utf-8")
        let obj = JSON.parse(data);
        let index = obj.findIndex((st)=>st.id===id);
        obj[index]= {id:id,...body}
        if(index){     
            console.log(index) 
        let data1 = JSON.stringify(obj);
        try{
        await fs.promises.writeFile(filename,data1)
        res.send("Customer updated successfully")}
        catch(err){res.send(err)}}
        else {res.status(400).send("No Customer Found")}}
        catch(err){res.status(400).send(err)}
})
        


app.delete("/customers/:id", async function(req,res){
    let {id }= req.params;
   try{
    let data = await fs.promises.readFile(filename,"utf-8")
        let stData = JSON.parse(data)
        let index = stData.findIndex(f1=>f1.id==id)
        if (index>=0) {
            stData.splice(index,1)
            console.log(stData)
            let data = JSON.stringify(stData)
            try{
            await fs.promises.writeFile(filename,data)
            res.send("Deletion successful")}
            catch(err){res.send(err)}
        }
        else {res.status(400).send("No customer found")}
        
    }
    catch(err){res.send(err)}


})