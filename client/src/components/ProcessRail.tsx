/** Caderno Técnico Solar: régua de processo que torna o estado do fluxo explicitamente observável. */
import { Check, FileInput, SearchCheck, Printer } from "lucide-react";

type ProcessRailProps = {
  hasFiles: boolean;
  hasSelection: boolean;
};

const steps = [
  { label: "Importar XML", detail: "Ler e consolidar", icon: FileInput },
  { label: "Conferir UC", detail: "Validar competências", icon: SearchCheck },
  { label: "Emitir relatório", detail: "PDF ou Word", icon: Printer },
];

export default function ProcessRail({ hasFiles, hasSelection }: ProcessRailProps) {
  const completed = [hasFiles, hasFiles && hasSelection, false];
  return (
    <aside className="process-rail" aria-label="Etapas do demonstrativo GD">
      <p className="rail-eyebrow">SEQUÊNCIA DE TRABALHO</p>
      <ol>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = (index === 0 && !hasFiles) || (index === 1 && hasFiles && !hasSelection) || (index === 2 && hasSelection);
          return (
            <li className={isCurrent ? "is-current" : completed[index] ? "is-complete" : ""} key={step.label}>
              <span className="rail-dot">{completed[index] ? <Check size={13} strokeWidth={3} /> : <Icon size={14} />}</span>
              <span><strong>{step.label}</strong><small>{step.detail}</small></span>
            </li>
          );
        })}
      </ol>
      <div className="rail-note">
        <span className="pulse-dot" />
        Processamento local no navegador
      </div>
    </aside>
  );
}
