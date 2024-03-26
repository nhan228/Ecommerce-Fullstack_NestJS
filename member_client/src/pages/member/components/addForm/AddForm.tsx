import api from '@/services/apis'
import { useDispatch } from 'react-redux'
import { memberAction } from '@/store/slices/member.slice'
import { Modal, Form, Input, Radio } from 'antd'

import './addForm.scss'

export default function AddForm() {
    const dispatch = useDispatch()

    // handle submit
    const handleSubmit = async (values: any) => {
        let member = {
            firstName: values.firstName,
            lastName: values.lastName,
            loginId: values.loginId,
            role: values.role,
            email: values.email,
            phoneNumber: values.phoneNumber,
        }
        
        await api.memberApi.create(member)
            .then(res => {
                if (res.status == 200) {
                    dispatch(memberAction.addMember(res.data.data))
                    Modal.success({
                        title: 'Success',
                        content: `Create member account: '${res.data.data.loginId}' successfully.`,
                        onOk: () => {
                            dispatch(memberAction.setDisplayAddForm())
                        }
                    })
                }
            })
            .catch(err => {
                Modal.warning({
                    title: 'Warning',
                    content: `${err.response?.data?.err}`,
                })
            })
    }

    return (
        <>
            <div className='member-box'>
                <div className='member-form-container'>
                    <Form
                        onFinish={handleSubmit}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                        layout="horizontal"
                    >
                        <h6 onClick={() => {
                            dispatch(memberAction.setDisplayAddForm())
                        }}>X</h6>
                        <h3>Create Member</h3>
                        <Form.Item label="First Name" name='firstName' rules={[{ required: true, message: 'Please enter first name!' }]}>
                            <Input type='text' placeholder='Enter member first name!' />
                        </Form.Item>
                        <Form.Item label="Last Name" name='lastName' rules={[{ required: true, message: 'Please enter last name!' }]}>
                            <Input type='text' placeholder='Enter member last name!' />
                        </Form.Item>
                        <Form.Item label="Login ID" name='loginId' rules={[{ required: true, message: 'Please enter login ID!' }]}>
                            <Input type='text' placeholder='Enter member login ID!' />
                        </Form.Item>
                        <Form.Item label="Email" name='email' rules={[{ required: true, message: 'Please enter Email!' }]}>
                            <Input type='email' placeholder='Enter member Email!' />
                        </Form.Item>
                        <Form.Item label="Phone Number" name='phoneNumber' rules={[{ required: true, message: 'Please enter phone number!' }]}>
                            <Input type='text' placeholder='Enter member phone number!' />
                        </Form.Item>
                        <Form.Item label="Role" name='role' rules={[{ required: true, message: 'Please choose role!' }]}>
                            <Radio.Group>
                                <Radio value="admin"> Admin </Radio>
                                <Radio value="member"> Member </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <button className="Btn" type='submit'>
                                CREATE
                                <svg className="svg" viewBox="0 0 512 512">
                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                </svg>
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}
