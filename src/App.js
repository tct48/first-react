import './App.css';
import { child, get, getDatabase, ref, set, push, update, remove } from "firebase/database";
import React, { Component } from 'react';
import _ from 'lodash';

class App extends Component {
  // คำสั่งภายในนี้จะทำทุกครั้ง เมื่อเปิดเพจ หรือ refresh
  constructor(props){
    // ลอกมา
    super(props);

    // ตัวแปร ที่จะเอาไว้โชว์หน้าเว็บใช้ตัวแปรอื่นไม่ออก
    this.state = {
      // 5 ตัวนี้เป็นตัวแปรที่งานนี้ใช้เฉพาะ แค่สำหรับ โพสต์ หรือ คอมเมนต์
      // (ส่งจากหน้า html มาฝั่ง react)
      title:'',
      displayName:'',
      description:'',
      photoURL:'',
      comments:[{}],

      // ตัวแปร 3 ตัวนี้ใช้แค่แสดงผล
      // (ส่งจาก react ไปแสดงที่ฝั่ง web)
      view_title:'',
      view_description:'',
      view_comments:[{}],
    }

    // เรียกใช้ method loadPost();
    this.loadPost();

    // อะไรซักอย่างทำให้เก็บค่าลงในตัวแปรจากหน้าเว็บมาใส่ในตัวแปร state
    // แล้วก็เอาค่าจากตัวแปร state ไปโชว์หน้าเว็บได้
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // ดึงข้อมูลโพสต์จาก firebase
  loadPost(){
    let dbRef = ref(getDatabase());
    // ดึงที่ตำแหน่งที่ชื่อว่า post
    get(child(dbRef, `post`)).then((snapshot) => {
      // snapshot เป็นแค่ชื่อตัวแปร
      // แต่เป็นตัวแปรที่เก็บผลลัพธ์ที่ออกมาจาก ฐานข้อมูลที่เราเรียกไป 
      // (ในที่นี้ก็คือ post ถ้าใน key ที่ชื่อ post มีข้อมูลอะไรบ้างก็จะส่งกลับมาทั้งหมดเก็บไว้ในตัวแปรที่ชื่อ snapshot) **เปลี่ยนชื่อตัวแปรได้
      if (snapshot.exists()) {
        var items = snapshot.val();
        this.getData("view_title", items.title);
        this.getData("view_description", items.description);
      }
    });

    // สร้างตัวแปร ประเภท array เพราะต้องเก็บ comments หลาย ๆ อัน
    let all_comments = [];

    // ดึงข้อมูลที่ตำแหน่ง post/comments (ดึงข้อมูล comment ทั้งหมดในโพสต์นั้นแหละ)
    get(child(dbRef, `post/comments`)).then((snapshot) => {
      if (snapshot.exists()) { // <-- method ชื่อ exist() หมายถึง เช็คว่ามีข้อมูลรึเปล่า (snapshot มีข้อมูลรึเปล่า [**มี comments โพสต์นี้อยู่ในฐานข้อมูลรึเปล่าแค่นั้นแหละ** ถ้ามีก็จะทำภายในวงเล็บ])
        // ในนี้เรารู้แล้วว่ามีฐานข้อมูลเราก็ใช้ forEach
        // เพราะ forEach ไว้ใช้กับข้อมูลประเภท Array **Comments ในฐานข้อมูลต้องเก็บเป็น Array
        snapshot.forEach(child=>{
          // ตัวแปร child ก็คือข้อมูลใน ลูปแต่ละรอบ
          // (เช่น let number = [15, 16, 17];) 
          // ภายใน forEach จะทำงาน 3 รอบเพราะ Array มี 3 ตัว
          // โดยรอบที่ 1 child จะมีค่าเท่ากับ 15
          // .... รอบที่ 3 child จะมีค่าเท่ากับ 17 ตามลำดับ


          // จากด้านบนก็เลยเอามาปรับใช้แทน Comments **เจอกี่ comments ลูปตามจำนวน comments ที่มีเช่น มี 5 comments ในฐานข้อมูล firebase
          // แต่ที่นี้ ใน 1 comments ตอนเราเพิ่มไป เราเพิ่มเป็น object เพราะเราต้องเก็บ ชื่อ รูปภาพ หัวเรื่อง description
          
          // เราก็ต้องดึงมันออกมาเป็น object ตัวแปร obj เป็น object จากด้านล่างกำหนดเป็น object เปล่า ๆ
          let obj = {
            displayName:'',
            photoURL:'',
            title:'',
            description:''
          }

          // ["ใส่ค่าทีละอัน"]
          obj.title = [child.val().title];
          obj.displayName = [child.val().displayName];
          obj.photoURL = [child.val().photoURL];
          obj.description = [child.val().description];
          // ["ใส่ค่าทีละอัน"] ปั้น object เสร็จแล้ว
          
          // push ใส่ตัวแปร array ที่ชื่อ all_comments
          all_comments.push(obj);
        })

        // พอตัวแปร all_comments เก็บ comments ทั้งหมดที่มีในฐานข้อมูลของโพสต์นั้นแล้ว เราก็ใช้ฟังก์ชันด้านล่างยัดค่าใส่ตัวแปรที่จะเอาไปแสดงที่ตัวเว็บ
        this.getData("view_comments",all_comments);
      }
    });
  }

  // ฟังก์ชันนี้ทำงานทุกครั้งเมื่อพิมพ์อะไรก็ได้ลงในกล่อง input มันจะเก็บค่าลงใน this.state.title และ this.state.description
  // เก็บค่าหัวเรื่องจาก INPUT ลอกเค้ามาเท่าที่ลองเล่นมา ตัวแปรทั้งหมด จะแสดงที่หน้าเว็บไม่ได้เลย **ยกเว้นตัวแปร state เลยต้องลอกมา
  handleChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  
  // ฟังก์ชันนี้ถูกเรียกที่หน้าเว็บเมื่อคลิกปุ่ม submit ลอกเค้ามา
  handleSubmit(e){
    e.preventDefault();
    // ถ้ากดปุ่ม submit โดยที่พิมพ์ชื่อเรื่อง
    // ก็แสดงว่ายังไม่มีคนเคยโพสต์ เป็นโพสต์ครั้งแรก (หรือโพสใหม่)
    if(this.state.title!=''){
      // การ Post
      const db = getDatabase();
      const item = {
          title : this.state.title,
          description : this.state.description,
          displayName : localStorage.getItem('displayName'),
          photoURL : localStorage.getItem('photoURL'),
          comments : [{}],
      }
      // set คือฟังก์ชันของ firebase ใช้เพิ่มข้อมูล
      // อันนี้หมายถึงเพิ่มไปยัง ฐานข้อมูลที่มีชื่อว่า post/[ข้อมูลที่เพิ่มจะอยู่ตรงนี้ถัดจาก post]
      set(ref (db, 'post/'), item);
    }
    // ถ้ากดปุ่ม submit โดยพิมพ์แค่ช่องรายละเอียด แล้ว หัวเรื่องเป็นค่าว่าง แสดงว่าเป็น comments
    else{
      // การ Comments
      const db = getDatabase();
      const item = {
          title : this.state.title,
          description : this.state.description,
          displayName : localStorage.getItem('displayName'),
          photoURL : localStorage.getItem('photoURL')
      };
      // push คือฟังก์ชันของ firebase ใช้เพิ่มเหมือนกันแต่จะเป็นรูปแบบ Array เพราะเราต้องการมี comments หลาย ๆ อัน
      // อันนี้ก็คือ เพิ่ม Array ลงไปใน post/comments
      push(ref (db, 'post/comments/'), item);   
    }

    alert("โพสต์สำเร็จ");

    this.setState({       
      title:'',
      displayName:'',
      description:'',
      photoURL:'',
      comments:[{}],
      view_title:'',
      view_description:'',
      view_comments:[{}]
    })
    this.loadPost();
 }

 // อันนี้ก็ตรงตัวทำเมื่อคลิกปุ่ม Delete
 onDelete(){
  const db = getDatabase();
  // remove ฟังก์ชันของ firebase
  remove(ref (db, 'post/')).then((result)=>{
    // ถ้าทำงานภายในนี้แสดงว่า สำเร็จ ก็ alert ข้อความ แล้วก็สั่ง refresh หน้าเว็บ
    alert("ลบโพสสำเร็จ");
    location.reload();
  })
 }

  // ฟังก์ชันนี้ เขียนขึ้นมาเอง เพื่อกำหนดค่า ตัวแปร state ที่รับส่งหน้าเว็บนั่นแหละ
  // เลยเขียนมันขึ้นมาใหม่ให้มันดูใช้ง่ายขึ้นเพราะจำไม่ค่อยได้
  getData(itemKey, itemValue){    
    this.setState({
      [itemKey]: itemValue
    });
  }

  render(){
    return (
      <div className="my-10">
        <div className='container mx-auto'>  
          {/* region "ส่วนแสดง POST" */}
          {this.state.view_title ? (              
            <div className='border border-gray-500 px-8 py-4 bg-blue-800 mb-5 rounded-sm shadow-xl'>
              <h1 className='text-2xl font-medium text-yellow-400 mb-5 relative'>
                {this.state.view_title}
                <span onClick={this.onDelete} className='absolute text-sm text-red-300 right-0 cursor-pointer'>
                  X
                </span>
              </h1>
              <p className='text-gray-300 '>
                  {this.state.view_description}
              </p>
            </div>
          ) : (                        
              <span></span>
          )}
          {/* endregion "ส่วนแสดง POST" */}
  

          {/* region "ส่วนแสดง Comment" */}
          {this.state.view_comments.map(m=>{
            if(m.description)
            return (
              <div className='border border-gray-500 px-8 py-4 rounded-sm mb-3' style={{ backgroundColor:'#222244' }}>
                <p className='text-gray-300 relative'>
                  {m.description}
                </p>
                <div className='block h-fit' style={{ color:'#90a8d1' }}>
                  <div className='float-left'>
                    <img className='rounded-md border border-gray-500 h-8 w-8' src={m.photoURL} alt="User Image"/>
                  </div>
                  <div className='float-left mt-2 ml-3'>
                    {m.displayName}
                  </div>    
                  <div className='clear-both'></div>        
                </div>
              </div>
            )
          })}
          {/* endregion "ส่วนแสดง Comment" */}
  







          <hr className='mb-3' style={{border:'1px solid white'}}/>
          {/* region "ส่วนที่ใช้ Comments */}
          <h3 className='text-md text-black font-semibold'>
            แสดงความคิดเห็น
          </h3>
          <div className='border border-gray-500 px-8 py-4 rounded-sm shadow-xl mb-8' style={{ backgroundColor:'#200126' }}>
            <form  onSubmit={this.handleSubmit}>              
              {!this.state.view_title ? (
                // ถ้ามีโพสต์อยู่แล้วจะไม่แสดงส่วนนี้ สังเกตุจาก เครื่องหมาย ! บรรทัดด้านบน
                // ความหมายคือ ถ้าตัวแปรด้านบนเขียนแบบนี้ this.state.view_title หมายถึง ถ้าตัวแปร state.view_title มีข้อมูล
                // พอเติม ! ไปด้านหน้าก็คือ ถ้า !state.view_title ไม่มีข้อมูล ในส่วนนี้หมายถึง ถ้าไม่มีโพสต์อยู่เลย ก็ให้แสดง html input ที่ไว้โพสต์
                <div>
                  <label>โพสต์ : </label>
                    <input type="text" name="title"  placeholder='..Post..' className='p-1  w-full mb-2' style={{ backgroundColor:'#EC3D8B', border:'1px solid #4793a1' }} onChange={this.handleChange} value={this.state.title}/>  
                </div>
              ) : (
                  // ถ้ามีโพสต์อยู่แล้วก็แสดง <span></span> เปล่า ๆ อันนึง                    
                  <span></span>
              )}
              <div>
                <label>คอมเมนต์ :</label>
                <textarea  name="description"  onChange={this.handleChange} value={this.state.description} className='p-3 w-full h-56' style={{ backgroundColor:'#0e5c6a', border:'1px solid #4793a1' }}>
                </textarea>
              </div>
              <button type='submit' className='bg-green-600 hover:bg-green-700 rounded text-white px-4 py-2'>
                ส่งความคิดเห็น
              </button>
            </form>
          </div>
          {/* endregion "ส่วนที่ใช้ Comments */}
  
  
        </div>
      </div>
    );
  }  
}

export default App;
