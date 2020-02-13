
/*
 * class : QR
 */
class QR {
	constructor(data, level){
		this.version = 1
		this.length = data.length
		this.data = data
		this.qr = []
		this.datacode = []
		this.reserved = []
		this.errorCorrectionCode = []
		this.formatInfo = []

		// QRコードのレベルを設定
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

		// QRコードの縦横のピクセル数
		this.size = 21 + (this.version-1) * 4

		// QRコード領域と予約領域を確保
		this.qr = new Array(this.size)
		this.reserved = new Array(this.size)

		for(let i = 0; i < this.size; ++i){
			this.qr[i] = new Array(this.size).fill(0)
			this.reserved[i] = new Array(this.size).fill(false)
		}

		// QRコードの生成
		this.generate()
	}

	putPattern(x, y, p){
		if(0 <= x && x < this.size && 0 <= y && y < this.size){
			if(this.reserved[x][y] != true){
				this.qr[x][y] = p;
				this.reserved[x][y] = true
			}
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

	// データコードの生成
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

		// データコード分割
		/*
		const ecc = errorCorrectionCharacteristic[this.version][this.level]
		let newdatacode = []
		let base = 0
		// 誤り訂正特性からデータコードの分割数を取得
		for(let ec of ecc){
			for(let i = 0; i < ec[0]; ++i){
				newdatacode.push(this.datacode.slice(base, base+ec[2]))
				base += ec[2]
			}
		}
		this.datacode = newdatacode
		console.log(this.datacode)
		*/
	}

	// 誤り訂正コードの生成
	createErrorCorrectionCode(){
		const ecc = errorCorrectionCharacteristic[this.version][2]
		let newdatacode = []
		let base = 0
		for(let ec of ecc){
			for(let i = 0; i < ec[0]; ++i){
				let p = new Polynomial()
				let f = this.datacode.slice(base, base+ec[2])
				newdatacode.push(f)
				let g = generatorPolynomial.get(ec[1]-ec[2])

				const r = p.mod(f, g)
				this.errorCorrectionCode.push(r)

				base += ec[2]
			}
		}
		console.log(this.errorCorrectionCode)
		/*
		let g = generatorPolynomial.get(18)

		let p = new Polynomial()
		let arr = [67, 70, 22, 38, 54, 70, 86, 102, 118, 134, 150, 166, 182, 198, 214]
		//console.log(alphaToNum[43+37])
		console.log(numToAlpha.length)
		this.errorCorrectionCode.push(p.mod(arr, g))


		console.log(this.errorCorrectionCode)

		// console.log(alphaToNum.length)
		// console.log(alphaToNum[82])
		*/
	}

	// 形式情報の作成
	createFormatInfo(){
		let p = new Polynomial()
		const mask = 3 // 0~8で固定
		let f = [], r = []
		let l = 0
		switch(this.level){
			case 0: l = 1; break
			case 1: l = 0; break
			case 2: l = 3; break
			case 3: l = 2; break
			default: break
		}
		// 誤り訂正レベル
		f.push(l >> 1); f.push(l &  1)
		// マスクパターン
		f.push(mask >> 2); f.push((mask >> 1) & 1); f.push(mask & 1)
		let ftmp = f.concat()
		// f(x)にx^10を掛ける
		for(let i = 0; i < 10; ++i) f.push(0)

		// 多項式g(x)の定義
		let g = [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]

		r = p.mod_int(f, g)
		for(let i = 0; i < ftmp.length; ++i) r[i] = ftmp[i]
		console.log(r)

		const xor = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
		for(let i = 0; i < xor.length; ++i) r[i] = r[i] ^ xor[i]

		console.log(r)
		this.formatInfo = r
	}

	// 呼ぶだけでQRコードを生成する
	generate(){
			// 位置検出パターンの配置
			const SPACE = this.size - (FinderPattern.length-1)*2
			this.putFinderPattern(0-1, 0-1)
			this.putFinderPattern(SPACE+FinderPattern.length-1, 0-1)
			this.putFinderPattern(0-1, SPACE+FinderPattern.length-1)

			// タイミングパターンの配置
			this.putTimingPattern()

			// 位置合わせパターンの配置
			this.putAlignmentPattern()

			// データ語の生成
			this.createDatacode()

			// 誤り訂正コードの生成
			this.createErrorCorrectionCode()

			// 形式情報の生成
			this.createFormatInfo()
			
			// データ語と誤り訂正コードの配置
	}
		
}
