const AUDIO_NAMES = {
    "blast": "blast.wav",
    "miss": "miss.wav",
    "hit": "hit.wav",
}

export default async function playAudio(audio, times = 1) {
    let i = 1;
    const audioName = AUDIO_NAMES[audio];
    const audioPath = `../audio/${audioName}`;
    new Audio(audioPath).play();
    while (i < times) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        new Audio(audioPath).play();
        i++;
    }
}
