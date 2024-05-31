// Das Beat-Element auswählen
var oceanBeat = document.getElementById("ocean-beat");
// Das Audio-Element auswählen
var oceanAudio = document.getElementById("ocean-audio");
// Das Play-Button-Element auswählen
var playButton = document.getElementById("play-button");

// Eventlistener hinzufügen, um das Abspielen der MP3-Datei zu starten
playButton.addEventListener("click", function() {
    // MP3-Datei abspielen
    oceanAudio.play();
});
