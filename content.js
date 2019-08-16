const WIDTH = 5, HEIGHT = 5

function putPattern(p, ctx, x, y){
	if(p === 1){ ctx.fillStyle = "rgb(0, 0, 0)" }
	else if(p === 2) { ctx.fillStyle = "rgb(100, 100, 100)" }
	else { ctx.fillStyle = "rgb(255, 255, 255)" }
	ctx.fillRect(x*WIDTH, y*HEIGHT, WIDTH, HEIGHT)
}

function reflectPattern(code, ctx){
	const arr = code.qr
	for(let i = 0; i < code.size; ++i){
		for(let j = 0; j < code.size; ++j){
			if(code.reserved[i][j] === false) putPattern(2, ctx, i, j)
			else putPattern(arr[i][j], ctx, i, j)
		}
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
	const space = qr.size - (FinderPattern.length-1)*2
	qr.putFinderPattern(0-1, 0-1)
	qr.putFinderPattern(space+FinderPattern.length-1, 0-1)
	qr.putFinderPattern(0-1, space+FinderPattern.length-1)
	qr.putTimingPattern()
	qr.putAlignmentPattern()
	// qr.printPattern()
	
	qr.createDatacode()

	reflectPattern(qr, ctx)

	let parentdiv = document.createElement("div")
	parentdiv.setAttribute("class", "qr")
	document.body.appendChild(parentdiv)

	parentdiv.appendChild(canvas)
	parentdiv.appendChild(urldiv)
})
