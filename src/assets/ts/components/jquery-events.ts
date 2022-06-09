import Hash from './sha256/hash';

class JQueryEvents {
	private hash = new Hash();

	constructor() {
		this.bind();
	}

	private inputOnChange = () => {
		const input = $('.text-area_input').val() as string;
		const hash = this.hash.Sha256(input);
		$('.text-area_output').val(hash);
	}

	private bind() {
		$('.text-area_input').on('input', this.inputOnChange);
	}

}

export default JQueryEvents;