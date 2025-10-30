import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SecureCraft Canvas',
  projectId: '2d7d27ad6f5e4dcfb7463087b508d2d1',
  chains: [sepolia],
  ssr: false,
});
