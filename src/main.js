emailjs.init("3c6FPHGZ5rZtxcToJ");

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceID = "service_lu6su1k";
    const templateID = "template_ahj2x0q";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        document
          .getElementById("formAlert")
          .classList.remove("d-none", "alert-danger");
        document.getElementById("formAlert").classList.add("alert-success");
        document.getElementById("formAlert").innerText =
          "Message sent successfully!";
        this.reset();
      },
      (err) => {
        document
          .getElementById("formAlert")
          .classList.remove("d-none", "alert-success");
        document.getElementById("formAlert").classList.add("alert-danger");
        document.getElementById("formAlert").innerText =
          "Failed to send message. Please try again.";
      }
    );
  });
