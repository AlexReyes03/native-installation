const btnInstalar = document.querySelector('#btn-instalar');
const instruccionesIOS = document.querySelector('#ios-instrucciones');
const prePermiso = document.querySelector('#pre-permiso');
const btnActivarCamara = document.querySelector('#btn-activar-camara');
const seccionCamara = document.querySelector('#camara');
const video = document.querySelector('#video');
const btnCambiar = document.querySelector('#btn-cambiar');
const mensajeError = document.querySelector('#mensaje-error');

const MENSAJES_ERROR = {
  NotAllowedError: 'Permiso denegado. Habilita la cámara en la configuración del navegador y vuelve a intentarlo.',
  NotFoundError: 'Este dispositivo no tiene una cámara disponible',
  NotReadableError: 'La cámara está siendo usada por otra aplicación',
};

let stream = null;
let lente = 'environment';
let eventoInstalacion = null;

const esSafariIOS = 'standalone' in window.navigator;
const yaInstalada = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

if (esSafariIOS && !yaInstalada) {
  instruccionesIOS.hidden = false;
}

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  eventoInstalacion = evento;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', async () => {
  if (!eventoInstalacion) return;
  await eventoInstalacion.prompt();
  eventoInstalacion = null;
  btnInstalar.hidden = true;
});

function detenerCamara() {
  stream?.getTracks().forEach((pista) => pista.stop());
  stream = null;
}

async function iniciarCamara() {
  detenerCamara();
  mensajeError.hidden = true;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: lente } },
      audio: false,
    });
  } catch (error) {
    console.error(error);
    mensajeError.textContent = MENSAJES_ERROR[error.name] ?? 'No fue posible acceder a la cámara.';
    mensajeError.hidden = false;
    seccionCamara.hidden = true;
    prePermiso.hidden = false;
    return;
  }

  video.srcObject = stream;
  prePermiso.hidden = true;
  seccionCamara.hidden = false;
}

btnActivarCamara.addEventListener('click', iniciarCamara);

btnCambiar.addEventListener('click', () => {
  lente = lente === 'environment' ? 'user' : 'environment';
  iniciarCamara();
});

window.addEventListener('pagehide', detenerCamara);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}
