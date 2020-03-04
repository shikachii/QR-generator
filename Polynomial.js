
class Polynomial {

	// s1 + s2
	add(s1, s2){
		let result = []
		for(let i = 0; i < Math.max(s1.length, s2.length); ++i){
			const s1t = (i < s1.length) ? s1[i] : 0
			const s2t = (i < s2.length) ? s2[i] : 0
			result.push(s1t ^ s2t)
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
		let gxtmp = gx.concat()

		//for(let i = 0; i < gx.length-fx.length; ++i) fxtmp.push(0)
		/*
		for(let i = 0; i < gx.length; ++i){
			gxtmp.push(gx[i])
			// gxtmp.push(alphaToNum[gx[0]]) // a^nから数値に変換
		}
		*/
		// for(let i in fx) gxtmp.push(0)

		// console.log(alphaToNum[50])
		for(let i = 0; i < gx.length-1; ++i){
			fxtmp.push(0)
		}

		let cnt = 0
		const leng = fxtmp.length
		for(let ind = 0; ind < leng; ++ind){
			//for(let i = 0; i < gx.length-fxtmp.length; ++i) fxtmp.push(0)
			/*
			const maxlen = Math.max(fxtmp.length, gx.length)
			const minlen = Math.min(fxtmp.length, gx.length)
			for(let i = 0; i < maxlen-minlen; ++i){
				if(minlen === gx.length) gx
			*/
			for(let i = 0; i < gxtmp.length; ++i){
				gxtmp[i] = (gxtmp[i] + numToAlpha[fxtmp[0]]) % 255
				gxtmp[i] = alphaToNum[gxtmp[i]]
				// console.log(gxtmp[i])
				// if(gxtmp[i] === -1) continue
			}
			fxtmp = this.add(fxtmp, gxtmp)

			// 上部にある0を取り除く
			let tmp = []
			let zeroflag = true
			for(let f of fxtmp){
				if(f === 0 && zeroflag) {
					continue
					// if(++cnt === gx.length*2-1) { break }
				}else{
					zeroflag = false
					tmp.push(f)
				}
			}
			fxtmp = tmp.concat()
			// console.log(fxtmp)
			// console.log(gxtmp)
			// fxtmp < gxであればそれが余り
			let gxnum = []
			for(let i = 0; i < gx.length; ++i)
				gxnum.push(alphaToNum[gx[i]])
			console.log(fxtmp)
			console.log(gxnum)
			console.log("length:"+fxtmp.length+", "+this.less_than(fxtmp, gxnum))
			if(this.less_than(fxtmp, gxnum)) break
			console.log("ind:"+ind+",length:"+fx.length)

			gxtmp = gx.concat()
		}

		// if(fx.length < gx.length) return fx
		console.log(fxtmp)

		modulo = fxtmp
		return modulo
	}

	// fx < gx でtrue
	less_than(fx, gx){
		let fdigit = 0, gdigit = 0
		for(let i = 0; i < fx.length; ++i)
			if(fx[i] !== 0) { fdigit = fx.length - i; break }
		for(let i = 0; i < gx.length; ++i)
			if(gx[i] !== 0) { gdigit = gx.length - i; break }

		if(fdigit < gdigit) return true
		else if(fdigit === gdigit){
			let bool = false
			let fbase = fx.length - fdigit
			for(let i = 0; i < gx.length; ++i){
				if(fx[i+fbase] > gx[i]) { bool = false; break }
				else if(fx[i+fbase] < gx[i]){ bool = true; break }
			}
			return bool
		}else return false
	}

	// fx < gx でtrue, 桁がfx >= gxであればfalse(多項式特有)
	less_than_poly(fx, gx){
		let fdigit = 0, gdigit = 0
		for(let i = 0; i < fx.length; ++i)
			if(fx[i] !== 0) { fdigit = fx.length - i; break }
		for(let i = 0; i < gx.length; ++i)
			if(gx[i] !== 0) { gdigit = gx.length - i; break }

		if(fdigit < gdigit) return true
		else return false
	}

	mod_int(fx, gx){
		// fxとgxの桁を調査
		let fdigit = 0, gdigit = 0
		for(let i = 0; i < fx.length; ++i)
			if(fx[i] === 1) { fdigit = fx.length - i; break }
		for(let i = 0; i < gx.length; ++i)
			if(gx[i] === 1) { gdigit = gx.length - i; break }
			
		// そもそも割られる数の方が小さかった場合
		if(this.less_than_poly(fx, gx)) return fx

		while(1){
			// console.log("fx: " + fdigit + ", gx: " + gdigit)
			// fxとgxの桁調整
			let gxtmp = gx.concat()
			for(let i = 0; i < fdigit-gdigit; ++i) gxtmp.push(0)

			let fbase = fx.length - gxtmp.length // fxの最上位桁の場所
			// 除算を行う
			for(let i = 0; i < gxtmp.length; ++i){
				fx[i+fbase] = fx[i+fbase] ^ gxtmp[i]
			}

			// fxの桁を再計算
			for(let i = 0; i < fx.length; ++i)
				if(fx[i] === 1) { fdigit = fx.length - i; break }

			// fx <= gxならばそれが余り
			if(this.less_than_poly(fx, gx)) break
		}

		return fx
	}

}
