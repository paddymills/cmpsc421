// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBmvy6c8UBnpiFqtKwPFEWqDZVOih-cW3E',
  authDomain: 'dancedancerevuelution.firebaseapp.com',
  projectId: 'dancedancerevuelution',
  storageBucket: 'dancedancerevuelution.firebasestorage.app',
  messagingSenderId: '546398654701',
  appId: '1:546398654701:web:f44354183f4150f8d6fce4',
  measurementId: 'G-3LJTEDBD9Z',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export { db }
