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

/*
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
*/

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

const alignarr = [[], // 1
									[6, 18], // 2
									[6, 22], // 3
									[6, 26], // 4
									[6, 30], // 5
									[6, 34], // 6
									[6, 22, 38], // 7
									[6, 24, 42], // 8
									[6, 26, 46], // 9
									[6, 28, 50], // 10
									[6, 30, 54], // 11
									[6, 32, 58], // 12
									[6, 34, 62], // 13
									[6, 26, 46, 66], // 14
									[6, 26, 48, 70], // 15
									[6, 26, 50, 74], // 16
									[6, 30, 54, 78], // 17
									[6, 30, 56, 82], // 18
									[6, 30, 58, 86], // 19
									[6, 34, 62, 90], // 20
									[6, 28, 50, 72, 94]] // 21

// データコード語数(モード指定示+データ語数+データ本体+埋め草)
// とりあえずバージョン21まで対応, レベルMのみ
const datacodeSumArr = [
	16, 28, 44, 64, 86, 108, 124, 154, 182,
	216, 254, 290, 334, 365, 415, 453, 507,
	563, 627, 669, 714
]

class QR {
	constructor(data, level){
		this.version = 1
		this.length = data.length
		this.data = data
		this.qr = []
		this.datacode = []

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

	putAlignmentPattern(){
		const v = this.version-1
		console.log(alignarr[v].length)
		for(let i = 0; i < alignarr[v].length; ++i){
			for(let j = 0; j < alignarr[v].length; ++j){
				if(i == 0 && j == 0) continue;
				else if(i == 0 && j == alignarr[v].length-1) continue;
				else if(i == alignarr[v].length-1 && j == 0) continue;

				// 6, 18
				const offx = alignarr[v][i]-2; // 6, 6, 18, 18
				const offy = alignarr[v][j]-2; // 6, 18, 6, 18
				console.log(alignarr[v][i] + " " + alignarr[v][j])
				for(let x = 0; x < AlignmentPattern.length; ++x){
					for(let y = 0; y < AlignmentPattern.length; ++y){
						this.putPattern(x+offx, y+offy, AlignmentPattern[x][y])
					}
				}

			}
		}
	}

	printPattern(){
		for(let i = 0; i < this.size; ++i){
			console.log(this.qr[i])
		}
	}

	createDatacode(){
		let originDatacode = []
		// モード指定示(8ビットモードで0100)
		originDatacode.push(4);

		// 文字数指定示
		if(1 <= this.version && this.version <= 9){
			originDatacode.push(this.length)
		}else{
			// バージョン9以上なら16ビットの数値(8ビットずつにして格納)
			originDatacode.push(this.length >> 8)
			originDatacode.push(this.length & 255)
		}
		
		// データコード
		for(let i = 0; i < this.length; ++i){
			originDatacode.push(this.data.charCodeAt(i))
		}

		console.log(originDatacode)

		let num = 0
		for(let i = 0; i < originDatacode.length; ++i){
			// 4回左シフト
			if(i != 0) {
				num += (originDatacode[i] >> 4)
				this.datacode.push(num)
				num = 0
			}
			num += ((originDatacode[i] & 15) << 4)
		}
		if(num != 0) this.datacode.push(num)

		let tmp = 0
		while(this.datacode.length < datacodeSumArr[this.version]){
			if(tmp % 2 === 0) this.datacode.push(236)
			else this.datacode.push(17)
			tmp++
		}
		console.log(this.datacode)

	}
		
}

chrome.extension.onRequest.addListener(() => {
	const url = window.location.href
	const qr = new QR(
			"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
			//url
			//"1234567890abcdefghijklmnopqrstuvwxyz"
			, "M")
	
	let canvas = document.createElement("canvas")
	canvas.setAttribute("width",   WIDTH*qr.size.toString())
	canvas.setAttribute("height", HEIGHT*qr.size.toString())
	let ctx = canvas.getContext("2d")

	let urldiv = document.createElement("div")
	urldiv.setAttribute("class", "url")
	urldiv.innerHTML = qr.data

	// QRコードの生成に関する処理はコンストラクタ内で行うようにする
	const space = qr.size - 7*2
	qr.putFinderPattern(0, 0)
	qr.putFinderPattern(space+FinderPattern.length, 0)
	qr.putFinderPattern(0, space+FinderPattern.length)
	qr.putTimingPattern()
	qr.putAlignmentPattern()
	// qr.printPattern()
	
	qr.createDatacode()

	reflectPattern(qr, ctx)
	/*
	printTiming(21, ctx)
	printPattern(FinderPattern, ctx, 0, 0)
	printPattern(FinderPattern, ctx, WIDTH*14, 0)
	printPattern(FinderPattern, ctx, 0, 14*HEIGHT)
	*/

	let parentdiv = document.createElement("div")
	parentdiv.setAttribute("class", "qr")
	document.body.appendChild(parentdiv)

	parentdiv.appendChild(canvas)
	parentdiv.appendChild(urldiv)
})
