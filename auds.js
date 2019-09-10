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
		var stepHue=240;
		var bounceSpeed =1.1;
		var bounceAmount =100;

		function Upmouse(e){
			bounceSpeed = -0.5+(e.clientX/canvas.width)*15;
			bounceAmount = (e.clientY/canvas.height)*150;
		}
		
		function onResize(){
			if(canvas!=null){
			WIDTH = canvas.width;
			HEIGHT = canvas.height;
			}
		}

		function renderFrame() {
			baseHue-=bounceSpeed;
			requestAnimationFrame(renderFrame);
			x = 0;

			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "hsla(" + baseHue + ",100%, 5%, 5%)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

				for (var i = 0; i < bufferLength; i++) {
				barHeight = (dataArray[i]*dataArray[i])/200.0+1;
				var h = (baseHue+((stepHue*i)/bufferLength));
				var s = 100;
				var l = 40+barHeight/3.5;
				var v = Math.sin((baseHue+i)/100.0)*bounceAmount*((bufferLength-i)/(bufferLength));

				ctx.fillStyle = "hsla(" + h + "," + s + "%," + l + "%,15%)";
				ctx.fillRect((WIDTH+x)/2, HEIGHT/2.5 - barHeight+v, barWidth, barHeight*3);
				ctx.fillRect((WIDTH-x)/2, HEIGHT/2.5 - barHeight+v, barWidth, barHeight*3);

				x += barWidth;
			}
		}

		audio.play();
		renderFrame();
	};
};