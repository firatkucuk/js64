

var emulator;

function start() {

  if (emulator) {
    emulator.start();
  }
}

window.onload = function () {

  var emulatorElement = document.getElementById('emulator');

  if (emulatorElement) {

    console.log($('#emulator'));

    emulator = new c64js.Emulator(emulatorElement);
  }
};
