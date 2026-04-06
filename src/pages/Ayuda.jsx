export default function Ayuda() {
  return (
    <main className="help">
      <div className="container">
        <h1 className="page-title">Consejos y cuidados</h1>
        <p className="page-sub">
          Consejos simples para cuidar tu pod y que te dure más.
        </p>

        {/* Cuidados básicos */}
        <section className="help-card">
          <h2 className="help-title">Cuidados básicos</h2>
          <ul className="help-list">
            <li>
              <strong>No lo mojes.</strong> Evitá lluvia, salpicaduras y usarlo
              con las manos húmedas.
            </li>
            <li>
              <strong>Lejos del calor.</strong> No lo dejes al sol ni dentro del
              auto. El calor arruina la batería y el líquido.
            </li>
            <li>
              <strong>Sin golpes ni rayones.</strong> No lo mezcles con llaves o
              monedas. Llevá el pod en un bolsillo o compartimento aparte.
            </li>
            <li>
              <strong>Usalo con calma.</strong> Hacé caladas suaves y no muy
              largas para que no se caliente de más ni cambie el sabor.
            </li>
            <li>
              <strong>Si sabe a quemado, frená.</strong> Eso indica que el
              líquido ya no rinde o se terminó.
            </li>
          </ul>
        </section>

        {/* Carga y batería */}
        <section className="help-card">
          <h2 className="help-title">Carga y batería</h2>
          <ul className="help-list">
            <li>
              <strong>No uses “carga rápida”.</strong> Preferí cargadores
              comunes (5V/1A). Los de celular con carga rápida pueden dañar la
              batería.
            </li>
            <li>
              <strong>Cable en buen estado.</strong> Si está pelado o flojo,
              cambialo.
            </li>
            <li>
              <strong>No lo dejes toda la noche.</strong> Cuando llegue al 100%,
              desconectalo.
            </li>
            <li>
              <strong>¿Se calienta mucho?</strong> Desconectalo y dejalo
              enfriar. Tibio es normal, caliente no.
            </li>
            <li>
              <strong>Si es descartable y no trae puerto de carga,</strong> no
              intentes cargarlo.
            </li>
          </ul>
        </section>

        {/* Guardado y uso diario */}
        <section className="help-card">
          <h2 className="help-title">Guardado y uso diario</h2>
          <ul className="help-list">
            <li>
              <strong>Lugar fresco y seco.</strong> Sin sol directo ni humedad.
            </li>
            <li>
              <strong>Si no lo vas a usar varios días,</strong> dejalo con algo
              de batería (mitad aprox.).
            </li>
            <li>
              <strong>Entre calada y calada,</strong> esperá unos segundos.
              Rinde mejor y dura más.
            </li>
          </ul>
        </section>

        {/* Tus tips (resumidos y parejos) */}
        <section className="help-card">
          <h2 className="help-title">Tips rápidos</h2>
          <ul className="help-list">
            <li>
              <strong>Evitá temperaturas extremas.</strong> Mucho calor o frío
              bajan el rendimiento.
            </li>
            <li>
              <strong>Guardalo separado.</strong> No lo mezcles con objetos que
              lo golpeen o rayen.
            </li>
            <li>
              <strong>No encadenes caladas.</strong> Esperá unos segundos entre
              una y otra.
            </li>
            <li>
              <strong>Sin carga rápida.</strong> Usá cargador común. Si es
              descartable, no lo cargues.
            </li>
            <li>
              <strong>Cuando se agota, listo.</strong> No insistas. Llévalo a un
              punto de reciclaje.
            </li>
          </ul>
        </section>

        {/* Garantía y contacto */}
        <section className="help-card">
          <h2 className="help-title">Garantía y contacto</h2>
          <p className="help-text">
            Nuestros productos tienen garantía por fallas de fábrica. Guardá el
            empaque. Si algo no anda bien dentro de las primeras 24 horas,
            escribinos y lo resolvemos.
          </p>
          <p className="help-note">
            Golpes, humedad o cargas inadecuadas pueden anular la garantía.
          </p>
        </section>

        <p className="help-disclaimer sub">
          Importante: algunos pods contienen nicotina. Mantenelos fuera del
          alcance de niños y mascotas. Si tenés dudas, hablá con nosotros.
        </p>
      </div>
    </main>
  );
}
