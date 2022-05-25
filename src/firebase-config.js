import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// ไฟล์นี้ส่งฐานข้อมูลออกไปใช้ที่ App.Js กับ Navbar.js


// เปลี่ยนใช้ข้อมูลของตัวเองได้เลย ข้อมูลได้มาจากตัวเว็บ firebase
const firebaseConfig = {
    apiKey: "AIzaSyDvATcHEn7lsdDzoNV0-m4otG-HY1WGpCc",
    authDomain: "my-web-site-49258.firebaseapp.com",
    databaseURL: "https://my-web-site-49258-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-web-site-49258",
    storageBucket: "my-web-site-49258.appspot.com",
    messagingSenderId: "623405313807",
    appId: "1:623405313807:web:fce800256ad6756b3d187a",
    measurementId: "G-RRR8WGV729"
}

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
