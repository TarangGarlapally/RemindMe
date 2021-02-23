
const checkReminder = ()=>{
	const timestamp = Math.floor(Date.now()/1000).toString();
	const msg = localStorage.getItem(timestamp);
	//console.log(Math.floor(Date.now()/1000));
	if(msg !== null){
		var audio = new Audio('1_second_tone.mp3');
		audio.play();
		setTimeout(()=>{alert(msg)},200);
		localStorage.removeItem(timestamp);
	}
}

setInterval(()=>{
	1000, checkReminder();
})


