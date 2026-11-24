export interface SubmoduloConfig {
  key: string;
  label: string;
  icon: string;
  route: string;
}

export function getDataHoje(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}
