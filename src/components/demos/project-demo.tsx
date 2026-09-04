import { KernexInterface, MercerInterface, CynosureInterface, MedFormerInterface, CiraxInterface } from "./interfaces";

const INTERFACES: Record<string, () => React.JSX.Element> = {
  kernex: KernexInterface,
  mercer: MercerInterface,
  cynosure: CynosureInterface,
  medformer: MedFormerInterface,
  cirax: CiraxInterface,
};

export default function ProjectDemo({ slug }: { slug: string }) {
  const Interface = INTERFACES[slug];
  if (!Interface) return null;
  return <Interface />;
}
