
	localStorage.setItem("count",0);
	const incCount = ()=>{
		var count = parseInt(localStorage.getItem("count"))+1;
		localStorage.setItem("count",count.toString());
		if(count%1000 == 0){
			//alert("Working"); //really works!
		}
	}
	setInterval(()=>{
		1000, incCount();
	})

