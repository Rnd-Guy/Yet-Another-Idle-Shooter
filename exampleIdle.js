var clicks = 0;
var manClicks = 0;
var autoclickers = 0;
var autoclickerCost = 10;

function clickButtonMan(num) {
	clicks+=num;
	manClicks+=num;
	document.getElementById("noOfClicks").innerHTML = clicks;
	document.getElementById("noOfManClicks").innerHTML = manClicks;
	if (clicks>=autoclickerCost) {
		document.getElementById("button2").style.color="black";
	};
};

function clickButtonAuto(num) {
	clicks+=num;
	document.getElementById("noOfClicks").innerHTML = clicks;
};



function clickButton2(num) {
	if (clicks >= autoclickerCost) {
		autoclickers+=num;
		clicks-=autoclickerCost;
		autoclickerCost+=2;
		document.getElementById("noOfAutoclickers").innerHTML = autoclickers;
		document.getElementById("noOfClicks").innerHTML = clicks;
		document.getElementById("cost").innerHTML = autoclickerCost;
		if (clicks<autoclickerCost) {
			document.getElementById("button2").style.color="red";
		}
	}
};




window.setInterval(function() {
	clickButtonAuto(autoclickers);
	if (clicks>=autoclickerCost) {
		document.getElementById("button2").style.color="black";
	};
},1000);