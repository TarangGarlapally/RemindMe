
const checkReminder = ()=>{
	const timestamp = Math.floor(Date.now()/1000).toString();
	const msg = localStorage.getItem(timestamp);
	//console.log(Math.floor(Date.now()/1000));
	if(msg !== null){
		alert(msg);
		localStorage.removeItem(timestamp);
	}
}

setInterval(()=>{
	1000, checkReminder();
})


