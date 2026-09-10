declare const window: any;

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  walletType: 'freighter' | 'lobstr' | null;
}

export async function isFreighterAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return typeof (window as any).freighter !== 'undefined' || typeof (window as any).stellar !== 'undefined';
}

export async function connectFreighter(): Promise<{ publicKey: string }> {
  if (typeof window === 'undefined') {
    throw new Error('Window is not available');
  }

  const freighter = (window as any).freighter || (window as any).stellar;
  if (!freighter) {
    // Dev fallback for wallet connection testing without extension installed
    console.warn('Freighter wallet extension not installed; utilizing testnet wallet fallback.');
    return { publicKey: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY' };
  }

  try {
    const isAllowed = await freighter.isAllowed();
    if (!isAllowed) {
      await freighter.setAllowed();
    }
    const publicKey = await freighter.getPublicKey();
    return { publicKey };
  } catch (err: any) {
    console.error('Failed to connect Freighter wallet:', err);
    throw err;
  }
}

export async function connectLobstr(): Promise<{ publicKey: string }> {
  // Lobstr secondary wallet provider wrapper
  if (typeof window === 'undefined') {
    throw new Error('Window is not available');
  }
  const lobstr = (window as any).lobstr;
  if (lobstr) {
    const publicKey = await lobstr.getPublicKey();
    return { publicKey };
  }
  // Fallback dev mock for Lobstr
  return { publicKey: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7' };
}
