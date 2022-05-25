import { async } from "@firebase/util";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { authentication } from "../firebase-config";

function Navbar(){
    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
          ? JSON.parse(localStorage.getItem('loginData'))
          : null
      );

    // ล๊อกอิน Google
    const signInWithGoogle=async()=>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(authentication, provider)
            .then((result)=>{
                var userLogin = result.user;
                setLoginData(userLogin);
                localStorage.setItem('loginData', JSON.stringify(userLogin));
                localStorage.setItem('displayName', userLogin.displayName);
                localStorage.setItem('photoURL', userLogin.photoURL);
                alert("ยินดีต้อนรับ");
            })
            .catch((error)=>{
                console.log("Error", error);
            })
    }

    // ล๊อกเอ้าท์
    const onLogout = () =>{
        alert("ขอบคุณที่ใช้บริการ");
        clearSession();
        setLoginData(null);
    }

    // ลบข้อมูลชื่อผู้ล๊อกอินออก
    const clearSession = () => {
        localStorage.removeItem('loginData');
        localStorage.removeItem('displayName');
        localStorage.removeItem('photoURL');
    }
        
    return(
        <div>            
            <div className="text-white text-right p-2 shadow border-indigo-400" style={{backgroundColor: '#102938', border:'2px solid black'}}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-2">
                        <div className="col-span-1">
                            <img id="img1" className="h-10 w-10 rounded-md border border-black shadow-md" src={"https://imgz.io/images/2022/05/25/logo1149405d98df9cdb.png"} />
                        </div>
                        <div className="col-span-1 pt-1">
                            {loginData ? (
                                // ถ้ามีข้อมูลผู้ใช้ login แสดงส่วนนี้
                                <div>
                                    <span className="mx-2">                            
                                        <span><img className="h-8 w-8 rounded-full border border-gray-500 mx-2 shadow-md inline-block" src={loginData.photoURL}/>{loginData.displayName}</span>
                                    </span>
                                    |
                                    <button onClick={onLogout} className="mx-2 px-2 py-1 btnSignIn rounded">
                                        ออกจากระบบ
                                    </button>
                                </div>
                            ) : (                        
                                // ถ้าไม่มีข้อมูลผู้ใช้ login อยู่แสดงส่วนนี้
                                <button id="btnSignIn" onClick={signInWithGoogle} className="rounded p-2 px-8 inline-block float-right">
                                    ล๊อกอิน
                                </button>
                            )}
                        </div>
                    </div>             
                    
                    <div className="clear-both"></div>
                </div>
            </div>
            <div className="h-48 text-center grid content-center bg-[url('https://imgz.io/images/2022/05/25/gatooh51ee709e10ddf32d.png')] bg-cover">
            </div>
            <div className="py-2" style={{backgroundColor:'#102938', border:'2px solid #1f1d33'}}>
                <div className="container mx-auto">
                    <p>หน้าแรก</p>
                </div>
            </div>
        </div>
        
    );
}
export default Navbar;