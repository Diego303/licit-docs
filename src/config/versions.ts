export interface VersionConfig {
  id: string;
  label: string;
  latest: boolean;
}

export const VERSIONS: VersionConfig[] = [
  { id: 'v0-7-0', label: 'v0.7.0', latest: true },
  { id: 'v0-6-0', label: 'v0.6.0', latest: false },
  { id: 'v0-5-0', label: 'v0.5.0', latest: false },
  { id: 'v0-4-0', label: 'v0.4.0', latest: false },
  { id: 'v0-3-0', label: 'v0.3.0', latest: false },
  { id: 'v0-2-0', label: 'v0.2.0', latest: false },
  { id: 'v0-1-0', label: 'v0.1.0', latest: false },
];

export function getLatestVersion(): VersionConfig {
  return VERSIONS.find((v) => v.latest) ?? VERSIONS[0];
}

export function getDocSlug(id: string): string {
  return id.replace(/^v\d+-\d+-\d+\//, '');
}

export function getVersionFromDocId(id: string): VersionConfig | undefined {
  return VERSIONS.find((v) => id.startsWith(v.id + '/'));
}
