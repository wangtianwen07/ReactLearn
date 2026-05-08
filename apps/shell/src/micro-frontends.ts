import { registerMicroApps, start, type RegistrableApp } from 'qiankun';
import { microAppManifests } from '@react-learn/shared';

let started = false;

export function initMicroFrontends(): void {
  if (started) {
    return;
  }

  const apps: RegistrableApp<object>[] = microAppManifests.map((app) => ({
    name: app.name,
    entry: app.entry,
    container: `#${app.containerId}`,
    activeRule: app.activeRule,
    props: {
      basename: app.activeRule,
      appName: app.name,
    },
  }));

  registerMicroApps(apps);
  start({
    prefetch: 'all',
    singular: true,
  });

  started = true;
}
