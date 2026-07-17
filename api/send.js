const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
const {
  nombre,
  empresa,
  email,
  telefono,
  mensaje,
  turnstileToken
} = req.body;
const verify = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken
    })
  }
);

const verification = await verify.json();

if (!verification.success) {
  return res.status(400).json({
    error: "Verificación anti-spam fallida."
  });
}
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
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:auto;">
      
      <h2 style="color:#2b2b2b;">¡Gracias por contactar con D-Code Partners!</h2>

      <p>Hola <strong>${nombre}</strong>,</p>

      <p>
        Hemos recibido correctamente tu solicitud y queremos agradecerte la confianza depositada en nosotros.
      </p>

      <p>
        Nuestro equipo revisará la información que nos has enviado y preparará la mejor forma de ayudarte a automatizar y optimizar tu negocio.
      </p>

      <p>
        En un plazo inferior a <strong>24 horas laborables</strong> nos pondremos en contacto contigo para conocer mejor tus necesidades y resolver cualquier duda.
      </p>

      <p>
        Mientras tanto, si necesitas ampliar información o quieres añadir algún detalle a tu solicitud, puedes responder directamente a este correo.
      </p>

      <hr style="margin:30px 0;">

      <p>
        Un saludo,
      </p>

      <p>
        <strong>Equipo de D-Code Partners</strong><br>
        Automatización e Inteligencia Artificial para Empresas
      </p>

    </div>
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
