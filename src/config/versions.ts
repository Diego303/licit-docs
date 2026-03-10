export interface VersionConfig {
  id: string;
  label: string;
  latest: boolean;
}

export const VERSIONS: VersionConfig[] = [
  { id: 'v0-1-0', label: 'v0.1.0', latest: true },
];

export function getLatestVersion(): VersionConfig {
  return VERSIONS.find((v) => v.latest) ?? VERSIONS[0];
}

export function getDocSlug(id: string): string {
  return id.replace(/^v\d+-\d+-\d+\//, '');
}
