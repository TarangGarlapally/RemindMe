
const checkReminder = ()=>{
	const timestamp = Math.floor(Date.now()/1000).toString();
	if(localStorage.getItem(timestamp)!==null){
		const msgs = "⏱️"+localStorage.getItem(timestamp).replaceAll("$","\n⏱️");
		// msgs.forEach(msg => {
		// 	alert(msg);
		// });

		//console.log(Math.floor(Date.now()/1000));
		if(msgs !== null){
			var audio = new Audio('1_second_tone.mp3');
			audio.play();
			setTimeout(()=>{alert(msgs)},200);
			localStorage.removeItem(timestamp);
	}
	}
}

setInterval(()=>{
	1000, checkReminder();
})


