
'use client';

import { useLanguage } from '@/context/language-context';
import { useMemo } from 'react';

export type Niche = {
  id: string;
  label: string;
  icon: string;
};

export const useNicheTranslation = () => {
  const { t } = useLanguage();

  const niches = useMemo(() => {
    return t('creatorJoinForm.niches', { returnObjects: true }) as Niche[];
  }, [t]);

  const nicheMap = useMemo(() => {
    return new Map(niches.map(n => [n.id, n.label]));
  }, [niches]);

  const getNicheLabel = (nicheId: string): string => {
    // The "Other" tag is a special case that is stored as a label, not an ID.
    // We also check if the nicheId is already a translated label (for custom tags).
    if (nicheId === 'Other' || !nicheMap.has(nicheId)) {
        const isAlreadyTranslated = niches.some(n => n.label === nicheId);
        if(isAlreadyTranslated) return nicheId;
    }
    return nicheMap.get(nicheId) || nicheId;
  };
  
  const allNiches = useMemo(() => {
      return t('creatorJoinForm.niches', { returnObjects: true }) as Niche[];
  }, [t]);


  return { t, niches: allNiches, getNicheLabel };
};
