import { expect } from 'chai'
import { Osc1, Osc1State } from '../../src/ts/AudioEngine/Osc1'
import CONSTANTS from '../../src/ts/Constants'
import "web-audio-test-api"

describe('Osc1', () => {
	const context: AudioContext = new AudioContext()
	let osc1: Osc1

	beforeEach(() => {
		osc1 = new Osc1(context)
	})

	it('constructor should set an AudioContext', () => {
		expect(osc1.context).to.be.instanceOf(AudioContext)
	})

	it('constructor should set an empty state object', () => {
		expect(osc1.state).to.be.empty
	})

	it('constructor should set 128 fm input gains', () => {
		expect(osc1.fmInputs).to.have.lengthOf(CONSTANTS.MAX_VOICES)
		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.fmInputs[i]).to.exist
		}
	})

	it('constructor should set 128 voice output gains', () => {
		expect(osc1.outputs).to.have.lengthOf(CONSTANTS.MAX_VOICES)
		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.outputs[i]).to.exist
		}
	})

	it('constructor should set 128 null voice oscs', () => {
		expect(osc1.outputs).to.have.lengthOf(CONSTANTS.MAX_VOICES)
		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.vcos[i]).to.be.null
		}
	})

	it('constructor should set 128 null voice oscs', () => {
		expect(osc1.outputs).to.have.lengthOf(CONSTANTS.MAX_VOICES)
		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.vcos[i]).to.be.null
		}
	})

	it('setWaveform should change waveform type', () => {
		const waveform = 'square'

		osc1.setWaveform(waveform)

		expect(osc1.state.waveformType).to.be.equal(waveform)
	})

	it('setFmAmout should change all fm gain values', () => {
		const fmMaxAmout = 1000
		osc1.setFmAmount(CONSTANTS.MIDI_MAX_VALUE)

		expect(osc1.state.fmAmount).to.be.equal(fmMaxAmout)

		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.fmInputs[i].gain.value).to.be.equal(fmMaxAmout)
		}
	})

	it('setState should populate state', () => {
		const fmMaxAmout = 1000
		const waveform = 'sine'

		osc1.setState({
			fmAmount: CONSTANTS.MIDI_MAX_VALUE, waveformType: waveform
		})

		expect(osc1.state.fmAmount).to.be.equal(fmMaxAmout)
		expect(osc1.state.waveformType).to.be.equal(waveform)

		for (let i = 0; i < CONSTANTS.MAX_VOICES; i++) {
			expect(osc1.fmInputs[i].gain.value).to.be.equal(fmMaxAmout)
		}
	})

	it('noteOn should create voice', () => {
		const waveform = 'triangle'
		const midiNote = 69
		osc1.setWaveform(waveform)

		osc1.noteOn(midiNote)

		expect(osc1.vcos[midiNote]).to.be.instanceof(OscillatorNode)
		expect(osc1.vcos[midiNote].type).to.be.equal(waveform)
		expect(osc1.vcos[midiNote].frequency.value).to.be.equal(440)
	})

	it('noteOn should create voice', () => {
		const waveform = 'triangle'
		const midiNote = 69
		osc1.setWaveform(waveform)

		osc1.noteOn(midiNote)

		expect(osc1.vcos[midiNote]).to.be.instanceof(OscillatorNode)
		expect(osc1.vcos[midiNote].type).to.be.equal(waveform)
		expect(osc1.vcos[midiNote].frequency.value).to.be.equal(440)
	})

	it('noteOff before noteOn should do nothing', () => {
		const midiNote = 69

		expect(osc1.noteOff(midiNote, 1)).to.be.undefined
	})
})
