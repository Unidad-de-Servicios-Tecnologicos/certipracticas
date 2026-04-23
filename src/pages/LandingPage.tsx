import { APP_NAME, APP_TAGLINE } from '@/data/constants';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { FiArrowRight, FiFileText, FiEdit3, FiDownloadCloud } from 'react-icons/fi';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent)] selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl w-full mx-auto bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-transparent transition-colors duration-300">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <img src="/logo.png" alt="SENA Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-lg tracking-tight hidden sm:block">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-4 animate-fade-in-up delay-100">
          <ThemeToggle />
          <a
            href="#app"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            Abrir App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30 pointer-events-none blur-[100px] bg-gradient-to-tr from-[var(--color-accent)] to-blue-400 rounded-full -z-10 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm font-medium mb-8 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-accent)]"></span>
          </span>
          Sistema de Certificaciones Activo
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl mb-6 text-balance leading-[1.1] animate-fade-in-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          Forja documentos con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-emerald-400">precisión absoluta</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-3xl mb-12 text-balance leading-relaxed animate-fade-in-up delay-200 opacity-0 font-medium" style={{ animationFillMode: 'forwards' }}>
          {APP_TAGLINE}. Un motor generador de primera clase diseñado para mantener la estricta exactitud formativa del SENA.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <a
            href="#app"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] px-8 py-4 text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--color-accent)]/25 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Comenzar a Crear
              <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[var(--color-bg-secondary)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          </a>
        </div>
        
        {/* App Preview Window */}
        <div className="mt-20 w-full max-w-6xl mx-auto rounded-xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 shadow-2xl animate-fade-in-up delay-300 opacity-0 hidden md:block group" style={{ animationFillMode: 'forwards' }}>
          <div className="rounded-lg sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] overflow-hidden shadow-sm flex flex-col h-[700px] relative pointer-events-none select-none">
            {/* Invisible overlay to prevent scroll trapping but keep visual */}
            <div className="absolute inset-0 z-50"></div>
            
            <div className="h-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center px-4 gap-2 relative z-10 w-full">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] px-3 py-1 rounded-md border border-[var(--color-border)]">certipracticas-app</div>
            </div>
            
            <div className="flex-1 w-full bg-[var(--color-bg-primary)] overflow-hidden relative">
              <div className="absolute inset-0">
                <AppPreviewSVG />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Showcase */}
      <section className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Herramientas Profesionales</h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para generar cartas y certificaciones sin preocuparte por el formato.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              icon={<FiEdit3 className="w-8 h-8" />}
              title="Formulario Estructurado"
              description="Ingresa los datos de forma estructurada y visualiza en tiempo real el documento exacto que vas a generar."
            />
            <FeatureCard 
              icon={<FiFileText className="w-8 h-8" />}
              title="Plantillas Precisas"
              description="Márgenes, tipografías y espaciados milimétricamente ajustados a las normativas de certificación."
            />
            <FeatureCard 
              icon={<FiDownloadCloud className="w-8 h-8" />}
              title="Exportación Universal"
              description="Genera archivos DOCX totalmente editables o PDFs listos para imprimir con un solo clic de alta calidad."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--color-bg-primary)] px-6">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] border border-[var(--color-border)] p-12 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para optimizar tu flujo de trabajo?</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
            No pierdas más tiempo ajustando márgenes. Crea tu primer documento ahora.
          </p>
          <a
            href="#app"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] text-white px-8 py-3 text-lg font-bold transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-1 hover:shadow-lg active:scale-95"
          >
            Abrir Generador
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] py-12 px-6 text-center text-[var(--color-text-secondary)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <img src="/logo.png" alt="SENA Logo" className="h-8 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <p className="text-sm font-medium">© {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group flex flex-col items-start p-8 rounded-3xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[var(--color-accent)]/30">
      <div className="p-4 rounded-2xl bg-[var(--color-bg-tertiary)] text-[var(--color-accent)] mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed text-base font-medium">
        {description}
      </p>
    </div>
  );
}

function AppPreviewSVG() {
  return (
    <svg viewBox="0 0 1200 800" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="15" floodOpacity="0.25" floodColor="#000" />
        </filter>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Base Background */}
      <rect width="1200" height="800" fill="#0a0a0a" />
      
      {/* --- LEFT SIDEBAR (FORMS) --- */}
      <g transform="translate(0, 0)">
        {/* Top Header */}
        <text x="30" y="40" fill="#a1a1aa" fontSize="14" fontFamily="system-ui, sans-serif">Guardado ✓</text>
        <text x="240" y="40" fill="#ffffff" fontSize="14" fontWeight="500" fontFamily="system-ui, sans-serif">Cargar ejemplo</text>
        <text x="350" y="40" fill="#ffffff" fontSize="14" fontWeight="500" fontFamily="system-ui, sans-serif">Limpiar</text>
        
        {/* Form Group 1 */}
        <rect x="25" y="80" width="370" height="600" rx="16" fill="#121212" stroke="#262626" strokeWidth="1.5" />
        
        {/* Accordion Header */}
        <circle cx="50" cy="115" r="6" fill="#10b981" />
        <text x="70" y="120" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">Practicante</text>
        <path d="M 370 115 l -5 -5 l -5 5" stroke="#a1a1aa" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Field 1 (Error State) */}
        <text x="280" y="160" fill="#a1a1aa" fontSize="13" textAnchor="end" fontFamily="system-ui, sans-serif">Nombre completo <tspan fill="#ef4444">*</tspan></text>
        {/* Voice dictate button */}
        <rect x="290" y="145" width="85" height="24" rx="12" fill="#ffffff" />
        <text x="332" y="161" fill="#000000" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui, sans-serif">Dictar por voz</text>
        
        {/* Input 1 */}
        <rect x="45" y="175" width="290" height="44" rx="8" fill="#0a0a0a" stroke="#ef4444" strokeWidth="1" />
        <rect x="345" y="175" width="30" height="44" rx="8" fill="#1f1f1f" />
        {/* Mic icon */}
        <circle cx="360" cy="197" r="4" fill="#a1a1aa" />
        <path d="M 356 200 v 2 a 4 4 0 0 0 8 0 v -2" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="360" y1="206" x2="360" y2="209" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Required Text */}
        <text x="190" y="235" fill="#ef4444" fontSize="12" textAnchor="middle" fontFamily="system-ui, sans-serif">Nombre requerido</text>
        
        {/* Field 2 */}
        <text x="280" y="270" fill="#a1a1aa" fontSize="13" textAnchor="end" fontFamily="system-ui, sans-serif">Tipo de documento</text>
        {/* Input 2 */}
        <rect x="45" y="285" width="330" height="44" rx="8" fill="#0a0a0a" stroke="#262626" strokeWidth="1" />
        <text x="60" y="312" fill="#e2e8f0" fontSize="14" fontFamily="system-ui, sans-serif">C.E. — Cédula de Extranjería</text>
        <path d="M 350 305 l 5 5 l 5 -5" stroke="#a1a1aa" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Field 3 */}
        <text x="280" y="360" fill="#a1a1aa" fontSize="13" textAnchor="end" fontFamily="system-ui, sans-serif">Número de documento <tspan fill="#ef4444">*</tspan></text>
        <rect x="290" y="345" width="85" height="24" rx="12" fill="#ffffff" />
        <text x="332" y="361" fill="#000000" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui, sans-serif">Dictar por voz</text>
        
        <rect x="45" y="375" width="290" height="44" rx="8" fill="#0a0a0a" stroke="#ef4444" strokeWidth="1" />
        <rect x="345" y="375" width="30" height="44" rx="8" fill="#1f1f1f" />
        <text x="190" y="435" fill="#ef4444" fontSize="12" textAnchor="middle" fontFamily="system-ui, sans-serif">Documento requerido</text>
        
        {/* Form Group 2 Header (Collapsed) */}
        <rect x="25" y="700" width="370" height="60" rx="16" fill="#121212" stroke="#262626" strokeWidth="1.5" />
        <circle cx="50" cy="730" r="6" fill="#10b981" />
        <text x="70" y="735" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">Centro de formación</text>
        <path d="M 370 725 l -5 5 l -5 -5" stroke="#a1a1aa" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* --- RIGHT SIDEBAR (DOCUMENT & TOOLBAR) --- */}
      <g transform="translate(420, 0)">
        {/* Document Wrapper BG */}
        <rect width="780" height="720" fill="#141414" />
        
        <g filter="url(#shadow)">
          <rect x="30" y="30" width="720" height="690" fill="#ffffff" />
        </g>
        
        {/* Document Content */}
        <g transform="translate(30, 30)">
          {/* SENA Logo Mock */}
          <g transform="translate(310, 50)">
            <rect x="30" y="0" width="40" height="12" fill="#10b981" />
            <path d="M 50 15 L 20 60 L 35 60 L 50 35 L 65 60 L 80 60 Z" fill="#10b981" />
            <rect x="0" y="15" width="100" height="12" fill="#10b981" />
            <text x="50" y="-5" fill="#10b981" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">SENA</text>
          </g>
          
          {/* Table Header */}
          <rect x="80" y="130" width="560" height="24" fill="#000000" />
          <text x="360" y="147" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">CLASIFICACIÓN DE LA INFORMACIÓN</text>
          <rect x="80" y="154" width="560" height="24" fill="none" stroke="#000000" strokeWidth="1.5" />
          <text x="90" y="170" fill="#000000" fontSize="12" fontFamily="system-ui, sans-serif">Pública</text>
          <rect x="250" y="158" width="12" height="12" fill="none" stroke="#000000" strokeWidth="1" />
          <line x1="252" y1="160" x2="260" y2="168" stroke="#000000" strokeWidth="1"/>
          <line x1="260" y1="160" x2="252" y2="168" stroke="#000000" strokeWidth="1"/>
          <text x="280" y="170" fill="#000000" fontSize="12" fontFamily="system-ui, sans-serif">Pública Clasificada</text>
          <rect x="450" y="158" width="12" height="12" fill="none" stroke="#000000" strokeWidth="1" />
          <text x="470" y="170" fill="#000000" fontSize="12" fontFamily="system-ui, sans-serif">Pública Reservada</text>
          <rect x="620" y="158" width="12" height="12" fill="none" stroke="#000000" strokeWidth="1" />
          
          {/* Number & Date */}
          <text x="360" y="230" fill="#000000" fontSize="14" textAnchor="middle" fontFamily="system-ui, sans-serif">5 9402</text>
          <text x="360" y="270" fill="#000000" fontSize="14" textAnchor="middle" fontFamily="system-ui, sans-serif">Medellín, 18 de abril de 2026.</text>
          
          {/* Title */}
          <text x="360" y="340" fill="#000000" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">CERTIFICACIÓN DE EJECUCIÓN DE ETAPA PRODUCTIVA EN EL CENTRO</text>
          <text x="360" y="360" fill="#000000" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">DE SERVICIOS Y GESTIÓN EMPRESARIAL</text>
          
          <text x="360" y="410" fill="#000000" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">EL [CARGO] DEL CENTRO DE SERVICIOS Y GESTIÓN EMPRESARIAL,</text>
          <text x="360" y="430" fill="#000000" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">REGIONAL ANTIOQUIA DEL SENA, HACE CONSTAR:</text>
          
          {/* Paragraph 1 */}
          <text x="80" y="490" fill="#000000" fontSize="14" fontFamily="system-ui, sans-serif">Que, cumplidos [Duración] desde el 18 de enero de 2026 al 18 de abril de 2026</text>
          <text x="80" y="510" fill="#000000" fontSize="14" fontFamily="system-ui, sans-serif">[Nombre completo], identificada con C.E.: [Número de documento] expedida en</text>
          <text x="80" y="530" fill="#000000" fontSize="14" fontFamily="system-ui, sans-serif">la ciudad de [Ciudad], finalizó su proceso de etapa productiva bajo la modalidad de contrato</text>
          <text x="80" y="550" fill="#000000" fontSize="14" fontFamily="system-ui, sans-serif">de aprendizaje en la empresa...</text>
          
          {/* Faded overlay */}
          <rect x="30" y="450" width="660" height="200" fill="url(#fade)" />
        </g>
        
        {/* Scrollbar */}
        <rect x="765" y="30" width="8" height="600" fill="#0a0a0a" rx="4" />
        <rect x="765" y="40" width="8" height="150" fill="#404040" rx="4" />
        
        {/* Toolbar Area */}
        <rect y="720" width="780" height="80" fill="#121212" stroke="#262626" strokeWidth="1" />
        
        {/* Zoom controls */}
        <rect x="20" y="740" width="160" height="40" rx="20" fill="#1a1a1a" />
        <circle cx="45" cy="760" r="8" fill="none" stroke="#a1a1aa" strokeWidth="2" />
        <line x1="51" y1="766" x2="55" y2="770" stroke="#a1a1aa" strokeWidth="2" />
        <text x="80" y="765" fill="#a1a1aa" fontSize="14" textAnchor="middle" fontFamily="system-ui, sans-serif">-</text>
        <text x="110" y="764" fill="#ffffff" fontSize="12" textAnchor="middle" fontFamily="system-ui, sans-serif">100%</text>
        <text x="140" y="765" fill="#ffffff" fontSize="16" textAnchor="middle" fontFamily="system-ui, sans-serif">+</text>
        
        {/* Export Buttons */}
        <rect x="520" y="740" width="100" height="40" rx="8" fill="#10b981" />
        <text x="540" y="765" fill="#ffffff" fontSize="15" fontWeight="bold" fontFamily="Georgia, serif">W</text>
        <text x="575" y="765" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">DOCX</text>
        
        <rect x="630" y="740" width="130" height="40" rx="8" fill="none" stroke="#a1a1aa" strokeWidth="1" />
        <path d="M 645 765 L 645 755 L 655 755 L 655 765 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <polyline points="647,750 650,755 653,750" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <text x="696" y="765" fill="#ffffff" fontSize="14" fontWeight="500" textAnchor="middle" fontFamily="system-ui, sans-serif">Exportar PDF</text>
      </g>
    </svg>
  );
}
