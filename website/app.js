/* Global Variables */
const ApiKey=",&appid=d24bf70d6dae818a6893be61edd0ae3c&units=metric"
const ApiUrl="https://api.openweathermap.org/data/2.5/weather?zip="
const urlserver="http://localhost:5000"
const zip=document.querySelector("#zip")
const feelings=document.querySelector("#feelings")
const date=document.querySelector("#date")
const temp=document.querySelector("#temp")
const content=document.querySelector("#content")
const generate=document.querySelector("#generate")

// Create a new date instance dynamically with JS
let d = new Date();
let newdate=d.toDateString()
// Event listener to add function to existing HTML DOM element
generate.addEventListener("click",Generatedata)

/* Function called by event listener */
function Generatedata(){
    const zibvalue= zip.value
    const feelingsvalue=feelings.value

    gitWeatherApi(ApiUrl,zibvalue,ApiKey).then((res)=>{
        console.log(res);
        // make destructing object to filter data
        const{main:{temp},name:city,weather:[{description}]}=res
        const obsend={
            newdate,
            temp:Math.round(temp),
            city,
            description,
            feelingsvalue
        };
        postData(urlserver + '/add',obsend)
        fetchDataInUi()
    })
}

/* Function to GET Web API Data*/
async function gitWeatherApi(ApiUrl,zibvalue,ApiKey){
    
    try {
            const apis=await fetch(ApiUrl + zibvalue + ApiKey)
            const data=await apis.json()
            if (data.cod != 200) {
                // display the error message on UI
                content.innerHTML = data.message;
                temp.innerHTML =''
                date.innerHTML =''
                setTimeout(_=>content.innerHTML = '', 2000)
              }
            return data
    } catch (error) {
        console.log("error",error)
    }
}
// post data to server
   async function postData(url = "", info = {})  {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
  
    try {
      const newres =await res.json();
      console.log(`You just saved`, newres);
      return newres;
    } catch (error) {
      console.log(error);
    }
  };

// Callback function to complete GET '/all'
  async function fetchDataInUi(){
    const res = await fetch(urlserver + "/all");
    try {
      const savedData = await res.json();
      date.innerHTML=savedData.newdate
        temp.innerHTML=savedData.temp+"&degC"
        content.innerHTML=`${savedData.description}<br>${savedData.city}<br>${savedData.feelingsvalue}`
                                   
    } catch (error) {
      console.log(error);
    }
  };
  