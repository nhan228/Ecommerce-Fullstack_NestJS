import { useDispatch } from 'react-redux'
import { Modal, message } from 'antd'
import { useState } from 'react'
import { categoryAction } from '@/store/slices/category.slice'
import api from '@services/apis'
import Load from '@/components/load-form'

export default function CreateForm({ setFormCreate }: {
    setFormCreate: any
}) {
    const [load, setLoad] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState(true);
    const dispatch = useDispatch()

    {/* CREATE */ }
    function createCategory(e: React.FormEvent) {
        e.preventDefault()
        let newCategory = {
            title: (e.target as any).name.value,
            codeName: (e.target as any).codename.value,
            status: (e.target as any).status.value,
        }
        setLoad(true)

        // check emty name
        if (!newCategory.title) {
            message.warning("Please enter name!");
            setLoad(false)
            return
        }
        // check emty codename
        if (!newCategory.codeName) {
            message.warning("Please enter Code Name!");
            setLoad(false)
            return
        }
        
        api.categoryApi.create(newCategory)
            .then((res: any) => {
                if (res.status == 200) {
                    dispatch(categoryAction.addCategory(res.data.data))
                    Modal.success({
                        title: "Successfully",
                        content: "Create category successfully!",
                        onOk: () => {
                            setLoad(false)
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
        <div className='category-box'>
            <div className='category-form'>
            {load && <Load />}
                <Modal
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <form className='form' onSubmit={(e) => createCategory(e)} >
                        <h2>Create category</h2>
                        {/* name */}
                        <div >
                            <label autoFocus>Name :</label>
                            <input type="text" name='name' placeholder='Enter name category...' autoFocus />
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

                        {/* button create */}
                        <div >
                            <button className="noselect" type='submit'>
                                <span className="text">Create</span>
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
