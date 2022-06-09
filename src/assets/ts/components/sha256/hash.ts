import Binary from './binary';

class Hash {
	private msg: Binary = new Binary('');

	private words: Binary[] = [];
	private startHash: Binary[] = [];
	private constants: Binary[] = [];

	constructor() {
		this.initConstants();
	}

	private static getPrimeNums(count: number) {
		let result: number[] = [];

		next:
			for (let i = 2; i < 1000; ++i) {
				for (let j = 2; j < i; ++j) {
					if (i % j === 0) {
						continue next;
					}
				}

				result.push(i);
				if (result.length >= count) {
					return result;
				}
			}

		return result;
	}

	private generateWords() {
		const { words } = this;
		const end = words.length + 48;

		for (let i = words.length; i < end; ++i) {
			const iPrev15 = words[i - 15];
			const iPrev2 = words[i - 2];

			const s0 = iPrev15
				.Rotr(7)
				.Xor(iPrev15.Rotr(18))
				.Xor(iPrev15.Shr(3));

			const s1 = iPrev2
				.Rotr(17)
				.Xor(iPrev2.Rotr(19))
				.Xor(iPrev2.Shr(10));

			const newWord = words[i - 16]
				.Sum(s0)
				.Sum(words[i - 7])
				.Sum(s1);

			words.push(newWord);
		}
	}

	private initStartHash() {
		const primeNums = Hash.getPrimeNums(8);

		this.startHash = primeNums.map(
			value => {
				value = Math.sqrt(value);
				value -= Math.floor(value);

				const result = value
					.toString(2)
					.slice(2, 34);

				return new Binary(result);
			},
		);
	}

	private initConstants() {
		const primeNums = Hash.getPrimeNums(64);

		this.constants = primeNums.map(
			value => {
				value = Math.cbrt(value);
				value -= Math.floor(value);

				const result = value
					.toString(2)
					.slice(2, 34);

				return new Binary(result);
			},
		);
	}

	private compressCycle() {
		const compress = this.startHash.map(
			value => {
				return value;
			},
		);

		for (let i = 0; i < 64; ++i) {
			const elem0 = compress[0];
			const elem4 = compress[4];

			const sigma0 = elem0
				.Rotr(2)
				.Xor(elem0.Rotr(13))
				.Xor(elem0.Rotr(22));

			const sigma1 = elem4
				.Rotr(6)
				.Xor(elem4.Rotr(11))
				.Xor(elem4.Rotr(25));

			const ch = elem4
				.And(compress[5])
				.Xor(elem4.Not().And(compress[6]));

			const ma = elem0
				.And(compress[1])
				.Xor(elem0.And(compress[2]))
				.Xor(compress[1].And(compress[2]));

			const t1 = compress[7]
				.Sum(sigma1)
				.Sum(ch)
				.Sum(this.constants[i])
				.Sum(this.words[i]);

			const t2 = sigma0.Sum(ma);
			const tSum = t1.Sum(t2);
			const save = compress[3].Sum(t1);

			compress.pop();
			compress.unshift(tSum);

			compress[4] = save;
		}

		this.startHash = this.startHash.map(
			(value, index) => {
				return value.Sum(compress[index]);
			},
		);
	}

	public Sha256(msg: string | number) {
		this.msg = new Binary(msg);

		if (typeof msg === 'string') {
			this.msg = this.msg.ToBinary();
		}

		this.initStartHash();

		const blocks = this.msg.GetBlocks();

		for (let i = 0; i < blocks.length; ++i) {
			this.words = blocks[i];

			this.generateWords();
			this.compressCycle();
		}

		let result = '';

		for (const elem of this.startHash) {
			result += elem.ToHex().Value;
		}

		return result;
	}
}

export default Hash;