import { createContext } from 'react';
import type NotatBackendClient from './NotatBackendClient.js';

export const NotatBackendClientContext = createContext<NotatBackendClient | null>(null);
