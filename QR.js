
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
		this.modelNumber = []
		this.mask = 0
		this.datazone = []

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

		console.log(this.length)
		for(let i = 0; i < verarr.length; ++i){
			if(this.level === -1) break
			if(this.length <= verarr[i][this.level]){
				this.version = i; break
			}
			// console.log(this.length + " " + verarr[i][this.level])
		}

		// QRコードの縦横のピクセル数
		this.size = 21 + (this.version) * 4

		// QRコード領域と予約領域を確保
		this.qr = new Array(this.size)
		this.reserved = new Array(this.size)
		this.datazone = new Array(this.size)

		for(let i = 0; i < this.size; ++i){
			this.qr[i] = new Array(this.size).fill(0)
			this.reserved[i] = new Array(this.size).fill(false)
			this.datazone[i] = new Array(this.size).fill(false)
		}

		// QRコードの生成
		this.generate()
	}

	putAble(x, y){
		if((0 <= x && x < this.size) && (0 <= y && y < this.size)){
			if(this.reserved[x][y] != true) return true
			else return false
		}else return false
	}

	putAbleQR(r, x, y){
		if((0 <= x && x < this.size) && (0 <= y && y < this.size)){
			if(r[x][y] != true) return true
			else return false
		}else return false
	}

	putPattern(x, y, p){
		if(this.putAble(x, y)){
			this.qr[x][y] = p;
			this.reserved[x][y] = true
		}
		/*
		if(0 <= x && x < this.size && 0 <= y && y < this.size){
			if(this.reserved[x][y] != true){
				this.qr[x][y] = p;
				this.reserved[x][y] = true
			}
		}
		*/
	}

	putPatternQR(qr, r, x, y, p){
		if(this.putAbleQR(r, x, y)){
			qr[x][y] = p;
			r[x][y] = true
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
		const v = this.version
		// console.log(alignarr[v].length)
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
		if(0 <= this.version && this.version <= 8){
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
		while(this.datacode.length < datacodeSumArr[this.version][this.level]){
			if(tmp % 2 === 0) this.datacode.push(236)
			else this.datacode.push(17)
			tmp++
		}
		console.log(this.datacode)
		console.log(datacodeSumArr[this.version][this.level])

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
		const ecc = errorCorrectionCharacteristic[this.version][this.level]
		console.log(ecc)
		let newdatacode = []
		let base = 0
		for(let ec of ecc){
			for(let i = 0; i < ec[0]; ++i){
				let p = new Polynomial()
				let f = this.datacode.slice(base, base+ec[2])
				newdatacode.push(f)
				let g = generatorPolynomial.get(ec[1]-ec[2])
				console.log(f)
				// console.log(g)
				let tmp = []
				for(let j of g){
					tmp.push(alphaToNum[j])
				}
				console.log(tmp) // alpha->numのg

				const r = p.mod(f, g)
				this.errorCorrectionCode.push(r)

				base += ec[2]
			}
		}
		console.log(this.errorCorrectionCode)
		this.datacode = newdatacode
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
		return this.createFormatInfoQR(this.qr, this.mask)
		/*
		let p = new Polynomial()
		this.mask = 2 // 0~7で固定
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
		f.push(this.mask >> 2); f.push((this.mask >> 1) & 1);
		f.push(this.mask & 1)
		let ftmp = f.concat()
		// f(x)にx^10を掛ける
		for(let i = 0; i < 10; ++i) f.push(0)

		// 多項式g(x)の定義
		let g = [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]

		console.log(f)
		console.log(g)
		r = p.mod_int(f, g)
		for(let i = 0; i < ftmp.length; ++i) r[i] = ftmp[i]
		console.log(r)

		const xor = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
		for(let i = 0; i < xor.length; ++i) r[i] = r[i] ^ xor[i]

		// console.log(r)
		this.formatInfo = r

		console.log(this.formatInfo)
		*/
	}

	createFormatInfoQR(qr, mask){
		let p = new Polynomial()
		// mask = 1 // 0~7で固定
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
		f.push(mask >> 2); f.push((mask >> 1) & 1);
		f.push(mask & 1)
		let ftmp = f.concat()
		// f(x)にx^10を掛ける
		for(let i = 0; i < 10; ++i) f.push(0)

		// 多項式g(x)の定義
		let g = [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]

		r = p.mod_int(f, g)
		for(let i = 0; i < ftmp.length; ++i) r[i] = ftmp[i]
		// console.log(r)

		const xor = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
		for(let i = 0; i < xor.length; ++i) r[i] = r[i] ^ xor[i]

		// console.log(r)
		return r
	}

	// 形式情報の配置
	putFormatInfo(){
		this.putFormatInfoQR(this.qr, this.mask, this.formatInfo, this.reserved)
		/*
		this.formatInfo.reverse()
		for(let i = 0; i < this.formatInfo.length; ++i){
			if(i < 8){
				// 右上の横部分の配置
				this.putPattern(this.size-i-1, 8, this.formatInfo[i])
				// 左上の縦部分の配置
				this.putPattern(8, ((this.reserved[8][i]) ? i+1 : i), this.formatInfo[i])
			}else{
				// 左下の縦部分の配置
				this.putPattern(8, this.size+i-this.formatInfo.length, this.formatInfo[i])
				// 左上の横部分の配置
				this.putPattern((this.reserved[7-(i-8)][8] ? 7-(i-8)-1: 7-(i-8)), 8, this.formatInfo[i])
			}
		}
		// 暗モジュールの設置
		this.putPattern(8, this.size-8, 1)
		*/
	}

	// 形式情報の配置
	putFormatInfoQR(qr, mask, r, reserved){
		const fi = r.reverse() // FormatInfo
		for(let i = 0; i < fi.length; ++i){
			if(i < 8){
				// 右上の横部分の配置
				this.putPatternQR(qr, reserved, this.size-i-1, 8, fi[i])
				// 左上の縦部分の配置
				this.putPatternQR(qr, reserved, 8, ((reserved[8][i]) ? i+1 : i), fi[i])
			}else{
				// 左下の縦部分の配置
				this.putPatternQR(qr, reserved, 8, this.size+i-fi.length, fi[i])
				// 左上の横部分の配置
				this.putPatternQR(qr, reserved,  (reserved[7-(i-8)][8] ? 7-(i-8)-1: 7-(i-8)), 8, fi[i])
			}
		}
		// 暗モジュールの設置
		this.putPatternQR(qr, reserved, 8, this.size-8, 1)
	}

	createModelNumber(){
		this.modelNumber = this.createModelNumberQR()
		/*
		let p = new Polynomial
		let v = this.version 
		let f = []
		while(v != 0){
			let value = v & 1
			f.unshift(value)
			v >>= 1
		}
		const flen = f.length
		for(let i = 0; i < 6-flen; ++i) f.unshift(0)
		for(let i = 0; i < 18-6; ++i) f.push(0)
		const fx = f.concat()
		console.log(f)

		// 多項式g(x)の定義
		let g = [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1]

		this.modelNumber = p.add(fx, p.mod_int(f, g))

		console.log(this.modelNumber)
		*/
	}

	createModelNumberQR(){
		let p = new Polynomial
		let v = this.version 
		let f = []
		while(v != 0){
			let value = v & 1
			f.unshift(value)
			v >>= 1
		}
		const flen = f.length
		for(let i = 0; i < 6-flen; ++i) f.unshift(0)
		for(let i = 0; i < 18-6; ++i) f.push(0)
		const fx = f.concat()
		// console.log(f)

		// 多項式g(x)の定義
		let g = [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1]

		return p.add(fx, p.mod_int(f, g))
	}

	putModelNumber(){
		this.putModelNumberQR(this.qr, this.reserved, this.modelNumber)
		/*
		this.modelNumber.reverse()
		for(let i = 0; i < 6; ++i){
			for(let j = 0; j < 3; ++j){
				this.putPattern(i, this.size-11+j, this.modelNumber[i*3+j])
				this.putPattern(this.size-11+j, i, this.modelNumber[i*3+j])
			}
		}
		*/
	}

	putModelNumberQR(qr, r, mn){
		mn.reverse()
		for(let i = 0; i < 6; ++i){
			for(let j = 0; j < 3; ++j){
				this.putPatternQR(qr, r, i, this.size-11+j, mn[i*3+j])
				this.putPatternQR(qr, r, this.size-11+j, i, mn[i*3+j])
			}
		}
	}

	putCodeQR(qr, r, d, e, dz){
		const s = this.size
		const dir = [-1, 1] // [0]: 上, [1]: 下
		let now = 0 // 0, 1
		let maxd = 0, maxe = 0
		let all = []

		for(let i = 0; i < d.length; ++i)
			maxd = (d[i].length > maxd) ? d[i].length : maxd
		for(let i = 0; i < e.length; ++i)
			maxe = (e[i].length > maxe) ? e[i].length : maxe
		// maxe = 0
		
		// データコードのバイト化
		for(let i = 0; i < maxd; ++i){
			for(let j = 0; j < d.length; ++j){
				if(d[j].length <= i) continue
				let byted = []
				let origind = d[j][i]
				// 各要素のビット配列を求める
				for(let k = 0; k < 8; ++k){
					byted.unshift(origind & 1)
					origind >>= 1
				}
				// console.log(byted)
				for(let k = 0; k < 8; ++k) all.push(byted[k])
			}
		}
		// console.log("d-all:" + all.length)

		for(let i = 0; i < maxe; ++i){
			for(let j = 0; j < e.length; ++j){
				if(e[j].length <= i) continue
					let bytee = []
					let origine = e[j][i]
					for(let k = 0; k < 8; ++k){
						bytee.unshift(origine & 1)
						origine >>= 1
					}
					// console.log(bytee)
					for(let k = 0; k < 8; ++k) all.push(bytee[k])
			}
		}
		// console.log("e-all:" + all.length)
		// console.log(all)

		let itr = 0
		let block = 3 // Debug用変数、8bitごとにデータゾーンをぬりえ
		for(let i = s-1; i >= 0; i-=2){
			if(i === 6) {i = 5}
			for(let j = (now===0)?s-1:0; ; j+=dir[now]){
				for(let k = 0; k < 2; ++k){
					let pc = (itr > all.length-1) ? 0 : all[itr]
					// pc = block
					// if(itr > all.length-1) { pc = 0 }
					if(this.putAbleQR(r, i-k, j)){
						// if(i === s-1) console.log("x:"+(i-k)+",y:"+j+",b:"+block)
						this.putPatternQR(qr, r, (i-k), j, pc)
						// console.log(all[itr])
						itr++
						dz[i-k][j] = true
						if(((itr)%8) === 0) { block++;block=(block%3)+3; }
					}
				}
				if(now===0){ if(j <= 0) break }
				else { if(j >= s-1) break }
			}
			now ^= 1 // 0, 1 の逆転
		}
		// console.log("itr:" + itr + ", all:" + all.length)

	}

	putCode(){
		const s = this.size
		const d = this.datacode
		const e = this.errorCorrectionCode
		this.putCodeQR(this.qr, this.reserved, d, e, this.datazone)
		/*
		const dir = [-1, 1] // [0]: 上, [1]: 下
		let now = 0 // 0, 1
		let maxd = 0, maxe = 0
		let all = []

		console.log(d)
		console.log(e)

		for(let i = 0; i < d.length; ++i)
			maxd = (d[i].length > maxd) ? d[i].length : maxd
		for(let i = 0; i < e.length; ++i)
			maxe = (e[i].length > maxe) ? e[i].length : maxe
		// maxe = 0
		
		// データコードのバイト化
		for(let i = 0; i < maxd; ++i){
			for(let j = 0; j < d.length; ++j){
				if(d[j].length <= i) continue
				let byted = []
				let origind = d[j][i]
				// 各要素のビット配列を求める
				for(let k = 0; k < 8; ++k){
					byted.unshift(origind & 1)
					origind >>= 1
				}
				// console.log(byted)
				for(let k = 0; k < 8; ++k) all.push(byted[k])
			}
		}
		console.log("d-all:" + all.length)

		for(let i = 0; i < maxe; ++i){
			for(let j = 0; j < e.length; ++j){
				if(e[j].length <= i) continue
					let bytee = []
					let origine = e[j][i]
					for(let k = 0; k < 8; ++k){
						bytee.unshift(origine & 1)
						origine >>= 1
					}
					// console.log(bytee)
					for(let k = 0; k < 8; ++k) all.push(bytee[k])
			}
		}
		console.log("e-all:" + all.length)
		// console.log(all)

		let itr = 0
		let block = 3
		for(let i = s-1; i >= 0; i-=2){
			if(i === 6) {i = 5}
			for(let j = (now===0)?s-1:0; ; j+=dir[now]){
				for(let k = 0; k < 2; ++k){
					if(itr > all.length-1) break
					if(this.putAble(i-k, j)){
						// if(i === s-1) console.log("x:"+(i-k)+",y:"+j+",b:"+block)
						this.putPattern((i-k), j, all[itr])
						// console.log(all[itr])
						itr++
						this.datazone[i-k][j] = true
						if(((itr)%8) === 0) { block++;block=(block%3)+3; }
					}
				}
				if(now===0){ if(j <= 0) break }
				else { if(j >= s-1) break }
			}
			now ^= 1 // 0, 1 の逆転
		}
		console.log("itr:" + itr + ", all:" + all.length)
		*/

	}

	evalMask(qr, mask){
		let e = 0 // eval num
		const N1 = 3, N2 = 3, N3 = 40, N4 = 10
		
		let tmp = 0
		// N1, 同色の行または列の隣接モジュール
		for(let i = 0; i < this.size; ++i){
			let now = qr[i][0]
			let cnt = 1
			for(let j = 0; j < this.size; ++j){
				if(now === qr[i][j]) cnt++
				else {
					now = qr[i][j]
					if(cnt >= 5) {
						// console.log(e + " " + (3+cnt-5) + " " + i + " " + j)
						e += (N1 + cnt - 5)
						// console.log(e)
					}
					cnt = 1
				}
			}
			if(cnt >= 5){
				e += (N1 + cnt - 5)
			}
		}

		for(let i = 0; i < this.size; ++i){
			let now = qr[0][i]
			let cnt = 0
			for(let j = 0; j < this.size; ++j){
				if(now === qr[j][i]) cnt++
				else {
					now = qr[j][i]
					if(cnt >= 5) { 
						e += (N1 + cnt - 5)
						// tmp ++
						// console.log("i:"+i + ", cnt:" +cnt)
					}
					cnt = 1
				}
			}
			if(cnt >= 5){
				e += (N1 + cnt - 5)
				// tmp++
				// console.log("i:"+i + ", cnt:" +cnt)
			}
		}
		// console.log("cnt:" + tmp)

		// N2, 同色のモジュールブロック
		for(let i = 0; i < this.size-1; ++i){
			for(let j = 0; j < this.size-1; ++j){
				// console.log(qr[i][j]+" "+qr[i+1][j]+" "+qr[i][j+1]+" "+qr[i+1][j+1])
				if(qr[i][j] === qr[i+1][j] &&
					 qr[i][j+1] === qr[i+1][j+1] &&
					 qr[i][j] === qr[i+1][j+1]) {
					tmp++	
					e += N2
					// console.log(e)
				}
			}
		}

		const compare = (src, dst) => {
			for(let i = 0; i < src.length; ++i){
				if(src[i] !== dst[i]) return false
			}
			return true
		}

		// N3, 行と列における1:1:3:1:1の暗明暗明暗のパターンの前後に比率4の明パターン
		const alt = [1, 0, 1, 1, 1, 0, 1] // 交互パターン
		const light = [0, 0, 0, 0] // 明パターン
		let pattern = []
		pattern.push(alt.concat(light))
		pattern.push(light.concat(alt))
		// パターンの順番
		for(let p = 0; p < 2; ++p){
			const s = pattern[p].length
			for(let i = 0; i < this.size; ++i){ // 行
				for(let j = 0; j < this.size-s; ++j){ // 列
					let flag = true // patternとqr[i][j]が一致
					for(let k = 0; k < s; ++k){
						if(qr[i][j+k] !== pattern[p][k]) {
							flag = false
							break
						}
					}
					if(flag) { e += N3; }
				}
			}
		}

		for(let p = 0; p < pattern.size; ++p){
			for(let i = 0; i < this.size; ++i){ // 行
				for(let j = 0; j < this.size-pattern[p].size; ++j){ // 列
					let flag = true // patternとqr[i][j]が一致
					for(let k = 0; k < pattern[p].size; ++k){
						if(qr[j+k][i] !== pattern[p][k]) {
							flag = false
							break
						}
					}
					if(flag) { e += N3; }
				}
			}
		}

		// N4, 全体に対する暗モジュールの占める割合
		const size = (this.size+1)*(this.size+1)
		// console.log("size:" + size)
		let darkmodule = 0
		for(let i = 0; i < this.size; ++i){
			for(let j = 0; j < this.size; ++j){
				if(qr[i][j] === 1) darkmodule++
			}
		}
		// console.log("par:" + darkmodule/size)
		// console.log("dark:" + darkmodule)
		const per = Math.abs(darkmodule / size - 0.5) * 100
		if(per >= 5.0){
			const k = per/5.0
			e += N4 * Math.floor(k)
			console.log(N4 *Math.floor(k))
		}


		return e
	}

	setMask(){
		for(let i = 0; i < this.size; ++i){
			for(let j = 0; j < this.size; ++j){
				if(!this.datazone[i][j]) continue
				// 条件を満たす箇所のパターンを入れ替え
				switch(this.mask){
					case 0:
						if((i+j) % 2 === 0) this.qr[i][j] ^= 1
						break
					case 1:
						if(j % 2 === 0) this.qr[i][j] ^= 1
						break
					case 2:
						if(i % 3 === 0) this.qr[i][j] ^= 1
						break
					case 3:
						if((i + j) % 3 === 0) this.qr[i][j] ^= 1
						break
					case 4:
						if((Math.floor(j/2)+Math.floor(i/3)) % 2 === 0) this.qr[i][j] ^= 1
						break
					case 5:
						if(((i*j) % 2 + (i*j) % 3) === 0) this.qr[i][j] ^= 1
						break
					case 6:
						if(((i*j)%2 + (i*j)%3) % 2 === 0) this.qr[i][j] ^= 1
						break
					case 7:
						if(((i+j)%2+(i*j)%3)%2 === 0) this.qr[i][j] ^= 1
						break
				}
			}
		}
		console.log(this.version + " " + this.size)
	}

	setMaskQR(qr, dz, mask){
		for(let i = 0; i < this.size; ++i){
			for(let j = 0; j < this.size; ++j){
				if(!dz[i][j]) continue
				// 条件を満たす箇所のパターンを入れ替え
				switch(mask){
					case 0:
						if((i+j) % 2 === 0) qr[i][j] ^= 1
						break
					case 1:
						if(j % 2 === 0) qr[i][j] ^= 1
						break
					case 2:
						if(i % 3 === 0) qr[i][j] ^= 1
						break
					case 3:
						if((i + j) % 3 === 0) qr[i][j] ^= 1
						break
					case 4:
						if((Math.floor(j/2)+Math.floor(i/3)) % 2 === 0) qr[i][j] ^= 1
						break
					case 5:
						if(((i*j) % 2 + (i*j) % 3) === 0) qr[i][j] ^= 1
						break
					case 6:
						if(((i*j)%2 + (i*j)%3) % 2 === 0) qr[i][j] ^= 1
						break
					case 7:
						if(((i+j)%2+(i*j)%3)%2 === 0) qr[i][j] ^= 1
						break
				}
			}
		}
		// console.log(this.version + " " + this.size)
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

			let min = 1000000000
			for(let i = 0; i < 8; ++i){
				// Array.concat()のようなshallow copy(1次元しかコピーできない)ではなくJSONに変換→Arrayに変換のようなdeep copyを行うと完全な値渡しができる
				const qr_tmp = JSON.parse(JSON.stringify(this.qr))
				const r_tmp = JSON.parse(JSON.stringify(this.reserved))
				const d_tmp = JSON.parse(JSON.stringify(this.datacode))
				const e_tmp = JSON.parse(JSON.stringify(this.errorCorrectionCode))
				const dz_tmp = JSON.parse(JSON.stringify(this.datazone))
				
				// 形式情報の生成
				const r = this.createFormatInfoQR(qr_tmp, i)

				// 形式情報の配置
				this.putFormatInfoQR(qr_tmp, i, r, r_tmp)	

				// 型番情報はバージョン7以降のみに配置
				if(this.version >= 7){
					// 型番情報の生成
					const mn = this.createModelNumberQR()

					// 型番情報の配置
					this.putModelNumberQR(qr_tmp, r_tmp, mn)
				}

				// データ語と誤り訂正コードの配置
				this.putCodeQR(qr_tmp, r_tmp, d_tmp, e_tmp, dz_tmp)

				// マスクの対応
				this.setMaskQR(qr_tmp, dz_tmp, i)

				// マスクの評価を行う
				const m = this.evalMask(qr_tmp, i)
				console.log(i + ":" + m)

				// 評価値mが1番少なかったときのiをマスクとする
				if(m < min) {
					min = m
					this.mask = i
				}
			}
			console.log(this.mask)
			this.mask = 4
			
			// 形式情報の計算
			this.formatInfo = this.createFormatInfo()
			console.log(this.formatInfo)

			// 形式情報の配置
			this.putFormatInfo()

			// 型番情報はバージョン7以降のみに配置
			if(this.version >= 7){
				// 型番情報の生成
				this.createModelNumber()

				// 型番情報の配置
				this.putModelNumber()
			}

			// データ語と誤り訂正コードの配置
			this.putCode()

			// マスクの対応
			this.setMask()
	}
		
}
