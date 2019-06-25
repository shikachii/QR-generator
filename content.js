const FinderPattern = [
	[1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 1],
	[1, 0, 1, 1, 1, 0, 1],
	[1, 0, 1, 1, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1],
]

const AlignmentPattern = [
	[1, 1, 1, 1, 1],
	[1, 0, 0, 0, 1],
	[1, 0, 1, 0, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1],
]

const WIDTH = 5, HEIGHT = 5

function printPattern(array, ctx, x, y){
	for(let i = 0; i < array.length; ++i){
		for(let j = 0; j < array[i].length; ++j){
			if(array[j][i] === 1) {
				ctx.fillStyle = "rgb(0,0,0)"
			}else{
				ctx.fillStyle = "rgb(255, 255, 255)"
			}
			ctx.fillRect(x+i*WIDTH, y+j*HEIGHT, WIDTH, HEIGHT)
		}
	}
}

function printTiming(length, ctx){
	for(let i = 0; i < length; ++i){
		if(i%2 == 0) ctx.fillStyle = "rgb(0,0,0)"
		else ctx.fillStyle = "rgb(255,255,255)"
		ctx.fillRect(6*WIDTH, i*HEIGHT, WIDTH, HEIGHT)
		ctx.fillRect(i*WIDTH, 6*HEIGHT, WIDTH, HEIGHT)
	}
}

chrome.extension.onRequest.addListener(() => {
	const url = window.location.href
	
	let dom = document.createElement("canvas")
	let ctx = dom.getContext("2d")

	printTiming(21, ctx)
	printPattern(FinderPattern, ctx, 0, 0)
	printPattern(FinderPattern, ctx, WIDTH*14, 0)
	printPattern(FinderPattern, ctx, 0, 14*HEIGHT)

	document.body.appendChild(dom)
})

class QR {
	constructor(length, data){
		this.mode = 0b0010
		this.length = length
		this.data = data
	}
}

