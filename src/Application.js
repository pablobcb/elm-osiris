import Elm from './Main.elm'

import AudioEngine from './AudioEngine'

export default class Application {

	constructor () {
		this.app = Elm.Main.fullscreen()

		if (navigator.requestMIDIAccess) {
			navigator
				.requestMIDIAccess()
				.then(this.onMIDISuccess.bind(this), this.onMIDIFailure)
		} else {
			alert('No MIDI support in your browser.')
		}
	}

	// this is our raw MIDI data, inputs, outputs, and sysex status
	onMIDISuccess (midiAccess : MIDIAccess) {
		this.audioEngine = new AudioEngine(midiAccess)

		this.app.ports.noteOn.subscribe((midiMsg : Object) =>
			this.audioEngine.noteOn(midiMsg)
		) 
	}

	onMIDIFailure (e : Error) {
		console.log(`No access to MIDI devices or your browser doesn\'t \
			support WebMIDI API. Please use WebMIDIAPIShim ${e}`)
	}

}
