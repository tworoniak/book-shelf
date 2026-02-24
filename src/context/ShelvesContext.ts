import { createContext } from 'react';
import type { ShelvesStore } from './shelvesStore';

export const ShelvesContext = createContext<ShelvesStore | null>(null);
