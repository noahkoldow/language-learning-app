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
  where,
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

export default useFirestore;
