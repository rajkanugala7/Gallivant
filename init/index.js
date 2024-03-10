const mongoose=require("mongoose");
const initData=require("./data.js");

const Listing=require("../models/listing.js");



const Mongo_url='mongodb://127.0.0.1:27017/wanderLust';
//app.use(express.urlencoded({ extended: true }));


main().then(()=>{
    console.log("COnnected to DB successfull;")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(Mongo_url);
}


const initDB=async ()=>{
    await Listing.deleteMany();
    initData.data=initData.data.map((obj)=>({...obj ,owner:"658c67ff8ad1adf31ad708d5"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}
initDB();