const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nombre, empresa, email, telefono, mensaje } = req.body;

    await resend.emails.send({
      from: "D-Code Partners <contact@dcodepartners.com>",
      to: ["dcodedepartment@gmail.com"],
      subject: `Nueva solicitud de ${nombre}`,
      html: `
        <h2>Nueva solicitud desde la web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });
await resend.emails.send({
  from: "D-Code Partners <contact@dcodepartners.com>",
  to: email,
  subject: "Hemos recibido tu solicitud",
  html: `
    <h2>¡Gracias por contactar con D-Code Partners!</h2>

    <p>Hola ${nombre},</p>

    <p>Hemos recibido correctamente tu solicitud.</p>

    <p>En menos de 24 horas uno de nuestros especialistas se pondrá en contacto contigo.</p>

    <br>

    <p>Un saludo,</p>
    <strong>D-Code Partners</strong>
  `
});
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
