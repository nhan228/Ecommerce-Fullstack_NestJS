import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, deleteUser, reauthenticateWithCredential } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtAGkQYjO2LI2-T56Q0qBVEDBu7kJB98Y",
    authDomain: "nhantech-store.firebaseapp.com",
    projectId: "nhantech-store",
    storageBucket: "nhantech-store.appspot.com",
    messagingSenderId: "457196001984",
    appId: "1:457196001984:web:2d699db928193bcbfb2b25",
    measurementId: "G-FRWZ42SMD0"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = auth.currentUser;

export async function uploadToFirebase(file: any, fallBackUrl: string) {
    try {
        const tailFile = file.name.split('.')[file.name.split('.').length - 1]
        const storage = getStorage(app);
        const mountainsRef = ref(storage, `image_${Date.now() * Math.random()}.${tailFile}`);

        let res = await uploadBytes(mountainsRef, file)
        let url = await getDownloadURL(res.ref)
        return url
    } catch (err) {
        console.log('err', err);
        return fallBackUrl
    }
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    try {
        let result = await signInWithPopup(auth, provider);
        return result;
    } catch (err) {
        return false
    }
}


export async function loginWithGithub() {
    const provider = new GithubAuthProvider();
    const auth = getAuth(app);
    try {
        let result = await signInWithPopup(auth, provider);
        return result;
    }
    catch (err) {
        return false
    }
}

// export async function reauthenticate() {
//     const credential = promptForCredentials();
//     reauthenticateWithCredential(user, credential)
//         .then(() => {
//         }).catch((error: any) => {
//         });
// }

export async function logout() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            deleteUser(user)
                .then(() => {
                })
                .catch((err: any) => {
                    console.log('err', err);
                });
        } else {
            console.log('No user is currently authenticated.');
        }
    });
}