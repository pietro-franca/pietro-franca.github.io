let lastSent = 0;

const htmlLang = document.documentElement.lang || "pt-br"; // padrão pt-br
const lang = htmlLang.startsWith("en") ? "en" : "pt";

// Mensagens traduzidas
const messages = {
  pt: {
    fillFields: "Por favor, preencha todos os campos antes de enviar.",
    captcha: "Por favor, confirme o reCAPTCHA.",
    timeLimit: "Espere 1 minuto antes de enviar outra mensagem.",
    success: "Obrigado! Sua mensagem foi enviada com sucesso.",
    sendError: "Oops! Erro ao enviar mensagem. Por favor, tente novamente mais tarde."
  },
  en: {
    fillFields: "Please fill in all fields before submitting.",
    captcha: "Please complete the reCAPTCHA.",
    timeLimit: "Please wait one minute before sending another message.",
    success: "Thank you! Your message was sent successfully.",
    sendError: "Failed to send the message. Please try again later."
  }
};


document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // 1 envio por minuto
  const now = Date.now();
  if (now - lastSent < 60_000) {
    alert(messages[lang].timeLimit)
    return;
  }

  // Honeypot
  if (document.querySelector('input[name="website"]').value !== "") {
    return;
  }

  const formAlert = document.getElementById("formAlert");
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const message = document.querySelector("#message").value;

  if (!name || !email || !message) {
    formAlert.classList.remove("d-none", "alert-success");
    formAlert.classList.add("alert-danger");
    formAlert.innerText = messages[lang].fillFields;
    return;
  }

  const captchaResponse = grecaptcha.getResponse(); // pega token do reCAPTCHA
  if (!captchaResponse) {
    formAlert.classList.remove("d-none", "alert-success");
    formAlert.classList.add("alert-danger");
    formAlert.innerText = messages[lang].captcha;
    return;
  }

  // Envia via EmailJS
  emailjs.init("3c6FPHGZ5rZtxcToJ");

  emailjs.send("service_lu6su1k", "template_ahj2x0q", {
    name: name,
    email: email,
    message: message,
    "g-recaptcha-response": captchaResponse
  })
  .then(() => {
    formAlert.classList.remove("d-none", "alert-danger");
    formAlert.classList.add("alert-success");
    formAlert.innerText = messages[lang].success;

    this.reset();
    grecaptcha.reset(); // reseta a caixinha
    lastSent = Date.now();
  }, (err) => {
    formAlert.classList.remove("d-none", "alert-success");
    formAlert.classList.add("alert-danger");
    formAlert.innerText = messages[lang].sendError;
  });
});
