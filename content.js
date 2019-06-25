chrome.extension.onRequest.addListener(() => {
	const url = window.location.href

	let dom = document.createElement("canvas")
	let ctx = dom.getContext("2d")
	ctx.fillStyle = "rgb(200,0,0)"
	ctx.fillRect(10, 10, 55, 50)

	dom = document.createElement("div")
	dom.textContent = url
	document.body.appendChild(dom)
})

class QR {
	constructor(length, data){
		this.mode = 0b0010
		this.length = length
		this.data = data
	}
}

