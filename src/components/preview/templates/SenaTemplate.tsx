import type { Letter } from '@/types/letter';
import {
  buildBodyParagraph,
  buildClassificationLabel,
  buildSubtitle,
  buildTitle,
} from '@/services/letterFormatter';
import { isEmailValid } from '@/services/validators';
import { formatDateLong, formatDateShort } from '@/utils/formatDate';

const PAGE_STYLE =
  'relative mx-auto bg-white text-black shadow-md print:shadow-none w-[794px] min-h-[1123px] px-24 py-16 font-sans text-[15px]';

function SenaLogo() {
  return (
    <img src="/logo.png" alt="SENA" className="h-[75px] w-auto mx-auto" />
  );
}

function SenaComunica() {
  return (
    <img src="/sena-comunica.png" alt="SENA Comunica" className="h-[45px] w-auto mx-auto mb-2" />
  );
}

function Classification({ label }: { label: string }) {
  const isPublic = label.trim().toUpperCase() === 'PÚBLICA' || label.trim().toUpperCase() === 'PUBLICA' || label.trim().toUpperCase() === 'PUBLIC';
  const isClassified = label.trim().toUpperCase() === 'CLASIFICADA';
  const isReserved = label.trim().toUpperCase() === 'RESERVADA';

  return (
    <div className="flex flex-col border border-black text-[12px] w-full max-w-[500px] mx-auto mt-4 mb-4">
      <div className="bg-black text-white text-center font-bold py-1">
        CLASIFICACIÓN DE LA INFORMACIÓN
      </div>
      <div className="flex text-[11px] leading-tight">
        <div className="flex-1 flex items-center justify-between border-r border-black px-2 py-1">
          <span className="font-bold">Pública</span>
          <span className="border border-black w-4 h-4 flex items-center justify-center text-[10px] leading-none pb-[1px]">{isPublic ? 'x' : '\u00A0'}</span>
        </div>
        <div className="flex-1 flex items-center justify-between border-r border-black px-2 py-1">
          <span>Pública Clasificada</span>
          <span className="border border-black w-4 h-4 flex items-center justify-center text-[10px] leading-none pb-[1px]">{isClassified ? 'x' : '\u00A0'}</span>
        </div>
        <div className="flex-1 flex items-center justify-between px-2 py-1">
          <span>Pública Reservada</span>
          <span className="border border-black w-4 h-4 flex items-center justify-center text-[10px] leading-none pb-[1px]">{isReserved ? 'x' : '\u00A0'}</span>
        </div>
      </div>
    </div>
  );
}

function Footer({ letter }: { letter: Letter }) {
  const centerName = letter.center.name || '[Nombre del centro]';
  const address = letter.center.address || '[Dirección]';
  const phone = letter.center.phone || '[Teléfono]';
  const docCode = letter.center.documentCode || '[Código]';
  const docVersion = letter.center.documentVersion || '[Versión]';

  return (
    <footer className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
      <div className="w-full text-center text-[11px] font-medium text-[#8bc53f] leading-tight mb-3">
        <p>{centerName}</p>
        <p>Dirección {address} - PBX {phone}</p>
      </div>
      <SenaComunica />
      <div className="absolute left-[calc(100%-30px)] bottom-[60px] origin-bottom-left -rotate-90 text-[10px] text-gray-400 tracking-widest whitespace-nowrap">
        {docCode} {docVersion}
      </div>
    </footer>
  );
}

export interface SenaTemplateProps {
  letter: Letter;
}

export function SenaTemplate({ letter }: SenaTemplateProps) {
  const tasks = letter.activities.tasks.filter((t) => t.trim().length > 0);
  const strengths = letter.activities.technicalStrengths.filter((s) => s.trim().length > 0);

  return (
    <div className="flex flex-col items-center gap-6">
      <article data-letter-page="1" className={PAGE_STYLE}>
        <header className="w-full flex flex-col items-center mb-8">
          <SenaLogo />
          <Classification label={buildClassificationLabel(letter)} />
          
          <div className="text-center mt-2 text-[15px]">
            <p>{letter.metadata.documentNumber || '[Número de documento]'}</p>
          </div>
          <div className="mb-4 text-center text-[15px] mt-6">
            <p>{letter.metadata.city || '[Ciudad]'}, {formatDateLong(letter.metadata.issueDate) || '[Fecha de expedición]'}.</p>
          </div>
        </header>

        <section className="flex flex-col text-justify leading-relaxed">
          <h1 className="text-center font-bold uppercase mb-4 px-12">
            {buildTitle(letter)}
          </h1>

          <p className="text-center font-bold uppercase mb-8 px-8">
            {buildSubtitle(letter)}
          </p>

          <p className="mb-6 indent-0">{buildBodyParagraph(letter)}</p>

          <div className="mb-6">
            <p className="mb-2">
              Dentro de las actividades realizadas por la practicante en la {letter.period.area} se encuentran:
            </p>
            <ul className="list-[square] pl-12 space-y-1">
              {tasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
              {tasks.length === 0 && <li className="text-slate-400">[Actividades realizadas]</li>}
            </ul>
          </div>
        </section>

        <Footer letter={letter} />
      </article>

      <article data-letter-page="2" className={PAGE_STYLE}>
        <header className="w-full flex flex-col items-center mb-8">
          <SenaLogo />
        </header>

        <section className="flex flex-col text-justify leading-relaxed">
          <div className="mb-6">
            <p className="mb-2">Demostró fortalezas Técnicas en:</p>
            <ul className="list-[square] pl-12 space-y-1">
              {strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
              {strengths.length === 0 && <li className="text-slate-400">[Fortalezas técnicas]</li>}
            </ul>
          </div>

          <p className="mb-8 indent-0">
            {letter.activities.performanceReview || '[Evaluación del desempeño]'}
          </p>

          <p className="mb-8">
            Cualquier información adicional será suministrada por el instructor de etapa productiva {letter.instructor.fullName || '[Nombre del instructor]'} al teléfono {letter.instructor.phone || '[Teléfono]'} o al correo <InstructorEmail email={letter.instructor.email} />
          </p>

          <p className="mb-8">{letter.metadata.city || '[Ciudad]'}, {formatDateShort(letter.metadata.issueDate) || '[Fecha]'}.</p>

          <p className="mb-16">Cordialmente,</p>

          <div className="text-center mb-16">
            <p className="font-bold uppercase text-[16px] mb-1">{letter.signer.fullName || '[Nombre del firmante]'}</p>
            <p className="font-bold text-[16px]">{letter.signer.position || '[Cargo del firmante]'}</p>
          </div>

          <p className="text-[11px] text-black w-full">
            Proyectó: {letter.drafter.fullName || '[Nombre proyectó]'}. {letter.drafter.role || '[Cargo proyectó]'}.
          </p>
        </section>

        <Footer letter={letter} />
      </article>

    </div>
  );
}

function InstructorEmail({ email }: { email: string }) {
  const trimmed = email.trim();
  if (!trimmed) return <>[Email]</>;
  if (!isEmailValid(trimmed)) return <>{trimmed}</>;
  return (
    <a href={`mailto:${encodeURIComponent(trimmed)}`} className="text-blue-600 underline">
      {trimmed}
    </a>
  );
}
