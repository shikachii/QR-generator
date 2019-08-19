
class Polynomial {

	// s1 + s2
	add(s1, s2){
		let result = []
		for(let i = 0; i < Math.max(s1.length, s2.length); ++i){
			result.push(s1[i] ^ s2[i])
		}

		return result
	}

	// s1 - s2
	sub(s1, s2){
		this.sub(s1, s2)
	}

	// s1 * s2
	mul(s1, s2){
	}

	// fx(integer), gx(alpha)
	mod(fx, gx){
		let modulo = []
		let fxtmp = fx.concat() // 新しくfxと同じ配列を作成
		let gxtmp = []

		//for(let i = 0; i < gx.length-fx.length; ++i) fxtmp.push(0)
		for(let i = 0; i < gx.length; ++i){
			gxtmp.push(gx[i])
			// gxtmp.push(alphaToNum[gx[0]]) // a^nから数値に変換
		}
		// for(let i in fx) gxtmp.push(0)

		// console.log(alphaToNum[50])

		let cnt = 0
		for(let ind = 0; ind < fx.length; ++ind){
			for(let i = 0; i < gx.length-fxtmp.length; ++i) fxtmp.push(0)
			for(let i = 0; i < gxtmp.length; ++i){
				gxtmp[i] = (gxtmp[i] + numToAlpha[fxtmp[0]]) % 255
				gxtmp[i] = alphaToNum[gxtmp[i]]
				// console.log(gxtmp[i])
				// if(gxtmp[i] === -1) continue
			}
			fxtmp = this.add(fxtmp, gxtmp)
			//console.log(fxtmp)

			let tmp = []
			let zeroflag = true
			for(let f of fxtmp){
				if(f === 0 && zeroflag) {
					if(++cnt === gx.length*2-1) { break }
				}else{
					zeroflag = false
					tmp.push(f)
				}
			}
			fxtmp = tmp.concat()
			//console.log(fxtmp)
			if(cnt === gx.length) { return fxtmp }

			gxtmp = gx.concat()
		}

		// if(fx.length < gx.length) return fx

		modulo = fxtmp
		return modulo
	}
}
