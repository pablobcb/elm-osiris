// @flow

export default class AudioEngine {

	context : AudioContext;

	oscillators : Array<Object>;

	constructor (midiAccess : MIDIAccess) {
		this.context = new AudioContext
		this.oscillators = []
		this.initializeMidiAccess(midiAccess)
		this.initializeMasterVolume()
	}

	initializeMidiAccess (midiAccess : MIDIAccess) {
		// loop over all available inputs and listen for any MIDI input
		for (const input of midiAccess.inputs.values()) {
			input.onmidimessage = this.onMIDIMessage
		}
	}

	initializeMasterVolume () {
		this.masterVolume = this.context.createGain()
		this.masterVolume.gain.value = 0.2
		this.masterVolume.connect(this.context.destination)
	}

	onMIDIMessage (event : Event) {
		const data = event.data
		// var cmd = data[0] >> 4
		// var channel = data[0] & 0xf

		// channel agnostic message type
		const type = data[0] & 0xf0

		const note = data[1]
		const velocity = data[2]

		switch (type) {
			case 144: // noteOn message
				this.noteOn(note, velocity)
				break
			case 128: // noteOff message
				this.noteOff(note, velocity)
				break
		}
	}

	frequencyFromNoteNumber (note : number) : number {
		return 440 * Math.pow(2, (note - 69) / 12)
	}

	noteOn (midiMessage : Object) {
		const { note } = midiMessage

		const osc1 = this.context.createOscillator()
		//debugger
		this.oscillators[note] = [osc1]

		osc1.frequency.value = this.frequencyFromNoteNumber(note)
		osc1.type = 'sine'
		osc1.connect(this.masterVolume)
		osc1.start(this.context.currentTime)
	}

	noteOff (midiNote : number, velocity : number) {
		console.log(midiNote, velocity)
	}

}
