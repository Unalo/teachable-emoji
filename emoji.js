// more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/-hzS7auUD/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
		document.querySelector("button").classList.add("hidden");

		const emoji = document.querySelector(".emoji");
		const  soundsMap = {
			"Clap": "👏",
			"Finger tap" : "👌",
			"Double clap" : "🙌",
			"Background Noise" : "👂",
			"Laughing" : "🤣"
		};

		recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
						
			// bringer the labels & values together
			const labelWithValue = classLabels.map((label, index) => {
				const value = result.scores[index];
				return {
					label,
					value
				};
			});

			// finding the label with  the  highest value
			let sound = labelWithValue[0];
			labelWithValue.forEach(function(entry){
				if (entry.value >= sound.value){
					sound = entry;
				}
			});

			// show an emoji for the sound
			emoji.innerHTML = soundsMap[sound.label];
			
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }