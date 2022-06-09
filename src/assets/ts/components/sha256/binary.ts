type Side = 'left' | 'right';

class Binary {
	public Value = '';

	constructor(value: string | number | Binary) {
		if (typeof value === 'string') {
			this.Value = value;
			return;
		}

		if (typeof value === 'object') {
			this.Value = value.Value;
			return;
		}

		this.Value = value.toString(2);
	}

	public BlockSlice() {
		const result = this.Value.slice(0, 512);
		this.Value = this.Value.slice(512, this.Value.length);
		return new Binary(result);
	}

	public Append(value: string) {
		const result = this.Value + value;
		return new Binary(result);
	}

	public Log() {
		let log = '';

		for (let i = 0; i < this.Value.length; ++i) {
			if (i % 32 === 0) {
				log += '\n';
			}
			if (i % 8 === 0) {
				log += ' ';
			}
			if (i % 512 === 0) {
				log += '\n ';
			}
			log += this.Value[i];
		}

		console.log(log);
	}

	public ToBinary() {
		let result = '';

		for (let i = 0; i < this.Value.length; ++i) {
			const code = this.Value[i]
				.charCodeAt(0)
				.toString(2);

			result += new Binary(code)
				.FillZeroes(8)
				.Value;
		}

		return new Binary(result);
	}

	public ToHex() {
		let result = parseInt(this.Value, 2).toString(16);

		if (result.length < 8) {
			const temp = [...result];
			temp.unshift('0');
			result = temp.join('');
		}

		return new Binary(result);
	}

	private prepareMsg() {
		const msgLength = this.Value.length.toString(2);

		this.Value += '1';

		let blocksCount = Math.ceil(this.Value.length / 512);
		const remainder = this.Value.length % 512;

		if (remainder === 0 || remainder > 448) {
			++blocksCount;
		}

		const result = this
			.FillZeroes(blocksCount * 512 - msgLength.length, 'right')
			.Append(msgLength);

		this.Value = result.Value;
	}

	public GetBlocks() {
		this.prepareMsg();

		const split = [...this.Value];
		const words: Binary[] = [];

		let blocks: Binary[][] = [];

		while (split.length > 0) {
			const elem = split.splice(0, 32);
			const push = new Binary(elem.join(''));
			words.push(push);
		}

		while (words.length > 0) {
			const block = words.splice(0, 16);
			blocks.push(block);
		}

		return blocks;
	}

	public FillZeroes(outLength: number, side: Side = 'left') {
		let result = this.Value;

		if (result.length >= outLength) {
			return this;
		}

		const zeroesCount = outLength - result.length;
		const repeat = '0'.repeat(zeroesCount);

		if (side === 'left') {
			result = repeat.concat(result);
		} else {
			result = result.concat(repeat);
		}

		return new Binary(result);
	}

	public Rotr(offset: number) {
		const split = [...this.Value];

		for (let i = 0; i < offset; ++i) {
			const pop = split.pop();
			split.unshift(pop ?? '');
		}

		return new Binary(split.join(''));
	}

	public Shr(offset: number) {
		const split = [...this.Value];

		for (let i = 0; i < offset; ++i) {
			split.pop();
			split.unshift('0');
		}

		const result = split.join('');

		return new Binary(result);
	}

	public Xor(binary: Binary) {
		let result = '';

		for (let i = 0; i < this.Value.length; ++i) {
			const a = binary.Value[i] === '1' ? 1 : 0;
			const b = this.Value[i] === '1' ? 1 : 0;

			result += a ^ b;
		}

		return new Binary(result);
	}

	public Shift() {
		let result = [...this.Value];
		result.shift();
		return new Binary(result.join(''));
	}

	public Sum(binary: Binary) {
		const a = parseInt(this.Value, 2);
		const b = parseInt(binary.Value, 2);

		const sum = a + b;

		let result = new Binary(sum);

		if (result.Value.length < 32) {
			result = result.FillZeroes(32);
		}

		if (result.Value.length > 32) {
			result = result.Shift();
		}

		return result;
	}

	public And(binary: Binary) {
		let result = '';

		for (let i = 0; i < this.Value.length; ++i) {
			const a = binary.Value[i] === '1' ? 1 : 0;
			const b = this.Value[i] === '1' ? 1 : 0;

			result += a & b;
		}

		return new Binary(result);
	}

	public Not() {
		let result = '';

		for (let i = 0; i < this.Value.length; ++i) {
			const a = this.Value[i] === '1' ? 1 : 0;
			result += !a ? 1 : 0;
		}

		return new Binary(result);
	}
}

export default Binary;