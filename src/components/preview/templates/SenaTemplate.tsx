import type { Letter } from '@/types/letter';
import type { Project } from '@/types/activities';
import type { SignatureData } from '@/types/signature';
import { getGenderTerms } from '@/services/letterFormatter';
import { isEmailValid } from '@/services/validators';
import { formatDateLong } from '@/utils/formatDate';
import { EditableBlock } from '@/components/editor/EditableBlock';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const PAGE_STYLE =
  'relative mx-auto bg-white text-black shadow-md print:shadow-none w-[794px] min-h-[1123px] px-[96px] pt-12 pb-[130px] font-sans text-[14px]';

function CenteredLogoHeader() {
  return (
    <div className="w-full flex justify-center mb-8">
      <img src="/logo.png" alt="SENA" className="h-[68px] w-auto" />
    </div>
  );
}

function SocialIconsRow() {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-600 text-[12px]">
      <FaInstagram size={13} />
      <FaFacebook size={13} />
      <FaXTwitter size={13} />
      <FaYoutube size={13} />
      <FaLinkedinIn size={13} />
      <span className="ml-1 font-bold text-[10.5px]">@SENAComunica</span>
      <span className="mx-1.5 text-gray-400">·</span>
      <span className="text-[10.5px]">www.sena.edu.co</span>
    </div>
  );
}

function Footer({ letter }: { letter: Letter }) {
  const regional = letter.center.regional || '[Regional]';
  const centerName = letter.center.name || '[Nombre del centro]';
  const address = letter.center.address || '[Dirección]';
  const phone = letter.center.phone || '[Teléfono]';
  const docCode = letter.center.documentCode || '';
  const docVersion = letter.center.documentVersion || '';

  return (
    <footer className="absolute bottom-0 left-0 right-0">
      <div className="text-center text-[10.5px] font-medium text-[#5a9e1a] leading-snug mb-1 px-24">
        <p>Regional {regional}/ {centerName}</p>
        <p>{address} - PBX {phone}</p>
      </div>
      <div className="border-t border-gray-200 py-2 px-24 flex items-center justify-center">
        <SocialIconsRow />
      </div>
      {(docCode || docVersion) && (
        <span className="absolute right-2 bottom-8 origin-bottom-right -rotate-90 text-[9px] text-gray-400 tracking-wider whitespace-nowrap">
          {docCode} {docVersion}
        </span>
      )}
    </footer>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const { code, name, description } = project;
  if (!code && !name && !description) return null;
  const header = [code.trim(), name.trim()].filter(Boolean).join(' – ');
  return (
    <li className="text-justify leading-snug">
      {header && <strong>{header}</strong>}
      {header && description && <span>: </span>}
      {description}
    </li>
  );
}

function BodyParagraph({ letter }: { letter: Letter }) {
  const terms = getGenderTerms(letter.intern.gender);
  const { intern, period, center } = letter;

  const name = intern.fullName || '[Nombre completo]';
  const docNum = intern.documentNumber || '[Número de documento]';
  const docCity = intern.documentCity || '[Ciudad de expedición]';
  const program = intern.program || '[Programa]';
  const modality = period.modality || '[Modalidad]';
  const placeOfPractice = period.area || period.unit || center.name || '[Tecnoparque Nodo]';
  const startDate = formatDateLong(period.startDate) || '[Fecha de inicio]';
  const endDate = formatDateLong(period.endDate) || '[Fecha fin]';

  return (
    <p className="mb-4 text-justify leading-relaxed">
      <strong>{name}</strong>, {terms.identificado} con la {intern.documentType}{' '}
      Número <strong>{docNum}</strong> expedida en {docCity}, de la{' '}
      <strong>{program}</strong>; realizó su práctica en la modalidad de{' '}
      {modality} en {placeOfPractice} desde el{' '}
      <strong>{startDate}</strong>, hasta el{' '}
      <strong>{endDate}</strong>, participó en los siguientes proyectos:
    </p>
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

export interface SenaTemplateProps {
  letter: Letter;
  signature?: SignatureData | null;
}

export function SenaTemplate({ letter, signature }: SenaTemplateProps) {
  const tasks = letter.activities.tasks.filter(
    (p) => p.code.trim() || p.name.trim() || p.description.trim()
  );

  const position = (letter.signer.position || '[Cargo del firmante]').toUpperCase();
  const centerName = (letter.center.name || '[Centro]').toUpperCase();
  const signerTitle = `El ${position} DEL ${centerName}`;

  const issueDate = formatDateLong(letter.metadata.issueDate) || '[Fecha de expedición]';
  const city = letter.metadata.city || '[Ciudad]';

  const ext = letter.instructor.extension?.trim()
    ? ` extensión ${letter.instructor.extension.trim()}`
    : '';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Página 1 */}
      <article data-letter-page="1" className={PAGE_STYLE}>
        <CenteredLogoHeader />

        {/* Número de radicado */}
        <div className="text-center text-[14px] mb-8">
          {letter.metadata.documentNumber || '[Número de documento]'}
        </div>

        {/* Título: cargo del firmante */}
        <EditableBlock
          overrideKey="signerHeader"
          defaultValue={signerTitle}
          as="div"
          className="text-center mb-8 px-10 leading-snug"
        />

        {/* Subtítulo */}
        <EditableBlock
          overrideKey="haceConstar"
          defaultValue="HACE CONSTAR QUE:"
          as="p"
          className="mb-6 text-center font-bold"
        />

        <section className="flex flex-col leading-relaxed">
          <BodyParagraph letter={letter} />

          {/* Lista numerada de proyectos */}
          <ol className="list-decimal pl-8 space-y-3 mb-6">
            {tasks.map((p, i) => (
              <ProjectItem key={i} project={p} />
            ))}
            {tasks.length === 0 && (
              <li className="text-slate-400 italic">[Proyectos realizados]</li>
            )}
          </ol>

          {/* Información de contacto del experto */}
          <p className="mb-6 text-justify">
            <EditableBlock
              overrideKey="contactPrefix"
              defaultValue="Cualquier información adicional será suministrada por el experto"
              as="span"
            />{' '}
            <strong>{letter.instructor.fullName || '[Nombre del experto]'}</strong>, en el teléfono{' '}
            {letter.instructor.phone || '[Teléfono]'}{ext}, o en correo electrónico{' '}
            <InstructorEmail email={letter.instructor.email} />
          </p>

          {/* Frase de expedición */}
          <p className="mb-10 pl-4 text-justify">
            <EditableBlock
              overrideKey="issuedPrefix"
              defaultValue="Se expide esta constancia a solicitud del interesado"
              as="span"
            />{' '}
            el <strong>{issueDate}</strong> en la ciudad de {city}
          </p>

          {/* Bloque del firmante */}
          <div className="text-center mb-14 mt-4">
            <p className="font-bold">{letter.signer.fullName || '[Nombre del firmante]'}</p>
            <p className="font-bold">{letter.signer.position || '[Cargo del firmante]'}</p>
            <p className="font-bold">{letter.center.name || '[Nombre del centro]'}</p>
          </div>

          {/* Firma digital */}
          {signature && (
            <div className="flex justify-center mb-4">
              <img
                src={signature.dataUrl}
                alt="Firma"
                className="max-h-[70px] max-w-[180px] object-contain"
              />
            </div>
          )}

          {/* Proyectó */}
          <div className="text-[11px] text-black">
            <p>Proyectó: {letter.drafter.fullName || '[Nombre proyectó]'}</p>
            <p>{letter.drafter.role || '[Cargo proyectó]'}</p>
          </div>
        </section>

        <Footer letter={letter} />
      </article>
    </div>
  );
}
