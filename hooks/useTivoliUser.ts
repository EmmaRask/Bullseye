'use client';

import { useEffect, useState } from 'react';

type TivoliUser = {
  id: number;
  name: string;
};

type IdentityResponse = {
  user: TivoliUser;
};

export function useTivoliUser() {
  const [playerName, setPlayerName] = useState<string>('');
  const [identityToken, setIdentityToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const params = new URLSearchParams(window.location.search);

        const token = params.get('identity_token');

        if (!token) {
          setError('Missing identity token');
          return;
        }

        setIdentityToken(token);

        localStorage.setItem('identity_token', token);

        const response = await fetch(
          `/api/tivoli/identity-token?token=${token}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Tivoli user');
        }

        const data: IdentityResponse = await response.json();

        setPlayerName(data.user.name);
      } catch (err) {
        console.error(err);
        setError('Could not load Tivoli user');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    playerName,
    identityToken,
    loading,
    error,
  };
}