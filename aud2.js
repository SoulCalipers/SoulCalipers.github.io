window.onload = function() {
	var file = document.getElementById("thefile");
	var audio = document.getElementById("audio");
	file.onchange = function() {
		var files = this.files;
		audio.src = URL.createObjectURL(files[0]);
		audio.load();
		audio.play();
		var context = new AudioContext();
		var src = context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();

		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var ctx = canvas.getContext("2d");
		canvas.onmousemove = function(event) {Upmouse(event)};

		src.connect(analyser);
		analyser.connect(context.destination);

		analyser.fftSize = 1024;

		var bufferLength = analyser.frequencyBinCount;
		console.log(bufferLength);

		var dataArray = new Uint8Array(bufferLength);

		var WIDTH = canvas.width;
		var HEIGHT = canvas.height;

		var barWidth = (WIDTH / bufferLength);
		var barHeight;
		var x = 0;
		var baseHue=0;
		var stepHue=360;
		var bounceSpeed =1.1;
		var bounceAmount =100;
		var moire=0.0;

		function Upmouse(e){
			bounceSpeed = -0.5+(e.clientX/canvas.width)*15;
			bounceAmount = (e.clientY/canvas.height)*150;
		}
		


		function renderFrame() {
			baseHue-=bounceSpeed;
			requestAnimationFrame(renderFrame);
			x = 0;
			moire+=0.0001;
			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "hsla(" + baseHue + ",100%, 5%, 8%)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			for (var i = 0; i < bufferLength; i++) {
				//barHeight = (dataArray[i]*dataArray[i])/200.0+1;
				barHeight = dataArray[i];
				arcHeight = barHeight+((bufferLength-i)/(bufferLength))*2;
				var h = (baseHue+((stepHue*i)/bufferLength));
				var s = 100;
				var l = 40+barHeight/3;
				var v = Math.sin((baseHue+i)/100.0)*bounceAmount*((bufferLength-i)/(bufferLength))*0.6;
				var v1 = Math.sin((baseHue+i)/100.0)*bounceAmount*(i/bufferLength)*0.3;
				ctx.fillStyle = "hsla(" + h + "," + s + "%," + l + "%,40%)";
				ctx.fillRect((WIDTH+x)/2, HEIGHT/2 - barHeight+v1, barWidth, barHeight*2);
				ctx.fillRect((WIDTH-x)/2, HEIGHT/2 - barHeight+v1, barWidth, barHeight*2);
				
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.strokeStyle = "hsla(" + (h-30) + "," + s + "%," + l + "%, 20%)";
				var dot = ((bufferLength-i)/bufferLength)*0.001;
				ctx.arc(WIDTH/2, HEIGHT/2, 6+x/2,Math.PI*1.5+v*moire-arcHeight/100,Math.PI*1.5+v*moire+arcHeight/100)+dot;
				ctx.stroke(); 
				ctx.beginPath();
				ctx.strokeStyle = "hsla(" + (h+30) + "," + s + "%," + l + "%, 40%)";
				ctx.arc(WIDTH/2, HEIGHT/2, 6+x/2,Math.PI*0.5+v1-arcHeight/100,Math.PI*0.5+v1+arcHeight/100)+dot;
				//ctx.arc(WIDTH/2, HEIGHT/2, 6+x/2,Math.PI*1.5+v+x*moire-arcHeight/100,Math.PI*1.5+v+x*moire+arcHeight/500);
				ctx.stroke();
				x += 6+v/30;
			}
		}

		audio.play();
		renderFrame();
	};
};