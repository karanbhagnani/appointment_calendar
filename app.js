let btn= document.querySelector(".calendar");
let slotUrl = "https://app.appointo.me/scripttag/mock_timeslots?";
let clickLi = document.querySelector(".availableSlots");
let addToCart = document.querySelector(".addToCart");

clickLi.addEventListener("click", () => {
    if(clickLi != ""){
        console.log(clickLi);
        addToCart.style.display = "block";
    }
    
  });

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


document.addEventListener('DOMContentLoaded', () => {
    const calendar = new VanillaCalendar('#calendar',{
        type: 'default',
        actions: {
            clickDay(event, self) {
                // console.log(self.selectedDates);
                let display = new Date (self.selectedDates);
                let display_date = document.querySelector(".display_date");
                display_date.innerHTML=display.toDateString()+" -Available Slots";
                let presentDate = document.querySelector("#present_date");
                presentDate.innerHTML=self.selectedDates;
                return presentDate;
            },
          },
          settings: {
            visibility: {
                weekend: false,
                today: true,
              },
          },
    });
    calendar.init();
  });

btn.addEventListener('click', async()=>{
    // loaderVisibility();
    getSlots();
    let availableSlotsList = await getSlots();
    // loaderVisibility();
    // console.log(availableSlotsList);
    showAvailableSlots(availableSlotsList);
})

// function loaderVisibility(){
//     let loader = document.querySelector(".loader");
//     if (slots == " "){
//         for (var i=0;i<loader.length;i+=1){
//             loader[i].style.display = 'flex';
//           }
//     }else{
//         for (var i=0;i<loader.length;i+=1){
//             loader[i].style.display = 'none';
//           }
//     }
// };



async function getDates(){
        await delay(10);
        let presentDate =  document.querySelector("#present_date").innerText;
        let date = new Date(presentDate), y = date.getFullYear(), m = date.getMonth();
        let firstDay = new Date(y, m, 1).toLocaleDateString("en-CA");
        let lastDay = new Date(y, m + 1, 0).toLocaleDateString("en-CA");
        return{
            firstDay, 
            lastDay
        }
}

async function getSlots(){
    try{
        await getDates();
        let start_date = (await getDates()).firstDay;
        console.log(start_date);
        let end_date = (await getDates()).lastDay;
        console.log(end_date);
        let res3 = await axios.get(slotUrl+`start_date=${start_date}&end_date=${end_date}`);
        let availableSlotArr = res3.data;
        let arrLen= res3.data.length;
        let selectedDate =  document.querySelector("#present_date").innerText;

        for (i=0;i<=arrLen;i++){
            if(selectedDate != "" && availableSlotArr[i].date == selectedDate){
                let availableSlotsList = availableSlotArr[i].slots;
                // console.log(availableSlotsList);
                return availableSlotsList; 
            }
            else if(selectedDate != "" && availableSlotArr[i].date != selectedDate){
                let message = "Slots Not Found";
                console.log(message);
            }
            else{
                let message = "Slots Not Found";
                console.log(message);
            }
        }

    }catch(e){
        console.log(e);
    }
}
let slotlist = document.querySelector(".availableSlots")

function showAvailableSlots(availableSlotsList){
    slotlist.innerText = "";
    for (slots of availableSlotsList){
        let slot = new Date(slots.start_time);
        // console.log(slot.toLocaleTimeString('en-US'));
        let li = document.createElement("li");
        li.classList.add("availableSlotsli");
        li.setAttribute("tabindex","1");
        li.innerText = slot.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        slotlist.appendChild(li);
    }
};

