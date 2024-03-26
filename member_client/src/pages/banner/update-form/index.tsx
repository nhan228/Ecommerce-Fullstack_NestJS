import { useDispatch } from 'react-redux';
import api from '@/services/apis';
import { Modal, message } from 'antd';
import { bannerAction } from '@/store/slices/banner.slice';
import React, { useState } from 'react';

export default function UpdateForm({ selectedBanner, setFormUpdate }: {
    selectedBanner: any
    setFormUpdate: any
}) {
    const dispatch = useDispatch()
    const [isModalVisible, setIsModalVisible] = useState(true);

    const handleCancel = () => {
        setIsModalVisible(false)
        setFormUpdate(false)
    }

    {/* UPDATE */ }
    function updateBanner(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedBanner) {
            return;
        }
        const formData = new FormData();
        // data
        let data = {
            title: (e.target as any).title.value,
            status: (e.target as any).status.value
        }
        if (!data.title) {
            message.warning("Title must not be Empty!")
            return
        }
        formData.append("data", JSON.stringify(data))

        // img
        const selectedFile = (e.target as any).banner.files[0]
        if (selectedFile) {
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
                formData.append('img', selectedFile);

                api.bannerApi.updateImg(selectedBanner.id, formData)
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(bannerAction.updateData(res.data.data))
                            setFormUpdate(false)
                            Modal.success({
                                title: 'Successfully',
                                content: 'Updated successfully!',
                                onOk: () => {
                                    setFormUpdate()
                                }
                            });
                        }
                    })
                    .catch(err => {
                        console.log('Err', err);
                    });
            };
            img.src = URL.createObjectURL(selectedFile);
            return
        }

        api.bannerApi.updateData(selectedBanner.id, data)
            .then(res => {
                if (res.status == 200) {
                    dispatch(bannerAction.updateData(res.data.data));
                    setFormUpdate(false);
                    Modal.success({
                        title: 'Successfully',
                        content: 'Updated successfully!',
                        onOk: () => {
                            setFormUpdate()
                        }
                    });
                }
            })
            .catch(err => {
                console.log('Err', err)
            })
    }

    return (
        <>
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <form onSubmit={(e) => {
                    updateBanner(e)
                }} className='form'>
                    <h2>Update Banner</h2>
                    {/* id */}
                    <div className="banner-id">ID :{selectedBanner.id}</div>
                    {/* title */}
                    <div >
                        <label htmlFor="">Title :</label>
                        <input type="text" name='title' placeholder='Title Banner' defaultValue={selectedBanner.title} />
                    </div>
                    {/* img */}
                    <div className='img'>
                        <label htmlFor="">Image :</label>
                        <img src={`${import.meta.env.VITE_SERVER}/${selectedBanner.banner}`} />
                        <input type="file" name='banner' onChange={(e: any) => {
                            if (e.target.files.length > 0) {
                                let imgEl = e.target.parentNode.querySelector('img');
                                imgEl.src = URL.createObjectURL(e.target.files[0])
                            }
                        }} />
                    </div>

                    {/* status */}
                    <div>
                        <label htmlFor="">Status :</label>
                        <select name='status' defaultValue={selectedBanner?.status || ''}>
                            <option key={Date.now() * Math.random()} value='active'>Active</option>
                            <option key={Date.now() * Math.random()} value='inactive'>Inactive</option>
                        </select>
                    </div>

                    {/* time */}
                    <div className='time'>
                        {/* create at */}
                        <div >
                            <label htmlFor="">Create At</label>
                            {`${(new Date(selectedBanner.createAt)).getDate()}/${(new Date(selectedBanner.createAt)).getMonth() + 1}/${(new Date(selectedBanner.createAt)).getFullYear()} - ${(new Date(selectedBanner.createAt)).getHours()}h : ${String((new Date(selectedBanner.createAt)).getMinutes()).padStart(2, '0')}'`}
                        </div>

                        {/* update at */}
                        <div>
                            <label htmlFor="">Update At</label>
                            {
                                selectedBanner.updateAt ? (
                                    <div >
                                        {`${(new Date(selectedBanner.updateAt)).getDate()}/${(new Date(selectedBanner.updateAt)).getMonth() + 1}/${(new Date(selectedBanner.updateAt)).getFullYear()} - ${(new Date(selectedBanner.updateAt)).getHours()}h : ${String((new Date(selectedBanner.updateAt)).getMinutes()).padStart(2, '0')}'`}
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                    </div>

                    {/* button save */}
                    <div >
                        <button className="noselect" type='submit'>
                            <span className="text">Save</span>
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}


