//document.getElementById("count").innerHTML = localStorage.getItem("count");
//document.getElementById("show").innerHTML = + (new Date('2021-01-17T03:24:00'))/1000;

document.getElementById("form").addEventListener("submit", (e) => {setReminder();});


function setReminder(){
	console.log("Setting");
	var timestamp = Math.floor(+ new Date(document.getElementById("date").value)/1000);
	
	localStorage.setItem(timestamp.toString(),document.getElementById("msg").value);

	//localStorage.setItem("Date", Math.floor(Date.now()/1000));
	alert("Done!");
}