import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Letter } from '@/types/letter';
import type { Project } from '@/types/activities';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import { getGenderTerms } from '@/services/letterFormatter';
import { isEmailValid } from '@/services/validators';
import { formatDateLong } from '@/utils/formatDate';
import { EditableBlock } from '@/components/editor/EditableBlock';
import { LogoCanvasLayer } from '@/components/editor/LogoCanvasLayer';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';

const PAGE_STYLE =
  'relative mx-auto bg-white text-black shadow-md print:shadow-none w-[794px] min-h-[1123px] px-[96px] pt-12 pb-[130px] font-sans text-[14px]';

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
      <div className="border-t border-gray-200" />
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
      <strong>{endDate}</strong>, participó como apoyo técnico en los siguientes proyectos:
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
  signatureLayout?: SignatureLayout;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function SignatureOverlay({
  signature,
  signatureLayout,
}: {
  signature: SignatureData;
  signatureLayout: SignatureLayout;
}) {
  const setSignatureLayout = useFormStore((s) => s.setSignatureLayout);
  const editorMode = useAppStore((s) => s.editorMode);

  function handleDragStart(e: ReactPointerEvent<HTMLDivElement>) {
    if (editorMode !== 'preview') return;
    const target = e.currentTarget.closest('[data-letter-page]') as HTMLElement | null;
    if (!target) return;
    const onMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const xPct = clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 96);
      const yPct = clamp(((event.clientY - rect.top) / rect.height) * 100, 6, 92);
      setSignatureLayout({ xPct, yPct });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function handleResizeStart(e: ReactPointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const startX = e.clientX;
    const startScale = signatureLayout.scale;
    const onMove = (event: PointerEvent) => {
      const nextScale = clamp(startScale + (event.clientX - startX) * 0.004, 0.4, 2);
      setSignatureLayout({ scale: nextScale });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  const isInteractive = editorMode === 'preview';
  return (
    <div
      className={isInteractive ? 'group absolute select-none' : 'absolute select-none'}
      style={{
        left: `${signatureLayout.xPct}%`,
        top: `${signatureLayout.yPct}%`,
        transform: `translate(-50%, -50%) rotate(${signatureLayout.rotationDeg}deg)`,
      }}
      onPointerDown={handleDragStart}
      role={isInteractive ? 'button' : undefined}
      aria-label={isInteractive ? 'Firma arrastrable' : undefined}
      tabIndex={isInteractive ? 0 : -1}
    >
      <img
        src={signature.dataUrl}
        alt="Firma digital"
        className={isInteractive ? 'pointer-events-none object-contain' : 'object-contain'}
        style={{
          width: `${180 * signatureLayout.scale}px`,
          maxWidth: '340px',
          maxHeight: '140px',
        }}
      />
      {isInteractive && (
        <button
          type="button"
          aria-label="Redimensionar firma"
          title="Arrastra para cambiar tamaño"
          className="absolute -bottom-2 -right-2 hidden h-4 w-4 cursor-ew-resize rounded-full border border-white bg-[var(--color-accent)] shadow group-hover:block"
          onPointerDown={handleResizeStart}
        />
      )}
    </div>
  );
}

export function SenaTemplate({ letter, signature, signatureLayout }: SenaTemplateProps) {
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
        <LogoCanvasLayer />
        {signature && signatureLayout && (
          <SignatureOverlay signature={signature} signatureLayout={signatureLayout} />
        )}
        <div className="mb-8" />

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
