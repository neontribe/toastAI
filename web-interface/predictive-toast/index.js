exports.predictTime = function (toasts, options){
	options = options || {};
	var maxSeconds = options.maxSeconds || 300;
	var minSeconds = options.minSeconds || 60;
	var spread = options.spread || 120;
	
	var ranking = [];
    for (var x = 0;x <= (maxSeconds-minSeconds);x++){
    	ranking.push(0);
	}
		
    for (var toastindex in toasts){
    	var toast = toasts[toastindex];
    	toast.toastiness = Math.max(minSeconds, Math.min(maxSeconds, toast.toastiness));
    	var center = toast.toastiness - minSeconds;
    	for (var i =0;i<=spread;i++){
    		var arraypos = (center) - (spread/ 2) + i;

    		if (arraypos < 0 || arraypos >= ranking.length) continue;

    		var height = (spread/2) - (Math.abs(arraypos - center)); 
    		if(toast.rating == 0){
    			ranking[arraypos] += height;
    		}
    		else{
    			ranking[arraypos] -= height;
			}
		}	
    }
    var largestHeight = ranking[0];
	var largestHeightIndex = 0;
	for (var rankingIndex = 0; rankingIndex < ranking.length; rankingIndex++){
		if (ranking[rankingIndex] > largestHeight){
			largestHeight = ranking[rankingIndex];
			largestHeightIndex = rankingIndex;
		}
	}
    return largestHeightIndex + minSeconds;
}