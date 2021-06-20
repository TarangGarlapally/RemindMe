//document.getElementById("count").innerHTML = localStorage.getItem("count");
//document.getElementById("show").innerHTML = + (new Date('2021-01-17T03:24:00'))/1000;

document.getElementById("form").addEventListener("submit", (e) => {setReminder();});

document.getElementById("form").addEventListener("input", (e) => {validateInput(e);});

function setReminder(){
	console.log("Setting");
	var timestamp = Math.floor(+ new Date(document.getElementById("date").value)/1000);
	
	if(localStorage.getItem(timestamp) == null){
		localStorage.setItem(timestamp.toString(),document.getElementById("msg").value);
	}
	else{
		localStorage.setItem(timestamp.toString(), localStorage.getItem(timestamp)+"$"+document.getElementById("msg").value);
	}
	

	//localStorage.setItem("Date", Math.floor(Date.now()/1000));
	alert("Done!");
}

function validateInput(e){
	var str = e.target.value;
	console.log(str.slice(-1));
	if(str.slice(-1) == "$"){
		document.getElementById("msg").value = str.substring(0, str.length - 1);
	}
}