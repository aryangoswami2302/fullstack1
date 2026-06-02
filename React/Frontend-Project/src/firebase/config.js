import { auth, db } from '../firebase';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

// Enable persistent login across sessions
setPersistence(auth, browserLocalPersistence);

export { auth, db };
