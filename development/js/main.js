var readyStateCheckInterval = setInterval(function() {
	    if (document.readyState === "complete") {
	        clearInterval(readyStateCheckInterval);
	        init();
	    }
	}, 100),
	frame = 0,// Start at frame 0
	totalFrames = Object.keys(frame_data).length - 1,// Change to 0 index
	audioPlaying = true,
	audioMute = false,
	autoAdvance = false,
	iOS = /iPad|iPhone|iPod/.test(navigator.userAgent),
	direction,
	sound;

var diagnosticsLabels = ["frame: ","totalFrames: ","audioPlaying: ","audioMute: ","autoAdvance: "];

var browserPrefix;
navigator.sayswho= (function(){
  var N = navigator.appName, ua = navigator.userAgent, tem;
  var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem = ua.match(/version\/([\.\d]+)/i))!== null) M[2] = tem[1];
  M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  M = M[0];
  if(M == "Chrome") { browserPrefix = "webkit"; }
  if(M == "Firefox") { browserPrefix = "moz"; }
  if(M == "Safari") { browserPrefix = "webkit"; }
  if(M == "MSIE") { browserPrefix = "ms"; }
})();

function init(){
	logMessage("template ready");
	document.getElementById('next').onclick = function(){moveNext();};
	document.getElementById('previous').onclick = function(){movePrevious();};
	document.getElementById('mute-loud').onclick = function(){toggleAudioMute();};
	document.getElementById('play-pause').onclick = function(){toggleAudioPlay();};
	enterFrame(0);//Initialize frame + animations
}

function enterFrame(frameNum){
	runAnimations(frameNum);
	var nextBtn = document.getElementById('next');
	var prevBtn = document.getElementById('previous');
	nextBtn.style.opacity = "1";
	nextBtn.style.pointerEvents = "all";
	prevBtn.style.opacity = "1";
	prevBtn.style.pointerEvents = "all";
	if(frameNum <= 0 ){
		frame = 0;
		prevBtn.style.opacity = ".1";
		prevBtn.style.pointerEvents = "none";
		logMessage("on first slide");
	} else if (frameNum >= totalFrames){
		frame = totalFrames;
		nextBtn.style.opacity = ".1";
		nextBtn.style.pointerEvents = "none";
		logMessage("on last slide");

	} else {
		logMessage("navigated successfully");
	}
	return;
}

function toggleAudioMute(){
	if(audioMute){
		document.getElementById('mute-loud').style.background = "url('./img/icons/audio-loud.png')";
		audioMute = false;
	} else {
		document.getElementById('mute-loud').style.background = "url('./img/icons/audio-mute.png')";
		audioMute = true;
	}
	logMessage("toggle mute");
}

function toggleAudioPlay(){
	if(audioPlaying){
		document.getElementById('play-pause').style.background = "url('./img/icons/audio-play.png')";
		audioPlaying = false;
	} else {
		document.getElementById('play-pause').style.background = "url('./img/icons/audio-pause.png')";
		audioPlaying = true;
	}
	logMessage("toggle play");
}

function playAudio(){
	sound = new Howl({
	  urls: ['sound.mp3', 'sound.ogg', 'sound.wav'],
	  autoplay: true,
	  loop: true,
	  volume: 0.5,
	  onend: function() {
	    alert('Finished!');
	  }
	});
}

function moveNext(){
	direction = 1;// forwards
	frame++;
	enterFrame(frame);
}

function movePrevious(){
	direction = 0;// backwards
	frame--;
	enterFrame(frame);
}

function runAnimations(frameNum){
	if(frame_data[frameNum] !== undefined){
		var elementsToAnimate = frame_data[frameNum].elements;
		for(var i=0;i<Object.keys(elementsToAnimate).length;i++){
			var el_name = Object.keys(elementsToAnimate)[i];
			resetStyles(el_name);
			var el_id = elementsToAnimate[el_name];
			var el_styles = el_id.styles;
			var el_delay = el_id.delay;
			var el_duration = el_id.duration;
			if(el_delay === undefined) el_delay = 100;
			if(el_duration === undefined) el_duration = 400;
			var el_DOM = document.getElementById(el_name);
			if(el_DOM !== null){
				//setVendor(el_DOM,"transition", "all "+el_duration+"ms ease-out "+el_delay+"ms");
				el_DOM.style.transition = "all "+el_duration+"ms ease-out "+el_delay+"ms";
				for (var key in el_styles) {
				  if (el_styles.hasOwnProperty(key)) {
				    el_DOM.style[key] = el_styles[key];
				  }
				}
			} else {
				console.log('cant find #'+el_name);
			}
		}
	}
}

/*
	Testing Functions
*/
function logMessage(msg){
	var container = document.getElementById('diagnostic-panel');
	var diagnostics = [frame,totalFrames,audioPlaying,audioMute,autoAdvance];
	var display_info = msg+"<br/>------------------------------------<br/>";
	for(var i = 0;i<diagnostics.length;i++){
		display_info+= diagnosticsLabels[i]+diagnostics[i]+"<br/>";
	}
	container.innerHTML = display_info;
}

function randomColor(){
	//return '#'+Math.floor(Math.random()*16777215).toString(16);
	//return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'56789A',4);
	return "#444";
}

window.addEventListener('load', function() {
	if(iOS){
    	new FastClick(document.body);
	}
}, false);

/*
 input: String such as 'graphic-01c'
*/
function resetStyles(el_to_reset){
	if(document.getElementById(el_to_reset)!==null){
		document.getElementById(el_to_reset).removeAttribute('style');
	} else {
		"can't find item to reset";
	}
}

function setVendor(element, property, value) {
  element.style["-webkit-" + property] = value;
  element.style["-moz-" + property] = value;
  element.style["-ms-" + property] = value;
  element.style["-o-" + property] = value;
  element.style[property] = value;
}

// function saveToDisk(fileURL, fileName) {
//     // for non-IE
//     if (!window.ActiveXObject) {
//         var save = document.createElement('a');
//         save.href = fileURL;
//         save.target = '_blank';
//         save.download = fileName || 'unknown';

//         var event = document.createEvent('Event');
//         event.initEvent('click', true, true);
//         save.dispatchEvent(event);
//         (window.URL || window.webkitURL).revokeObjectURL(save.href);
//     }

//     // for IE
//     else if ( !! window.ActiveXObject && document.execCommand)     {
//         var _window = window.open(fileURL, '_blank');
//         _window.document.close();
//         _window.document.execCommand('SaveAs', true, fileName || fileURL);
//         _window.close();
//     }
// }

// saveToDisk('../css/main.css','main.css');
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.offsetHeight, 
                       html.clientHeight, html.offsetHeight );

var width = Math.max( body.offsetWidth, 
                       html.clientWidth, html.offsetWidth );

if(!iOS){
	document.onmousemove = handleMouseMove;
}

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism
    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    // Use event.pageX / event.pageY here
    moveParallax(document.getElementById("graphic-01e"), event.pageX);
    moveParallax(document.getElementById("graphic-01b"), .2*event.pageX);
    moveParallax(document.getElementById("graphic-01d"), -event.pageX);
}	

function moveParallax(obj,val){
	console.log('before' + obj.offsetLeft);
	setVendor(obj,"transition", "all 0ms ease-out 0ms");
	var valtest;
	if(val < 0){
		if(val < -.5){
			valtest = -(val)*.05;
		} else {
			valtest = val;
		}
	} else {
		if(val > .5){
			valtest = -(val)*.05;
		} else {
			valtest = val;
		}
	}
	obj.style.marginLeft = (50+valtest)*.05 +"%";
	console.log('after' + obj.offsetLeft);
}