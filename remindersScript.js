alert("hi");



var listOfTimestamps = [];
for(x in localStorage){
    if(!localStorage.hasOwnProperty(x)) continue;
    listOfTimestamps.push(x);
}
listOfTimestamps.sort();


for(i = 0; i<listOfTimestamps.length; i++){
    x = listOfTimestamps[i];
    const date = new Date(parseInt(x)*1000);
    const dateTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
    document.getElementById("allRemindersBox").innerHTML += "<div id = '"+x+"' style = 'padding:10px; background-color:lightblue; margin:4px;'>"+x+" : "+dateTime+" : "+localStorage[x]+"</div>";
    
    
    console.log(document.getElementById(x))
    console.log(x, " : ", localStorage[x]);
}