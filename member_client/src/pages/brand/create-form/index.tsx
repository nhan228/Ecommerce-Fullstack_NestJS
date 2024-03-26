import { useDispatch } from 'react-redux'
import { Modal, message } from 'antd'
import { brandAction } from '@/store/slices/brand.slice'
import api from '@services/apis'
import { useState } from 'react'

export default function CreateForm({ setFormCreate }: {
    setFormCreate: any
}) {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const dispatch = useDispatch()

    {/* CREATE */ }
    function createBrand(e: React.FormEvent) {
        e.preventDefault()
        let data = {
            title: (e.target as any).name.value,
            codeName: (e.target as any).codename.value,
            status: (e.target as any).status.value,
        }

        // check emty name
        if (!data.title) {
            message.warning("Please enter name!");
            return
        }

        // check emty codename
        if (!data.codeName) {
            message.warning("Please enter Code Name!");
            return
        }
        if (!data.status || data.status == '') {
            message.warning("Please choose status");
            return
        }
        api.brandApi.create(data)
            .then((res: any) => {
                if (res.status == 200) {
                    dispatch(brandAction.add(res.data.data))
                    Modal.success({
                        title: "Successfully",
                        content: "Create brand successfully!",
                        onOk: () => {
                            setFormCreate()
                        }
                    })
                }
            })
            .catch((err: any) => {
                Modal.warning({
                    title: 'Warning',
                    content: `${err.response?.data?.err}`,
                })
            })
    }

    //  close
    const handleCancel = () => {
        setIsModalVisible(false)
        setFormCreate(false)
    }
    return (
        <div className='brand-box'>
            <div className='brand-form'>
                <Modal
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <form className='form' onSubmit={(e) => createBrand(e)} >
                        <h2>Create brand</h2>
                        {/* name */}
                        <div >
                            <label autoFocus>Name :</label>
                            <input type="text" name='name' placeholder='Enter name brand...' autoFocus />
                        </div>

                        {/* code name */}
                        <div >
                            <label>Code name :</label>
                            <input type="text" name='codename' placeholder='Enter Code name...' />
                        </div>

                        {/* status */}
                        <div>
                            <label>Status :</label>
                            <select name="status" id="">
                                <option value="active">Active</option>
                                <option value="inactive">InActive</option>
                            </select>
                        </div>

                        {/* button save */}
                        <div >
                            <button className="noselect" type='submit'>
                                <span className="text">Save</span>
                                <span className="icon">
                                    <i className="fa-solid fa-pen"></i>
                                </span>
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    )
}
