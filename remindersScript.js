alert("hi");

function parseTime(hours, minutes) { 
    var meridian = "";
    if(hours<12)
        meridian = "AM";
    else
        meridian = "PM";

    if(minutes<10)
        minutes = "0" + minutes;

    if(hours > 12)
        hours = hours - 12;
    if(hours<10){
        hours = "0" + hours;
    }
    if(hours === 0)
        return "12:" + minutes + " " + meridian;
    return hours + ":" + minutes + " " + meridian;
}



var listOfTimestamps = [];
for(x in localStorage){
    if(!localStorage.hasOwnProperty(x)) continue;
    listOfTimestamps.push(x);
}
listOfTimestamps.sort();


for(i = 0; i<listOfTimestamps.length; i++){
    x = listOfTimestamps[i];
    const date = new Date(parseInt(x)*1000);
    const dateTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear() + " &nbsp;&nbsp;" + parseTime(date.getHours(), date.getMinutes());
    document.getElementById("allRemindersBox").innerHTML += "<div id = '"+x+"' class = 'reminderTile'><p class = 'reminderMessage'><span class='glyphicon glyphicon-calendar'></span> &nbsp;"+dateTime+"&nbsp;&nbsp;&nbsp;&nbsp;"+localStorage[x]+"</p><p class = 'reminderOptions'></p></div>";
    
    
    console.log(document.getElementById(x))
    console.log(x, " : ", localStorage[x]);
}