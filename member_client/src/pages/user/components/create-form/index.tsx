import { InputGroup, Form } from 'react-bootstrap';
import { userAction } from '@slices/user.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd';

export default function UserCreateForm({ dispatch }: any) {
  async function handleAddUser(e: any) {
    e.preventDefault();
    try {
      let newUser = {
        userName: (e.target as any).userName.value,
        email: (e.target as any).email.value,
        avatar: await uploadToFirebase((e.target as any).avatar.files[0], ''),
        status: Boolean((e.target as any).status.value)
      }

      let result = await api.userApi.create({
        ...newUser
      })

      Modal.success({
        title: "Notification",
        content: "Create User successfully!",
        onOk: () => {
          dispatch(userAction.addData(result.data.data))
          (e.target as any).userName.value = "";
          (e.target as any).email.value = "";
          (e.target as any).status.value = null;
          (e.target as any).avatar.value = null;
          dispatch(userAction.loadModal())
        }
      })
    } catch (err) {
      console.log("err", err)
    }
  }
  return (
    <div className='user_create_form'>
      <form onSubmit={(e) => {
        handleAddUser(e)
      }}>
        <div className='btn_box'>
          <span>Create User</span>
          <button onClick={() => {
            dispatch(userAction.loadModal())
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">User Name</InputGroup.Text>
          <Form.Control
            placeholder="User Name"
            name='userName'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Email</InputGroup.Text>
          <Form.Control
            placeholder="Email"
            name='email'
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Avatar</InputGroup.Text>
          <div className='input_avatar'>
            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" />
            <input onChange={(e) => {
              if ((e.target as any).files.length > 0) {
                let spanEl = (e.target as any).parentNode.querySelector('span');
                let imgEl = (e.target as any).parentNode.querySelector('img');
                spanEl.style.opacity = 0;
                imgEl.src = URL.createObjectURL((e.target as any).files[0])
              }
            }} name='avatar' type="file" />
            <span>+</span>
          </div>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Status</InputGroup.Text>
          <Form.Select name='status' aria-label="Default select example">
            <option value={null as any}>Please choose</option>
            <option key={Date.now() * Math.random()} value={true as any}>Active</option>
            <option key={Date.now() * Math.random()} value={false as any}>Block</option>
          </Form.Select>
        </InputGroup>
        <button type='submit' className='btn btn-success'>Add</button>
      </form>
    </div>
  )
}