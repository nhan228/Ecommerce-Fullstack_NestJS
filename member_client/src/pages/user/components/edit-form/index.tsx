import { InputGroup, Form } from 'react-bootstrap'
import { userAction } from '@slices/user.slice'
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'

export default function UserEditForm({ showEdit, setShowEdit, updateData }: any) {
    const dispatch = useDispatch()
    console.log('updateData', updateData)
    async function handleEditUser(e: any) {
        e.preventDefault()
        try {
            let avatar = null
            if (!(e.target as any).avatar.files[0]) {
                avatar = updateData.avatar
            } else {
                avatar = await uploadToFirebase((e.target as any).avatar.files[0], '')
            }

            let status= Boolean((e.target as any).status.value);
            let emailConfirm = (e.target as any).emailConfirm.value == 'true' ? 'active' : 'inactive'
            console.log('s',status);
            console.log('email',emailConfirm);

            let editUser = {
                userName: (e.target as any).userName.value,
                email: (e.target as any).email.value,
                avatar,
                status,
                emailConfirm
            }

            console.log('editUser', editUser)
            let result = await api.userApi.update(Number(updateData.id), {
                ...editUser
            })

            Modal.success({
                title: "Notification",
                content: "Edit User successfully!",
                onOk: () => {
                    dispatch(userAction.update(result.data.data));
                    (e.target as any).userName.value = "";
                    (e.target as any).email.value = "";
                    (e.target as any).status.value = null;
                    (e.target as any).avatar.value = null;
                    (e.target as any).emailConfirm.value = null;
                    setShowEdit(!showEdit)
                }
            })
        } catch (err: any) {
            console.log("err", err)
            window.alert(`${err.response.data.message}`)
        }
    }
    return (
        <div className='user_edit_form'>
            <form onSubmit={(e) => {
                handleEditUser(e)
            }}>
                <div className='btn_box'>
                    <span>Edit User</span>
                    <button onClick={() => {
                        setShowEdit(!showEdit)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px", cursor:'pointer' }} id="basic-addon1">User Name</InputGroup.Text>
                    <Form.Control
                        placeholder="User Name"
                        name='userName'
                        defaultValue={updateData.userName}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "110px",cursor:'pointer' }} id="basic-addon1">Email</InputGroup.Text>
                    <Form.Control
                        placeholder="Email"
                        name='email'
                        defaultValue={updateData.email}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px", cursor:'pointer' }} id="basic-addon1">Avatar</InputGroup.Text>
                    <div className='input_avatar'>
                        <img src={updateData.avatar} />
                        <input onChange={(e) => {
                            if ((e.target as any).files.length > 0) {
                                let spanEl = (e.target as any).parentNode.querySelector('span')
                                let imgEl = (e.target as any).parentNode.querySelector('img')
                                spanEl.style.opacity = 0
                                imgEl.src = URL.createObjectURL((e.target as any).files[0])
                            }
                        }} name='avatar' type="file" />
                        <span>+</span>
                    </div>
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px", cursor:'pointer'}} id="basic-addon1">Status</InputGroup.Text>
                    <Form.Control
                        defaultValue={updateData.status? 'Acitve': 'Blocked'}
                        readOnly
                        style={{cursor:'not-allowed'}}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "140px", cursor:'pointer' }} id="basic-addon1">Email Confirm</InputGroup.Text>
                    <Form.Select name='emailConfirm' aria-label="Default select example" defaultValue={updateData.emailConfirm} style={{cursor:'pointer'}}>
                        <option key={Date.now() * Math.random()} value={true as any}>Active</option>
                        <option key={Date.now() * Math.random()} value={false as any}>Inactive</option>
                    </Form.Select>
                </InputGroup>

                <button type='submit' className='btn btn-success'>Save</button>
            </form>
        </div>
    )
}