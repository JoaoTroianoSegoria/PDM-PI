import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const AUTH_STORAGE_KEY = 'univer-auth';

const UniverContext = createContext();

const emptyDisciplines = { current: [], history: [] };
const emptyInvoices = { pending: [], history: [] };

export function UniverProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [studentCard, setStudentCard] = useState(null);
  const [disciplines, setDisciplines] = useState(emptyDisciplines);
  const [grades, setGrades] = useState([]);
  const [invoices, setInvoices] = useState(emptyInvoices);
  const [libraryLoans, setLibraryLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        nextDashboard,
        nextStudentCard,
        nextDisciplines,
        nextGrades,
        nextInvoices,
        nextLibraryLoans,
      ] = await Promise.all([
        api.dashboard(),
        api.studentCard(),
        api.disciplines(),
        api.grades(),
        api.invoices(),
        api.libraryLoans(),
      ]);

      setDashboard(nextDashboard);
      setStudentCard(nextStudentCard);
      setDisciplines(nextDisciplines);
      setGrades(nextGrades);
      setInvoices(nextInvoices);
      setLibraryLoans(nextLibraryLoans);
    } catch (currentError) {
      setError(currentError.message ?? 'Falha ao carregar dados do servidor');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuthToken(parsedAuth.token);

          const response = await api.me();
          setUser(response.user);
        }
      } catch {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthToken(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (!authLoading) {
      refresh();
    }
  }, [authLoading, refresh]);

  const login = useCallback(async (credentials) => {
    const auth = await api.login(credentials);

    setAuthToken(auth.token);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    setUser(auth.user);

    return auth.user;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
    setDashboard(null);
    setStudentCard(null);
    setDisciplines(emptyDisciplines);
    setGrades([]);
    setInvoices(emptyInvoices);
    setLibraryLoans([]);
    setError(null);
    setLoading(false);
  }, []);

  return (
    <UniverContext.Provider
      value={{
        user,
        dashboard,
        studentCard,
        disciplines,
        grades,
        invoices,
        libraryLoans,
        loading,
        authLoading,
        error,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </UniverContext.Provider>
  );
}

export function useUniver() {
  return useContext(UniverContext);
}
