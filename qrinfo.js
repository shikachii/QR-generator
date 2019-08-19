
// 文字列の長さからバージョン決定を行うための配列
// [i][j]として i:バージョン数, j:誤り訂正レベル
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

// 位置合わせパターンの表示位置情報
// [i][j]として i:xy座標としてありえる数値, j:バージョン
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

// 生成多項式g(x)の係数(aのべき乗), x:誤り訂正コード数
const generatorPolynomial = new Map([
	[2,  [0, 25, 1]],
	[5,  [0, 113, 164, 166, 119, 10]],
	[6,  [0, 166, 0, 134, 5, 176, 15]],
	[7,  [0, 87, 229, 146, 149, 238, 102, 21]],
	[8,  [0, 175, 238, 208, 249, 215, 252, 196, 28]],
	[10, [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45]],
	[13, [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78]],
	[14, [0, 199, 249, 155, 48, 190, 124, 218, 137, 216, 87, 207, 59, 22, 91]],
	[15, [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105]],
	[16, [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120]],
	[17, [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136]],
	[18, [0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153]],
	[20, [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190]],
	[22, [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231]],
	[24, [0 ]],
	[26, [0 ]],
	[28, [0 ]],
	[30, [0 ]],
	[32, [0 ]],
	[34, [0 ]],
	[36, [0 ]],
	[40, [0 ]],
	[42, [0 ]],
	[44, [0 ]],
	[46, [0 ]],
	[48, [0 ]],
	[50, [0 ]],
	[52, [0 ]],
	[54, [0 ]],
	[56, [0 ]],
	[58, [0 ]],
	[60, [0 ]],
	[62, [0 ]],
	[64, [0 ]],
	[66, [0 ]],
	[68, [0 ]],
])

// GF(2^8)の相互変換表
const alphaToNum = [
	1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38,
	76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96,
	192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238,
	193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210,
	185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202,
	137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177,
	127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134,
	17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31,
	62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102,
	204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132,
	21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57,
	114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126,
	252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150,
	49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50,
	100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81,
	162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138,
	9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203,
	139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108,
	216, 173, 71, 142, 1
]

const numToAlpha = [
	-1, 0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8,76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240,18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120,77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37,179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241,210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 80, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175
]
