import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  FileText,
  Lightbulb,
  Mail,
  Menu,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
  X,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroBg from "@/assets/hero-bg.png";
import strategyScene from "@/assets/strategy-scene.png";
import gustavoPiedade from "@/assets/gustavo-piedade.jpg";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "gclid", "fbclid"] as const;
type Attribution = Partial<Record<(typeof attributionKeys)[number], string>>;
const attributionStorageKey = "42move_attribution";

const getStoredAttribution = (): Attribution => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(attributionStorageKey);
    return stored ? JSON.parse(stored) as Attribution : {};
  } catch {
    return {};
  }
};

const getAttribution = (): Attribution => {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  const current = attributionKeys.reduce<Attribution>((result, key) => {
    const value = query.get(key);
    if (value) result[key] = value;
    return result;
  }, {});
  const stored = getStoredAttribution();
  const attribution = { ...stored, ...current };
  if (Object.keys(current).length > 0) {
    try {
      window.localStorage.setItem(attributionStorageKey, JSON.stringify(attribution));
    } catch {
      // Attribution should never prevent a contact from reaching the business.
    }
  }
  return attribution;
};

const googleAnalyticsId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const googleAdsConversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL as string | undefined;

const initGoogleTags = () => {
  if (typeof window === "undefined" || (!googleAnalyticsId && !googleAdsId) || window.gtag) return;
  const tagId = googleAnalyticsId ?? googleAdsId;
  if (!tagId) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  if (googleAnalyticsId) window.gtag("config", googleAnalyticsId, { send_page_view: false });
  if (googleAdsId) window.gtag("config", googleAdsId, { send_page_view: false });
};

const trackEvent = (event: string, params?: Record<string, unknown>) => {
  const eventParams = { ...getAttribution(), ...(params ?? {}) };
  if (typeof window !== "undefined") {
    if (event !== "page_view") {
      const metaEvent = event === "generate_lead" ? "Lead" : event === "schedule" ? "Schedule" : event;
      const isMetaStandardEvent = metaEvent === "Lead" || metaEvent === "Schedule";
      window.fbq?.(isMetaStandardEvent ? "track" : "trackCustom", metaEvent, eventParams);
    }
    window.gtag?.("event", event, eventParams);
    if (event === "schedule" && googleAdsId && googleAdsConversionLabel) {
      window.gtag?.("event", "conversion", {
        send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
        ...eventParams,
      });
    }
  }
};

const buildWhatsAppUrl = (entryPoint: string) => {
  const attribution = getAttribution();
  const source = Object.entries(attribution)
    .filter(([key]) => key.startsWith("utm_"))
    .map(([key, value]) => `${key.replace("utm_", "")}: ${value}`)
    .join(" · ");
  const sourceLine = source ? `\nCampanha: ${source}` : "";
  const text = `Olá, Gustavo! Quero mudar meu cenário operacional. Podemos conversar?\nVim pelo site 42Move (${entryPoint}).${sourceLine}`;
  return `https://wa.me/5511969123806?text=${encodeURIComponent(text)}`;
};

const buildCalendlyUrl = () => {
  const params = new URLSearchParams({
    embed_type: "Inline",
    hide_landing_page_details: "1",
    hide_gdpr_banner: "1",
    background_color: "1C2128",
    text_color: "ffffff",
    primary_color: "00FF68",
  });
  const attribution = getAttribution();
  Object.entries(attribution).forEach(([key, value]) => params.set(key, value));
  return `https://calendly.com/rentacoo/30min?${params.toString()}`;
};

const navItems = [
  ["problema", "O gargalo"],
  ["solucao", "A solução"],
  ["projetos", "Sob medida"],
  ["pilares", "Escopo"],
  ["como-funciona", "Método"],
  ["precos", "Modelos"],
  ["sobre", "Gustavo"],
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const Logo = ({ dark = false }: { dark?: boolean }) => (
  <div className="flex items-center gap-2.5" data-testid="brand-logo">
    <div className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg ${dark ? "bg-[#09251d]" : "bg-[#00ff68]/10"}`}>
      <div className="absolute inset-[-50%] rotate-45 bg-[#00ff68]/20" />
      <span className="relative z-10 font-mono text-base font-bold text-[#00ff68]">42</span>
    </div>
    <span className={`text-xl font-bold tracking-[-0.04em] ${dark ? "text-[#09251d]" : "text-[#eef7f1]"}`}>Move</span>
  </div>
);

const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeading = ({
  kicker,
  title,
  body,
  light = false,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  body?: string;
  light?: boolean;
  align?: "left" | "center";
}) => (
  <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
    <div className={`section-kicker ${light ? "text-[#0a71bd]" : "text-[#00ff68]"}`}>
      <span className="eyebrow-line" />
      {kicker}
    </div>
    <h2 className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-5xl ${light ? "text-[#09251d]" : "text-[#eef7f1]"}`}>
      {title}
    </h2>
    {body && <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""} ${light ? "text-[#31524b]" : "text-[#9bb3aa]"}`}>{body}</p>}
  </div>
);

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-[#b8d0c7]/10 bg-[#08161a]/90 py-3 backdrop-blur-xl" : "py-5"}`} aria-label="Navegação principal">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Voltar ao início" data-testid="button-home">
          <Logo />
        </button>
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-[13px] font-medium text-[#a7bcb3] transition-colors hover:text-[#00ff68]" data-testid={`button-nav-${id}`}>
              {label}
            </button>
          ))}
          <Button onClick={() => scrollTo("agendar")} className="h-10 rounded-lg bg-[#00ff68] px-5 font-bold text-[#09251d] hover:bg-[#adffc8]" data-testid="button-nav-cta">
            Agendar conversa <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <button className="rounded-md p-2 text-[#d5e4dc] lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} data-testid="button-mobile-menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-[#b8d0c7]/10 bg-[#08161a] px-5 py-5 shadow-2xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => { setOpen(false); scrollTo(id); }} className="border-b border-[#b8d0c7]/10 py-3 text-left text-base text-[#d5e4dc]" data-testid={`button-mobile-${id}`}>{label}</button>
            ))}
            <Button onClick={() => { setOpen(false); scrollTo("agendar"); }} className="mt-4 h-12 bg-[#00ff68] font-bold text-[#09251d]" data-testid="button-mobile-cta">Agendar conversa</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

const pillars = [
  { icon: BarChart3, number: "01", title: "Operações", color: "#00ff68", items: ["Diagnóstico operacional", "Processos e estratégias", "KPIs e acompanhamento contínuo"] },
  { icon: DollarSign, number: "02", title: "Finanças", color: "#3aa8ff", items: ["Gestão financeira", "Revisão base zero", "Modelagem e Business Plan"] },
  { icon: UserCheck, number: "03", title: "Gestão de pessoas", color: "#a9d8bd", items: ["Cultura e pessoas", "Organograma", "Desenvolvimento de equipe", "Recrutamento"] },
  { icon: Lightbulb, number: "04", title: "Produto", color: "#d1f3a8", items: ["Análise de concorrência", "Pesquisa e validação de mercado", "Roadmap e priorização de produto"] },
  { icon: Rocket, number: "05", title: "Fornecedores", color: "#ff9a55", items: ["Gestão de fornecedores estratégicos", "Seleção de ferramentas", "Negociação e controle de custos"] },
  { icon: Sparkles, number: "06", title: "Inteligência Artificial", color: "#c6a4ff", items: ["IA aplicada ao gargalo certo", "Copilotos e automações sob medida", "Dados preparados para decisão", "Supervisão humana onde importa"] },
];

const methodSteps = [
  { step: "01", title: "Diagnóstico rápido", desc: "Em duas semanas, mapeamos onde o dinheiro, o tempo e a energia estão vazando. Saímos com um plano de ataque realista.", icon: Target },
  { step: "02", title: "Ataque ao caos", desc: "Priorizamos o que dói mais. Implementamos processos, ajustamos ferramentas e alinhamos o time para estancar a sangria.", icon: Zap },
  { step: "03", title: "Ritmo e crescimento", desc: "Instalamos rituais de gestão, KPIs claros e uma cadência de acompanhamento. A máquina passa a rodar com menos dependência.", icon: TrendingUp },
] as const;

const faqItems = [
  ["Qual a diferença entre um Sócio de Operações e um consultor?", "Consultores apontam o problema e entregam um plano. Nós executamos o plano com você. Participamos das suas reuniões semanais, fazemos 1:1s com sua equipe, revisamos o funil de vendas, sentamos com o time de RH e acompanhamos a evolução de indicadores semana a semana. Somos parte da operação — não observadores externos."],
  ["O que acontece na prática no dia a dia?", "Depende do momento da empresa, mas é comum: reuniões semanais de alinhamento com os donos, revisão de KPIs e prioridades, acompanhamento do funil de vendas e canais de aquisição, 1:1s com líderes de equipe, revisão de Business Plan e modelagem financeira quando necessário, e suporte tático nas decisões do dia a dia via WhatsApp ou Slack."],
  ["Por que não contratar um COO em tempo integral (CLT)?", "Um COO sênior custa de R$ 20k a R$ 50k mensais mais encargos — antes de qualquer resultado. Com um Sócio de Operações, você acessa essa mesma inteligência estratégica por uma fração do custo, pagando apenas pelo tempo e impacto que seu momento exige. E sem o risco de uma contratação sênior que não dá certo."],
  ["Minha empresa é muito pequena para isso?", "Se você já tem produto e clientes, mas sente que a empresa está crescendo de forma caótica — processos quebrados, equipe sem clareza, decisões financeiras no escuro — esse é o momento certo. Não espere o prédio estar caindo para construir a fundação."],
  ["Qual o tempo mínimo de engajamento?", "Sugerimos pelo menos 3 meses para ver impacto real em cultura e processos. A cadência mínima é quinzenal — mas a maioria dos nossos clientes acaba optando por mais frequência conforme o trabalho avança. Nossos engajamentos costumam durar mais de 9 meses porque o resultado gera renovação, não porque existe multa contratual. Você fica pelo resultado."],
];

export default function Home() {
  useEffect(() => {
    initGoogleTags();
    trackEvent("page_view", { page_title: document.title });
    const anchorFrame = window.requestAnimationFrame(() => {
      const anchor = window.location.hash.slice(1);
      if (anchor) document.getElementById(anchor)?.scrollIntoView();
    });
    const onCalendly = (event: MessageEvent) => {
      if (event.origin === "https://calendly.com" && event.data?.event === "calendly.event_scheduled") {
        trackEvent("schedule", { content_name: "Calendly 30min", lead_source: "calendly" });
      }
    };
    window.addEventListener("message", onCalendly);
    return () => {
      window.cancelAnimationFrame(anchorFrame);
      window.removeEventListener("message", onCalendly);
    };
  }, []);

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#08161a] text-[#eef7f1]">
      <Navbar />

      <section className="noise command-grid relative min-h-[760px] overflow-hidden bg-[#08161a] pt-32 md:min-h-[820px] md:pt-40">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover object-center opacity-35 mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#08161a_0%,#08161a_e8_35%,#08161a_45%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#08161a_2%,transparent_35%,#08161a_80%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }} className="section-kicker text-[#00ff68]">
              <span className="h-2 w-2 rounded-full bg-[#00ff68] shadow-[0_0_0_5px_#00ff681c]" />
              Sócio de operações para PMEs em crescimento
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .08 }} className="mt-7 text-[clamp(3.2rem,8vw,7.5rem)] font-semibold leading-[.92] tracking-[-0.075em]">
              Crescer não deveria<br /><span className="text-[#00ff68]">quebrar a operação.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .18 }} className="mt-8 max-w-xl text-lg leading-relaxed text-[#b4c9bf] md:text-xl">
              Um braço direito estratégico e operacional para transformar decisões espalhadas em ritmo, clareza e execução — sem contratar um C-level em tempo integral.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .28 }} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => { scrollTo("agendar"); trackEvent("contact_click", { content_name: "Hero CTA", lead_source: "site" }); }} className="h-14 rounded-lg bg-[#00ff68] px-7 text-base font-bold text-[#09251d] shadow-[0_12px_35px_#00ff6826] hover:bg-[#b0ffcb]" data-testid="button-hero-contact">
                Agendar conversa gratuita <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("problema")} className="h-14 rounded-lg border-[#a8c8bc]/25 bg-[#08161a]/25 px-7 text-base text-[#d8e7df] hover:bg-[#d8e7df]/10 hover:text-[#eef7f1]" data-testid="button-hero-learn">
                Ver onde atuamos
              </Button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: .42 }} className="mt-4 text-xs text-[#89a69a]">
              30 minutos · sem compromisso · conversa direta com Gustavo
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .45 }} className="mt-20 grid max-w-2xl grid-cols-3 border-t border-[#a8c8bc]/20 pt-5">
            {[["01", "clareza para decidir"], ["02", "ritmo para executar"], ["03", "estrutura para escalar"]].map(([n, t]) => (
              <div key={n} className="pr-3"><span className="font-mono text-xs text-[#00ff68]">{n}</span><p className="mt-2 text-xs leading-snug text-[#9eb6aa] md:text-sm">{t}</p></div>
            ))}
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-64 w-1/3 border-l border-t border-[#00ff68]/25 bg-[#00ff68]/[.03] lg:block">
          <div className="p-6 font-mono text-[10px] uppercase tracking-[.2em] text-[#00ff68]/70">sistema operacional / em movimento</div>
          <div className="absolute bottom-8 left-8 right-8 h-px bg-[#00ff68]/30" />
          <div className="absolute bottom-8 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#00ff68]" />
        </div>
      </section>

      <section id="problema" className="relative bg-[#e2eee9] py-24 text-[#09251d] md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <FadeIn><SectionHeading light kicker="O gargalo invisível" title={<>A empresa cresce.<br /><span className="text-[#0a71bd]">Você encolhe.</span></>} body="A operação se apoia demais no dono, as decisões perdem velocidade e o time corre sem uma direção comum." /></FadeIn>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#09251d]/10 bg-[#09251d]/10 sm:grid-cols-2">
              {[
                ["Você virou o gargalo", "Nenhuma decisão avança sem você. O seu dia é consumido por aprovações e microgestão."],
                ["A equipe perdeu o norte", "Todo mundo trabalha muito, mas as prioridades mudam antes de virar resultado."],
                ["A margem não acompanha", "Retrabalho, ferramentas duplicadas e prazos estourados drenam o ganho do crescimento."],
                ["O negócio depende da sua cabeça", "Processos não documentados fazem cada nova contratação reiniciar a operação do zero."],
              ].map(([title, desc], i) => (
                <FadeIn delay={i * .08} key={title}>
                  <article className="h-full bg-[#e2eee9] p-7 transition-colors hover:bg-[#d6e8e0] md:p-8" data-testid={`card-problem-${i}`}>
                    <div className="mb-8 flex items-center justify-between"><span className="font-mono text-xs text-[#0a71bd]">0{i + 1}</span><X className="h-5 w-5 text-[#749087]" /></div>
                    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#49675d]">{desc}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="solucao" className="relative overflow-hidden bg-[#09251d] py-24 md:py-32">
        <div className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-[#087fca]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <FadeIn>
            <div className="section-kicker text-[#3aa8ff]"><span className="eyebrow-line" />A solução</div>
            <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-.055em] text-[#eef7f1] md:text-6xl">Não entregamos<br /><span className="text-[#00ff68]">slides.</span></h2>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#b2c9be]">Entramos na trincheira com você. Diagnosticamos o caos, desenhamos a saída e lideramos a implementação até a operação ganhar autonomia.</p>
            <div className="mt-9 space-y-4">
              {["Alinhamento estratégico com os donos", "Mapeamento e otimização de processos core", "Gestão de OKRs e KPIs da equipe", "Seleção e implementação de ferramentas"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-[#d4e4da]"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00ff68]" />{item}</div>)}
            </div>
            <button onClick={() => scrollTo("como-funciona")} className="mt-10 inline-flex items-center gap-2 border-b border-[#00ff68] pb-1 text-sm font-bold text-[#00ff68] transition-colors hover:text-[#c1ffd5]" data-testid="button-solution-method">Conheça o método <ArrowRight className="h-4 w-4" /></button>
          </FadeIn>
          <FadeIn delay={.15} className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-[#00ff68]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-[#a8c8bc]/20 bg-[#102c32]">
              <img src={strategyScene} alt="Mesa de estratégia com indicadores e planejamento" className="aspect-[4/3] w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09251d] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-[#00ff68]">visão de execução</div><div className="mt-1 text-sm text-[#e1eee7]">Da decisão ao próximo passo.</div></div>
                <Workflow className="h-8 w-8 text-[#00ff68]" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="projetos" className="relative overflow-hidden bg-[#d6e8e0] py-24 text-[#09251d] md:py-32">
        <div className="command-grid absolute inset-0 opacity-[.16]" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#0a71bd]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  light
                  kicker="Case real · Finance Co-pilot"
                  title={<>Onde a operação encontra a <span className="text-[#0a71bd]">tecnologia.</span></>}
                  body="Processos eficientes às vezes precisam de ferramentas próprias. Veja como resolvemos o caos do contas a pagar com um sistema construído sob medida: rigoroso para a área financeira, pragmático para a equipe."
                />
                <p className="mt-6 max-w-xl leading-relaxed text-[#49675d]">
                  O Finance Co-pilot centraliza entradas, usa inteligência artificial para extrair informações e apoiar a validação, mantendo a decisão final com a equipe. Tecnologia para ampliar o julgamento humano — não para substituí-lo.
                </p>
                <div role="list" aria-label="Resultados observados no Finance Co-pilot" className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                  <div role="listitem" className="rounded-xl border border-[#0a71bd]/20 bg-[#eef7f1]/60 p-4 shadow-[0_8px_24px_rgba(9,37,29,0.05)]">
                    <div className="font-mono text-3xl font-bold tracking-[-.06em] text-[#0a71bd]">90%</div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-[#274d40]">de <strong>economia</strong> no tempo gasto com conferência manual</p>
                  </div>
                  <div role="listitem" className="rounded-xl border border-[#00a94f]/25 bg-[#eef7f1]/60 p-4 shadow-[0_8px_24px_rgba(9,37,29,0.05)]">
                    <div className="font-mono text-3xl font-bold tracking-[-.06em] text-[#008f45]">D+1</div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-[#274d40]">DRE pronta no <strong>primeiro dia</strong> após o fechamento do mês</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    scrollTo("agendar");
                    trackEvent("contact_click", { content_name: "Projetos sob medida CTA", lead_source: "site" });
                  }}
                  className="mt-9 h-12 rounded-lg bg-[#09251d] px-6 font-bold text-[#eef7f1] shadow-[0_4px_14px_rgba(9,37,29,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#123c31]"
                  data-testid="button-custom-project-contact"
                >
                  Conversar sobre meu cenário <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-5 max-w-md border-l-2 border-[#0a71bd]/30 pl-4 text-sm leading-relaxed text-[#49675d]">
                  Este é um exemplo. O projeto sempre começa pelo gargalo; a tecnologia entra quando melhora a operação.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col overflow-hidden rounded-2xl border border-[#0a71bd]/20 bg-[#09251d] text-[#eef7f1] shadow-2xl">
                {/* System Header */}
                <div className="flex items-center justify-between border-b border-[#0a71bd]/20 bg-[#061813] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#819d92]">Finance Co-Pilot / Pipeline</span>
                  </div>
                  <div className="rounded-md border border-[#00ff68]/20 bg-[#00ff68]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#00ff68]">
                    Revisão humana
                  </div>
                </div>

                {/* Pipeline steps */}
                <div className="relative flex flex-col p-6 sm:p-8">
                  <div className="absolute bottom-[60px] left-[43px] top-[50px] w-px bg-gradient-to-b from-[#00ff68] via-[#3aa8ff] to-[#a9d8bd] opacity-30 sm:left-[51px]" />

                  {/* Step 1 */}
                  <div className="relative flex gap-5 pb-10 sm:gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00ff68]/30 bg-[#061813] shadow-[0_0_15px_rgba(0,255,104,0.15)]">
                      <Mail className="h-4 w-4 text-[#00ff68]" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-base font-semibold text-[#eef7f1]">Captura unificada</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#b2c9be]">
                        Despesas entram por e-mail, upload de PDF, formulário, lançamento manual ou conectores fiscais suportados — reunidas em um único fluxo de trabalho.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["E-mail", "PDF", "Formulário", "Fiscal", "Manual"].map((label) => (
                          <div key={label} className="flex items-center gap-1.5 rounded-md border border-[#00ff68]/20 bg-[#00ff68]/5 px-2.5 py-1 text-xs font-mono text-[#00ff68]/90">
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex gap-5 pb-10 sm:gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3aa8ff]/30 bg-[#061813] shadow-[0_0_15px_rgba(58,168,255,0.15)]">
                      <Zap className="h-4 w-4 text-[#3aa8ff]" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-base font-semibold text-[#eef7f1]">Extração por IA & validação</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#b2c9be]">
                        A IA extrai campos-chave e sinaliza o nível de confiança. O fluxo também destaca registros com sinais de duplicidade e variações de valor que merecem revisão.
                      </p>
                      <div className="mt-5 overflow-hidden rounded-xl border border-[#3aa8ff]/20 bg-[#061813] font-mono text-[11px] shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3aa8ff]/10 bg-[#0a231d] px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-[#819d92]" />
                            <span className="text-[#819d92]">documento_052.pdf</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full border border-[#00ff68]/20 bg-[#00ff68]/10 px-2 py-0.5 text-[#00ff68]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Confiança: Alta</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 text-[#b2c9be]">
                            <div>
                              <div className="mb-1 text-[9px] uppercase tracking-wider text-[#66857a]">Fornecedor</div>
                                <div className="text-sm text-[#eef7f1]">Fornecedor de tecnologia</div>
                            </div>
                            <div>
                              <div className="mb-1 text-[9px] uppercase tracking-wider text-[#66857a]">Valor total</div>
                              <div className="text-sm text-[#eef7f1]">R$ 4.520,00</div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#ffbd2e]/20 bg-[#ffbd2e]/10 px-3 py-2.5 text-[#ffbd2e]">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <div className="leading-relaxed">
                              <strong>Atenção ao valor:</strong> registro sinalizado para revisão.
                            </div>
                          </div>
                          <div className="mt-2 text-[9px] uppercase tracking-wider text-[#66857a]">Demonstração com dados ilustrativos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex gap-5 pb-10 sm:gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff9a55]/30 bg-[#061813] shadow-[0_0_15px_rgba(255,154,85,0.15)]">
                      <UserCheck className="h-4 w-4 text-[#ff9a55]" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-base font-semibold text-[#eef7f1]">Revisão humana focada</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#b2c9be]">
                        A IA prepara o registro e destaca os sinais que merecem atenção. A equipe investiga os alertas e confirma as informações antes da exportação.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg border border-[#00ff68]/30 bg-[#00ff68]/20 px-3 py-1.5 text-xs font-medium text-[#00ff68]">
                          <Check className="h-3.5 w-3.5" /> Confirmar registro
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-[#b2c9be]/30 bg-transparent px-3 py-1.5 text-xs font-medium text-[#b2c9be]">
                          <Clock className="h-3.5 w-3.5" /> Investigar alerta
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex gap-5 sm:gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#a9d8bd]/30 bg-[#061813] shadow-[0_0_15px_rgba(169,216,189,0.15)]">
                      <Workflow className="h-4 w-4 text-[#a9d8bd]" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-base font-semibold text-[#eef7f1]">Exportação estruturada</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#b2c9be]">
                        Filtros por período geram dados estruturados em CSV com os PDFs de origem disponíveis, preparando o material para a contabilidade.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <div className="flex cursor-default items-center gap-2 rounded-lg border border-[#a9d8bd]/30 bg-[#a9d8bd]/10 px-4 py-2 text-sm font-medium text-[#a9d8bd] transition-colors hover:bg-[#a9d8bd]/20">
                          <Download className="h-4 w-4" />
                          CSV Estruturado
                        </div>
                        <div className="flex cursor-default items-center gap-2 rounded-lg border border-[#b2c9be]/20 bg-[#061813] px-4 py-2 text-sm font-medium text-[#b2c9be] transition-colors hover:bg-[#b2c9be]/10">
                          <FileText className="h-4 w-4" />
                          PDFs de origem
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="pilares" className="bg-[#0d2024] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="mb-16 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><SectionHeading kicker="O escopo" title={<>Uma visão de dono.<br /><span className="text-[#00ff68]">Seis frentes de impacto.</span></>} /><p className="max-w-lg text-lg leading-relaxed text-[#9eb6aa]">A operação não é uma ilha. Organizamos as peças que sustentam a próxima fase — com uma única cadência e prioridade clara.</p></FadeIn>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => { const Icon = pillar.icon; return <FadeIn key={pillar.number} delay={i * .06}><article className="group relative h-full rounded-xl border border-[#b8d0c7]/10 bg-[#10282b] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00ff68]/40" data-testid={`card-pillar-${pillar.number}`}>
              <div className="mb-12 flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ backgroundColor: `${pillar.color}18`, border: `1px solid ${pillar.color}35` }}><Icon className="h-5 w-5" style={{ color: pillar.color }} /></div><span className="font-mono text-xs text-[#7c9990]">{pillar.number}</span></div>
              <h3 className="text-xl font-semibold text-[#e5f1ea]">{pillar.title}</h3><ul className="mt-5 space-y-3">{pillar.items.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#9eb6aa]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: pillar.color }} />{item}</li>)}</ul>
            </article></FadeIn>; })}
          </div>
          <FadeIn className="mt-8 grid gap-px overflow-hidden rounded-xl border border-[#b8d0c7]/10 bg-[#b8d0c7]/10 md:grid-cols-3">
            {[["+9 meses", "duração média dos engajamentos"], ["Quinzenal", "cadência mínima de acompanhamento"], ["6 áreas", "de impacto cobertas em paralelo"]].map(([value, label]) => <div key={value} className="bg-[#10282b] p-6 text-center"><div className="text-2xl font-semibold text-[#00ff68]">{value}</div><div className="mt-1 text-xs text-[#819d92]">{label}</div></div>)}
          </FadeIn>
        </div>
      </section>

      <section id="como-funciona" className="bg-[#e2eee9] py-24 text-[#09251d] md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="max-w-2xl"><SectionHeading light kicker="O método" title={<>Primeiro colocamos<br />o chão no lugar.</>} body="Um processo direto, com entregas visíveis desde a primeira quinzena. Sem cerimônia. Sem diagnóstico que fica na gaveta." /></FadeIn>
          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {methodSteps.map(({ step, title, desc, icon: StepIcon }, i) => <FadeIn key={step} delay={i * .12}><article className={`relative h-full border-t-2 ${i === 1 ? "border-[#0a71bd]" : "border-[#09251d]/20"} pt-6`}><div className="flex items-center justify-between"><span className="font-mono text-xs text-[#0a71bd]">{step}</span><StepIcon className="h-5 w-5 text-[#0a71bd]" /></div><h3 className="mt-16 text-2xl font-semibold tracking-tight">{title}</h3><p className="mt-4 leading-relaxed text-[#49675d]">{desc}</p></article></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-[#0d2024] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeading kicker="O que muda" title={<>O dono recupera<br /><span className="text-[#00ff68]">espaço para pensar.</span></>} /><p className="max-w-sm text-sm leading-relaxed text-[#9eb6aa]">Resultados tangíveis para sair do modo reativo e voltar a construir o futuro do negócio.</p></FadeIn>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[["Tempo de volta", "Você deixa de ser a central de aprovações e volta a atuar no que só o dono pode fazer.", Clock], ["Visibilidade real", "KPIs definidos e indicadores que mostram a saúde do negócio, não apenas a intuição.", BarChart3], ["Estrutura que escala", "A empresa para de depender apenas da sua cabeça: processos, papéis e planos documentados.", Shield], ["Decisão com lastro", "Modelagem financeira e Business Plan para crescer apoiado em dados, não em chutes.", DollarSign]].map(([title, desc, Icon]) => { const BenefitIcon = Icon as typeof Clock; return <article key={title as string} className="rounded-xl border border-[#b8d0c7]/10 bg-[#10282b] p-6"><BenefitIcon className="h-7 w-7 text-[#3aa8ff]" /><h3 className="mt-9 text-lg font-semibold text-[#e5f1ea]">{title as string}</h3><p className="mt-3 text-sm leading-relaxed text-[#9eb6aa]">{desc as string}</p></article>; })}
          </div>
        </div>
      </section>

      <section className="bg-[#e2eee9] py-24 text-[#09251d] md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 md:grid-cols-2 md:gap-24">
          <FadeIn><div className="flex items-center gap-3 text-[#0a71bd]"><Check className="h-7 w-7" /><h2 className="text-3xl font-semibold tracking-tight">Para quem é</h2></div><ul className="mt-8 space-y-5">{["Donos de PMEs que faturam acima de R$ 100k/mês.", "Empresas com product-market fit comprovado, mas operação quebrando sob o peso do crescimento.", "CEOs exaustos de apagar incêndios e microgerenciar."].map((item) => <li key={item} className="flex gap-3 leading-relaxed text-[#31524b]"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#00a94f]" />{item}</li>)}</ul></FadeIn>
           <FadeIn delay={.15}><div className="flex items-center gap-3 text-[#c25b3f]"><X className="h-7 w-7" /><h2 className="text-3xl font-semibold tracking-tight">Para quem não é</h2></div><ul className="mt-8 space-y-5">{["Startups em fase de ideação sem faturamento.", "Donos que querem apenas conselhos, sem mudar a forma de trabalhar.", "Empresas buscando uma solução mágica sem esforço interno."].map((item) => <li key={item} className="flex gap-3 leading-relaxed text-[#31524b]"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#c25b3f]" />{item}</li>)}</ul></FadeIn>
        </div>
      </section>

      <section id="precos" className="bg-[#09251d] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="mb-14"><SectionHeading kicker="Modelos de contratação" title={<>A fase muda.<br /><span className="text-[#00ff68]">O apoio também.</span></>} body="Comece pelo problema mais urgente e aumente o escopo conforme o impacto aparece. Sem contratos impossíveis." /></FadeIn>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["Sprint de Diagnóstico", "Para quem sabe que tem um problema, mas não sabe por onde começar.", "Projeto fixo", ["Mapeamento de processos críticos", "Auditoria de ferramentas", "Plano de ação priorizado", "Entregue em 2 semanas"], "Agendar Sprint", false],
              ["Sócio de Operações", "O braço direito para manter a máquina rodando e melhorar continuamente.", "Mensalidade fixa", ["Acompanhamento quinzenal mínimo", "Gestão de OKRs e KPIs", "Otimização contínua", "Acesso direto via WhatsApp"], "Garantir vaga", true],
              ["Transformação Total", "Para empresas que precisam de uma reestruturação operacional profunda.", "Sob medida", ["Imersão na empresa", "Redesenho core", "Treinamento de lideranças", "Implementação de sistemas"], "Falar com especialista", false],
             ].map(([name, desc, price, features, cta, highlight], i) => <FadeIn key={name as string} delay={i * .08} className={`relative flex flex-col rounded-2xl border p-7 ${highlight ? "border-[#00ff68] bg-[#102c2b] shadow-[0_20px_60px_#00ff6812]" : "border-[#b8d0c7]/15 bg-[#0d2024]"}`}><>{highlight && <div className="absolute -top-3 left-6 rounded-full bg-[#00ff68] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#09251d]">Mais escolhido</div>}<h3 className="mt-1 text-2xl font-semibold text-[#eef7f1]">{name as string}</h3><p className="mt-3 min-h-14 text-sm leading-relaxed text-[#9eb6aa]">{desc as string}</p><div className="mt-6 border-y border-[#b8d0c7]/10 py-4 font-mono text-xs uppercase tracking-[.15em] text-[#00ff68]">{price as string}</div><ul className="my-7 flex-1 space-y-4">{(features as string[]).map((feature) => <li key={feature} className="flex gap-3 text-sm text-[#d2e2d9]"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#00ff68]" />{feature}</li>)}</ul><Button onClick={() => { scrollTo("agendar"); trackEvent("contact_click", { content_name: `Modelo: ${name as string}`, lead_source: "site" }); }} className={`h-12 font-bold ${highlight ? "bg-[#00ff68] text-[#09251d] hover:bg-[#b0ffcb]" : "bg-[#d9e9e1]/10 text-[#e5f1ea] hover:bg-[#d9e9e1]/20"}`} data-testid={`button-plan-${i}`}>{cta as string}<ArrowRight className="ml-2 h-4 w-4" /></Button></></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="bg-[#0d2024] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <FadeIn className="mb-12 text-center"><SectionHeading align="center" kicker="A diferença" title={<>Mais presença do que um consultor.<br />Mais flexibilidade que um COO.</>} body="Um modelo feito para colocar inteligência e execução na mesma sala." /></FadeIn>
          <FadeIn><div className="overflow-hidden rounded-xl border border-[#b8d0c7]/15"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#10282b]"><tr className="border-b border-[#b8d0c7]/15"><th className="p-5 font-medium text-[#819d92]">Critério</th><th className="border-x border-[#00ff68]/25 bg-[#00ff68]/5 p-5 text-center font-semibold text-[#00ff68]">Sócio de Operações</th><th className="p-5 text-center font-semibold text-[#b5c9bf]">COO CLT</th><th className="p-5 text-center font-semibold text-[#b5c9bf]">Consultor</th></tr></thead><tbody>{[["Custo mensal", "Acessível", "R$20k–50k + encargos", "Alto por hora"], ["Velocidade de início", "Dias", "2–4 meses para contratar", "Semanas"], ["Execução real", "Bota a mão na massa", "Depende do perfil", "Só recomenda"], ["Visão estratégica", "Sim", "Sim", "Sim"], ["Risco de contratação", "Nenhum", "Alto", "Médio"], ["Múltiplas áreas", "5 pilares simultâneos", "Parcial", "Especialidade única"], ["Flexibilidade", "Escala conforme a fase", "Fixo", "Parcial"]].map((row) => <tr key={row[0]} className="border-t border-[#b8d0c7]/10"><td className="p-5 text-[#9eb6aa]">{row[0]}</td><td className="border-x border-[#00ff68]/15 bg-[#00ff68]/[.035] p-5 text-center font-medium text-[#00ff68]">{row[1]}</td><td className="p-5 text-center text-[#819d92]">{row[2]}</td><td className="p-5 text-center text-[#819d92]">{row[3]}</td></tr>)}</tbody></table></div></FadeIn>
        </div>
      </section>

      <section className="bg-[#e2eee9] py-24 text-[#09251d] md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="mb-14 grid gap-5 md:grid-cols-[1fr_auto] md:items-end"><SectionHeading light kicker="Case real · Unica" title={<>De operação reativa<br /><span className="text-[#0a71bd]">a negócio previsível.</span></>} body="Nove meses de engajamento. Resultado que gerou renovação." /><div className="font-mono text-xs uppercase tracking-[.17em] text-[#0a71bd]">antes → implementação → depois</div></FadeIn>
          <div className="grid gap-4 lg:grid-cols-3">{[["Antes", "border-[#c25b3f]/30", "text-[#c25b3f]", ["Donos sobrecarregados com decisões operacionais", "Processos não documentados e prioridades difusas", "Receita crescendo sem estrutura para suportá-la", "Sem visibilidade financeira ou de indicadores"]], ["O que fizemos", "border-[#0a71bd]/30", "text-[#0a71bd]", ["Mapeamento e redesenho dos processos críticos", "Implementação de OKRs e rituais quinzenais", "Estruturação financeira e unit economics", "Suporte à gestão de pessoas e organização dos times"]], ["Depois", "border-[#00a94f]/40", "text-[#00883e]", ["Donos com tempo e clareza para inovar", "Equipe alinhada com metas e processos definidos", "Operação escalável e previsível", "Base estruturada para crescer com mais segurança"]]].map(([label, border, color, items], i) => <FadeIn key={label as string} delay={i * .1}><article className={`h-full rounded-xl border bg-[#eaf4ef] p-7 ${border}`}><div className={`font-mono text-xs uppercase tracking-[.18em] ${color}`}>{label as string}</div><ul className="mt-8 space-y-4">{(items as string[]).map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#49675d]"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${label === "Antes" ? "bg-[#c25b3f]" : label === "Depois" ? "bg-[#00a94f]" : "bg-[#0a71bd]"}`} />{item}</li>)}</ul></article></FadeIn>)}</div>
          <FadeIn className="mt-12 flex flex-wrap justify-center gap-10 border-t border-[#09251d]/15 pt-8 text-center">{[["9 meses", "de engajamento contínuo"], ["5 áreas", "trabalhadas em paralelo"], ["Renovação", "pelo resultado"]].map(([value, label]) => <div key={value}><div className="text-2xl font-semibold text-[#0a71bd]">{value}</div><div className="mt-1 text-xs text-[#49675d]">{label}</div></div>)}</FadeIn>
        </div>
      </section>

      <section className="bg-[#09251d] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn className="mb-14"><SectionHeading kicker="O que os donos dizem" title={<>Quando a operação encaixa,<br /><span className="text-[#00ff68]">o negócio respira.</span></>} /></FadeIn>
          <div className="grid gap-4 lg:grid-cols-3">{[
            ["A gente tinha produto, tinha cliente, mas a operação era um caos. A 42Move entrou, mapeou tudo e nos ajudou a montar uma estrutura que a gente nunca tinha tido. Hoje temos processos claros, equipe alinhada e conseguimos até pensar em captação com a cabeça no lugar.", "Gilmar", "Dono, Lawtech", "G"],
            ["O que me surpreendeu foi a profundidade. Não foi só processos — foi financeiro, gente, produto, tudo junto. Ter alguém com essa visão do negócio do lado, quinzenalmente, mudou completamente a forma como tomamos decisões.", "Angelo", "CEO, SaaS de Saúde", "A"],
            ["Estávamos crescendo rápido mas sangrando por dentro. Custo fora de controle, fornecedores bagunçados, equipe sem clareza. Com a 42Move organizamos tudo isso sem precisar contratar um time inteiro de gestão.", "Diego", "Sócio, E-commerce", "D"],
          ].map(([quote, author, role, avatar], i) => <FadeIn key={author} delay={i * .1}><article className="flex h-full flex-col rounded-xl border border-[#b8d0c7]/12 bg-[#102c2b] p-7"><div className="font-serif text-5xl leading-none text-[#3aa8ff]">“</div><p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#d2e2d9]">{quote}</p><div className="mt-8 flex items-center gap-3 border-t border-[#b8d0c7]/10 pt-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a71bd]/20 font-semibold text-[#3aa8ff]">{avatar}</div><div><div className="text-sm font-semibold text-[#e5f1ea]">{author}</div><div className="text-xs text-[#819d92]">{role}</div></div></div></article></FadeIn>)}</div>
        </div>
      </section>

      <section id="sobre" className="bg-[#0d2024] py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-[.8fr_1.2fr] md:gap-24 md:px-8">
          <FadeIn><div className="relative mx-auto max-w-sm"><div className="absolute -inset-3 rounded-2xl border border-[#00ff68]/25" /><img src={gustavoPiedade} alt="Gustavo Piedade" className="relative aspect-[3/4] w-full rounded-xl object-cover object-top grayscale-[15%]" /><a href="https://www.linkedin.com/in/gustavo-piedade/" target="_blank" rel="noopener noreferrer" className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-[#3aa8ff]/50 bg-[#09251d] px-4 py-2.5 text-xs font-medium text-[#3aa8ff] shadow-xl hover:bg-[#3aa8ff]/10" data-testid="link-gustavo-linkedin"><Users className="h-4 w-4" />Ver perfil no LinkedIn<ArrowUpRight className="h-3 w-3" /></a></div></FadeIn>
          <FadeIn delay={.12}><div className="section-kicker text-[#00ff68]"><span className="eyebrow-line" />Quem está do seu lado</div><h2 className="mt-5 text-4xl font-semibold leading-none tracking-[-.055em] text-[#eef7f1] md:text-6xl">Experiência para<br /><span className="text-[#00ff68]">fazer acontecer.</span></h2><div className="mt-8 space-y-5 text-[#9eb6aa]"><p className="text-xl font-medium leading-relaxed text-[#e1eee7]">Engenheiro de formação. Executivo por escolha. O tipo de pessoa que você quer do seu lado especialmente quando as coisas estão difíceis.</p><p className="leading-relaxed">Com passagens por grandes operações logísticas como <strong className="text-[#e5f1ea]">DHL</strong> e <strong className="text-[#e5f1ea]">JSL</strong>, e por startups de alto crescimento como <strong className="text-[#e5f1ea]">99</strong> e <strong className="text-[#e5f1ea]">Kovi</strong>, Gustavo combina rigor corporativo com velocidade de startup.</p><p className="leading-relaxed">Ele não aponta o problema e vai embora: senta na cadeira, bota a mão na massa e entrega. É o que chamam de <span className="font-medium text-[#00ff68]">criativo executador</span>.</p></div><div className="mt-8 grid grid-cols-2 gap-3">{[["Mundo corporativo", "DHL · JSL"], ["Alto crescimento", "99 · Kovi"], ["Engenheiro", "Mentalidade de sistema"], ["Perfil ISTJ", "Sistemático · Executor"]].map(([label, detail]) => <div key={label} className="rounded-lg border border-[#b8d0c7]/10 bg-[#10282b] p-4"><div className="text-xs font-semibold text-[#e5f1ea]">{label}</div><div className="mt-1 text-[11px] text-[#819d92]">{detail}</div></div>)}</div></FadeIn>
        </div>
      </section>

      <section className="bg-[#e2eee9] py-24 text-[#09251d] md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8"><FadeIn className="mb-12 text-center"><SectionHeading light align="center" kicker="Dúvidas honestas" title="Antes de conversar, algumas respostas." /></FadeIn><Accordion type="single" collapsible className="w-full">{faqItems.map(([question, answer], i) => <AccordionItem key={question} value={`faq-${i}`} className="border-[#09251d]/15"><AccordionTrigger className="py-6 text-left text-base font-semibold text-[#09251d] hover:text-[#0a71bd]">{question}</AccordionTrigger><AccordionContent className="pb-6 text-sm leading-relaxed text-[#49675d]">{answer}</AccordionContent></AccordionItem>)}</Accordion></div>
      </section>

      <section id="agendar" className="relative overflow-hidden bg-[#08161a] py-24 md:py-32">
        <div className="command-grid absolute inset-0 opacity-60" /><div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#00ff68]/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8"><FadeIn><div className="section-kicker justify-center text-[#00ff68]"><span className="eyebrow-line" />Próximo movimento</div><h2 className="mt-6 text-4xl font-semibold leading-[.95] tracking-[-.06em] text-[#eef7f1] md:text-7xl">Pare de operar<br /><span className="text-[#00ff68]">no improviso.</span></h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#a9c0b5]">Agende uma conversa gratuita de 30 minutos. Vamos entender o seu gargalo atual e traçar um plano rápido — sem compromisso.</p><div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#b8d0c7]/15 bg-[#10282b]/80 p-3 text-left shadow-2xl backdrop-blur-sm md:p-6"><div className="mb-5 flex items-center justify-between px-2"><div><div className="text-lg font-semibold text-[#e5f1ea]">Escolha um horário</div><div className="mt-1 text-xs text-[#819d92]">Conversa de 30 minutos com Gustavo</div></div><Clock className="h-5 w-5 text-[#00ff68]" /></div><div className="mb-5 grid gap-2 px-2 text-xs text-[#a9c0b5] sm:grid-cols-3"><div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00ff68]" />Sem compromisso</div><div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00ff68]" />Diagnóstico do gargalo</div><div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00ff68]" />Próximo passo claro</div></div><div className="overflow-hidden rounded-xl bg-[#08161a]"><iframe src={buildCalendlyUrl()} width="100%" height="600" frameBorder="0" title="Agendar conversa" className="rounded-xl" /></div><p className="mt-4 px-2 text-sm text-[#819d92]">Prefere pelo WhatsApp? <a href={buildWhatsAppUrl("Agendamento")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("generate_lead", { content_name: "WhatsApp CTA", lead_source: "whatsapp" })} className="font-medium text-[#00ff68] hover:underline" data-testid="link-whatsapp-calendly">Fale diretamente com a gente.</a></p></div></FadeIn></div>
      </section>

      <footer className="border-t border-[#b8d0c7]/10 bg-[#08161a] py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="grid gap-10 md:grid-cols-[1.4fr_.7fr_.7fr]"><div><Logo /><p className="mt-5 max-w-xs text-sm leading-relaxed text-[#819d92]">O braço direito operacional para donos de PMEs que querem escalar sem perder o controle.</p></div><div><h3 className="text-sm font-semibold text-[#e5f1ea]">Navegação</h3><div className="mt-4 flex flex-col items-start gap-2 text-sm text-[#819d92]">{navItems.slice(0, 4).map(([id, label]) => <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#00ff68]" data-testid={`button-footer-${id}`}>{label}</button>)}</div></div><div><h3 className="text-sm font-semibold text-[#e5f1ea]">Contato</h3><div className="mt-4 space-y-2 text-sm text-[#819d92]"><a href="mailto:gp@42move.com.br" onClick={() => trackEvent("contact_click", { content_name: "Email", lead_source: "email" })} className="flex items-center gap-2 hover:text-[#00ff68]" data-testid="link-email"><Mail className="h-4 w-4" />gp@42move.com.br</a><a href="https://www.linkedin.com/in/gustavo-piedade/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff68]" data-testid="link-footer-linkedin">LinkedIn</a></div></div></div><div className="mt-12 flex flex-col gap-3 border-t border-[#b8d0c7]/10 pt-6 text-xs text-[#607c71] md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} 42Move IA e Serviços. Todos os direitos reservados.</p><div className="flex gap-4"><a href="#" className="hover:text-[#d2e2d9]" data-testid="link-terms">Termos de Uso</a><a href="#" className="hover:text-[#d2e2d9]" data-testid="link-privacy">Privacidade</a></div></div></div>
      </footer>

      <a href={buildWhatsAppUrl("Botão flutuante")} target="_blank" rel="noopener noreferrer" title="Falar no WhatsApp" onClick={() => trackEvent("generate_lead", { content_name: "WhatsApp Flutuante", lead_source: "whatsapp" })} className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] p-4 text-[#09251d] shadow-[0_8px_30px_#25d36644] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff68]" data-testid="link-whatsapp-floating">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </main>
  );
}
