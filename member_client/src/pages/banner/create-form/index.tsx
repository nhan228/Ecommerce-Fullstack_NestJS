import { useDispatch } from 'react-redux'
import { Modal, message } from 'antd'
import { useState } from 'react'
import { bannerAction } from '@/store/slices/banner.slice'
import api from '@services/apis'

export default function CreateForm({ setFormCreate }: {
    setFormCreate: any
}) {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const dispatch = useDispatch()

    {/* CREATE */ }
    function createBanner(e: React.FormEvent) {
        e.preventDefault();

        let formData = new FormData();
        let data = {
            title: (e.target as any).title.value,
        };

        // check emty title
        if (!data.title) {
            message.warning("Title must not be Empty!");
            return;
        }
        formData.append("data", JSON.stringify(data));

        // img
        if (!(e.target as any).banner.files[0]) {
            message.warning("Please Select an Image!");
            return;
        }

        const selectedFile = (e.target as any).banner.files[0];
        const img = new Image();
        img.onload = function () {
            if (img.width < 1180 || img.height < 270) {
                message.warning("The Image Size is not Suitable (Minimum 1180 x 270 pixels)");
                URL.revokeObjectURL(img.src);
                return;
            }
            if (!/^image\//.test(selectedFile.type)) {
                message.warning("Please Choose an Image in the Correct Format (JPG, PNG, SVG, WEBP, ...)!");
                return;
            }
            if (selectedFile.size / 1048576 > 5) {
                message.warning("Please Select an Image with a File Size <= 5MB");
                return;
            }
            formData.append("img", selectedFile);
            api.bannerApi.create(formData)
                .then((res: any) => {
                    if (res.status == 200) {
                        dispatch(bannerAction.addBanner(res.data.data));
                        Modal.success({
                            title: "Successfully",
                            content:`${res.data.message}`,
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
                        onOk: () => {
                            setFormCreate()
                        }
                    })
                })
        }
        img.src = URL.createObjectURL(selectedFile)
    }

    //  close
    const handleCancel = () => {
        setIsModalVisible(false)
        setFormCreate(false)
    }

    return (
        <div className='banner-box'>
            <div className='banner-form'>
                <Modal
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <form className='form' onSubmit={(e) => createBanner(e)} >
                        <h2>Create banner</h2>
                        {/* title */}
                        <div >
                            <label>Title :</label>
                            <input type="text" name='title' placeholder='Title banner' autoFocus/>
                        </div>

                        {/* img */}
                        <div className='img'>
                            <label>Image :</label>
                            <img src={`${import.meta.env.VITE_SERVER}/$`} />
                            <input type="file" name='banner' onChange={(e: any) => {
                                if (e.target.files.length > 0) {
                                    let imgEl = e.target.parentNode.querySelector('img');
                                    imgEl.src = URL.createObjectURL(e.target.files[0])
                                }
                            }} />
                        </div>

                        {/* status */}
                        <div>
                            <label>Status :</label>
                            <input type='text' name='status' defaultValue='Inactive' disabled style={{cursor:'not-allowed'}}/>
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
