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

function putPattern(p, ctx, x, y){
	if(p === 1){ ctx.fillStyle = "rgb(0, 0, 0)" }
	else { ctx.fillStyle = "rgb(255, 255, 255)" }
	ctx.fillRect(x*WIDTH, y*HEIGHT, WIDTH, HEIGHT)
}

function reflectPattern(code, ctx){
	const arr = code.qr
	for(let i = 0; i < code.size; ++i){
		for(let j = 0; j < code.size; ++j){
			putPattern(arr[i][j], ctx, i, j)
		}
	}
}

const verarr = [[ 17,  14,  11,   7], // 1
								[ 32,  26,  20,  14], // 2
								[ 53,  42,  32,  24], // 3
								[ 78,  62,  46,  34], // 4
								[106,  84,  60,  44], // 5
								[134, 106,  74,  58], // 6
								[154, 122,  86,  64], // 7
								[192, 152, 108,  84], // 8
								[230, 180, 130,  98], // 9
								[271, 213, 151, 119], // 10
								[321, 251, 177, 137], // 11
								[367, 287, 203, 155], // 12
								[425, 331, 241, 177], // 13
								[458, 362, 258, 194], // 14
								[520, 412, 292, 220], // 15
								[586, 450, 322, 250], // 16
								[644, 504, 364, 280], // 17
								[718, 560, 394, 310], // 18
								[792, 624, 442, 338], // 19
								[858, 666, 482, 382], // 20
								[929, 711, 509, 403]] // 21

class QR {
	constructor(data, level){
		this.version = 1
		this.length = data.length
		this.data = data
		this.qr = []

		switch(level){
			case "L" : this.level = 0
								 break
			case "M" : this.level = 1
								 break
			case "Q" : this.level = 2
								 break
			case "H" : this.level = 3
								 break
			default : this.level = -1
								break
		}

		for(let i = 0; i < verarr.length; ++i){
			if(this.level === -1) break
			if(this.length <= verarr[i][this.level]){
				this.version = i+1; break
			}
			// console.log(this.length + " " + verarr[i][this.level])
		}

		this.size = 21 + (this.version-1) * 4

		this.qr = new Array(this.size)
		for(let i = 0; i < this.size; ++i)
			this.qr[i] = new Array(this.size).fill(0)
	}

	putPattern(x, y, p){
		if(0 <= x && x < this.size && 0 <= y && y < this.size){
			this.qr[x][y] = p;
		}
	}

	putFinderPattern(offx, offy){
		for(let i = 0; i < FinderPattern.length; ++i){
			for(let j = 0; j < FinderPattern.length; ++j){
				this.putPattern(i+offx, j+offy, FinderPattern[i][j])
			}
		}
	}

	putTimingPattern(){
		const finder = 7
		for(let i = finder; i < this.size-finder; ++i){
			const p = (i%2 == 1) ? 0 : 1
			this.putPattern(i, 6, p)
			this.putPattern(6, i, p)
		}
		// this.putPattern(8, this.size-finder, 1)
	}


	printPattern(){
		for(let i = 0; i < this.size; ++i){
			console.log(this.qr[i])
		}
	}
		
}

chrome.extension.onRequest.addListener(() => {
	const qr = new QR("1234567890abcdefghijklmnopqrstuvwxyz", "M")
	const url = window.location.href
	
	let dom = document.createElement("canvas")
	dom.setAttribute("width",  "800")
	dom.setAttribute("height", "800")
	let ctx = dom.getContext("2d")


	const space = qr.size - 7*2
	qr.putFinderPattern(0, 0)
	qr.putFinderPattern(space+FinderPattern.length, 0)
	qr.putFinderPattern(0, space+FinderPattern.length)
	qr.putTimingPattern()
	// qr.printPattern()

	reflectPattern(qr, ctx)
	/*
	printTiming(21, ctx)
	printPattern(FinderPattern, ctx, 0, 0)
	printPattern(FinderPattern, ctx, WIDTH*14, 0)
	printPattern(FinderPattern, ctx, 0, 14*HEIGHT)
	*/

	document.body.appendChild(dom)
})
