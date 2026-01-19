// Firestore Database Operations Hook
import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Hook for Firestore CRUD operations
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {object} - CRUD functions and state
 */
export function useFirestore(collectionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDocument = useCallback(async (docId) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const setDocument = useCallback(async (docId, data) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      return { id: docId, ...data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const updateDocument = useCallback(async (docId, data) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const deleteDocument = useCallback(async (docId) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const addDocument = useCallback(async (data) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return { id: docRef.id, ...data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const queryDocuments = useCallback(async (conditions = []) => {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...conditions);
      const querySnapshot = await getDocs(q);

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return {
    getDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    addDocument,
    queryDocuments,
    loading,
    error,
  };
}

/**
 * Hook for managing text language preferences in Firestore
 * @param {string} userId - Current user ID
 * @returns {object} - Functions for managing text language preferences
 */
export function useTextLanguagePreferences(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Save text language preference to Firestore
   * @param {string} textId - Text ID
   * @param {string} languageCode - Language code
   */
  const saveTextLanguage = useCallback(async (textId, languageCode) => {
    if (!db || !userId) {
      console.warn('Firestore not initialized or no user ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'users', userId, 'texts', textId);
      await setDoc(docRef, { targetLanguage: languageCode }, { merge: true });
    } catch (err) {
      setError(err.message);
      console.error('Failed to save text language preference:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Load text language preference from Firestore
   * @param {string} textId - Text ID
   * @returns {string|null} - Language code or null
   */
  const loadTextLanguage = useCallback(async (textId) => {
    if (!db || !userId) {
      console.warn('Firestore not initialized or no user ID');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'users', userId, 'texts', textId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data()?.targetLanguage || null;
      }
      return null;
    } catch (err) {
      setError(err.message);
      console.error('Failed to load text language preference:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    saveTextLanguage,
    loadTextLanguage,
    loading,
    error,
  };
}

export default useFirestore;
