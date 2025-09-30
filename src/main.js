document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    grecaptcha.ready(async () => {
      try {
        // 🔑 Pegar token invisível do reCAPTCHA
        const token = await grecaptcha.execute("6LfEUNUrAAAAALVPTD0FOqXJ_4w3BrQywseHYC-z", {
          action: "submit",
        });

        // 🔑 Enviar para backend
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, token }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Mensagem enviada com sucesso!");
          this.reset();
        } else {
          alert("Erro: " + result.error);
        }
      } catch (err) {
        console.error("Erro:", err);
        alert("Falha ao enviar mensagem.");
      }
    });
  });
