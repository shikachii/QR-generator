const WIDTH = 5, HEIGHT = 5

function putPattern(p, ctx, x, y){
	if(p === 1){ ctx.fillStyle = "rgb(0, 0, 0)" }
	else if(p === 2) { ctx.fillStyle = "rgb(100, 100, 100)" }
	else if(p === 3) { ctx.fillStyle = "rgb(100,   0,   0)" }
	else if(p === 4) { ctx.fillStyle = "rgb(  0, 100,   0)" }
	else if(p === 5) { ctx.fillStyle = "rgb(  0,   0, 100)" }
	else { ctx.fillStyle = "rgb(255, 255, 255)" }
	ctx.fillRect(x*WIDTH, y*HEIGHT, WIDTH, HEIGHT)
}

function reflectPattern(code, ctx){
	const arr = code.qr
	for(let i = 0; i < code.size; ++i){
		for(let j = 0; j < code.size; ++j){
			if(code.reserved[i][j] === false) putPattern(2, ctx, i, j)
			else putPattern(arr[i][j], ctx, i, j)
			// if(i === code.size-1) console.log("i:"+i+",j:"+j+",ar:"+arr[i][j])
		}
	}
}

chrome.extension.onRequest.addListener(() => {
	const url = window.location.href
	const qr = new QR(
			//"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
			url
			//"abcde"
			//"1234567890abcdefghijklmnopqrstuvwxyz"
			, "M")
	
	// 描画用canvasの初期化
	let canvas = document.createElement("canvas")
	canvas.setAttribute("width",   WIDTH*qr.size.toString())
	canvas.setAttribute("height", HEIGHT*qr.size.toString())
	canvas.setAttribute("class", "qr-canvas")
	let ctx = canvas.getContext("2d")

	// タイトルを描画するdiv要素
	let urldiv = document.createElement("div")
	urldiv.setAttribute("class", "qr-url")
	urldiv.innerHTML = qr.data

	// URLを描画するdiv要素
	let titlediv = document.createElement("div")
	titlediv.setAttribute("class", "qr-title")
	titlediv.innerHTML = "QR-generator"

	// 生成されたQRコードをcontextに反映する
	reflectPattern(qr, ctx)

	// 描画するdiv要素の生成
	let parentdiv = document.createElement("div")
	parentdiv.setAttribute("class", "qr-base")
	document.body.appendChild(parentdiv)

	parentdiv.addEventListener("click", function(){
		document.body.removeChild(parentdiv)
	}, false)

	let backdiv = document.createElement("div")
	backdiv.setAttribute("class", "qr-back")
	
	// backdivの子としてDOMを追加
	backdiv.appendChild(titlediv)
	backdiv.appendChild(canvas)
	backdiv.appendChild(urldiv)

	// parentdivの子としてbackdivを追加
	parentdiv.appendChild(backdiv)
})
